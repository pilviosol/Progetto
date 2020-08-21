// Color Wheel:
//ollare
//modes in binary form
var lydian =    [1,0,1,0,1,0,1,1,0,1,0,1];
var ionian =    [1,0,1,0,1,1,0,1,0,1,0,1];
var mixolydian= [1,0,1,0,1,1,0,1,0,1,1,0];
var dorian =    [1,0,1,1,0,1,0,1,0,1,1,0];
var aeolian =   [1,0,1,1,0,1,0,1,1,0,1,0];
var phrygian =  [1,1,0,1,0,1,0,1,1,0,1,0];
var locrian =   [1,1,0,1,0,1,1,0,1,0,1,0];

//function to rotate arrays
function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}
//all values
var values    = [0,21,43,64,85,106,128,149,170,191,213,234];


var ctx = document.getElementById('colorWheel').getContext('2d');
var chart = new Chart(ctx, {
  
  type: 'doughnut', 
  
  data: {
    labels: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#" ],
    datasets: [
      {
        /*backgroundColor: [ 'rgb(255, 255, 0)',
                           'rgb(255, 132, 0)',
                           'rgb(255, 0, 0)',
                           'rgb(247, 0, 64)',
                           'rgb(239, 2, 126)',
                           'rgb(131, 1, 126)',
                           'rgb(19, 0, 123)',                                 
                           'rgb(10, 82, 165)',
                           'rgb(0, 159, 197)',                                   
                           'rgb(0, 147, 126)',
                           'rgb(0, 140, 57)', 
                           'rgb(130, 198, 28)'
                          ],*/
        backgroundColor: [ 'rgb(255, 0, 0)',
                           'rgb(255, 127, 0)',
                           'rgb(255, 255, 0)',
                           'rgb(127, 255, 0)',
                           'rgb(0, 255, 0)',
                           'rgb(0, 255, 127)',
                           'rgb(0, 255, 255)',                                 
                           'rgb(0, 127, 255)',
                           'rgb(0, 0, 255)',                                   
                           'rgb(127, 0, 255)',
                           'rgb(255, 0, 255)', 
                           'rgb(255, 0, 127)'
                          ],
        borderWidth: 5,
        data: [1,1,1,1,1,1,1,1,1,1,1,1],
        
       }, 
    ]
  },
  
  options: {
    cutoutPercentage: 50,
    legend: {display: false,},
    tooltips: {enabled: false,},
  }  

}); 

// Colors in the Color Wheel:
rgbCircle = [[255, 255, 0], [255, 132, 0], [255, 0, 0], [247, 0, 64], [239, 2, 126], [131, 1, 126], [19, 0, 123], [10, 82, 165], [0, 159, 197], [0, 147, 126], [0, 140, 57], [130, 198, 28]];
hslCircle = [[255, 0, 0], [255, 127, 0], [255, 255, 0], [127, 255, 0], [0, 255, 0], [0, 255, 127], [0, 255, 255], [0, 127, 255], [0, 0, 255], [127, 0, 255], [255, 0, 255], [255, 0, 127]];
var hues = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; // Filled in the next step
var palette = []; // Built in the next step

/*
* Generate a color palette containing the colors in the color circle AND THEIR SHADES 
* (different luminance and saturation values), plus some greys (for aesthetical purposes).
* We cannot use the color wheel as it is because we would loose too much information about hues
* (a lot of colors become greys).
*/
for(i=0; i<12; i++) {
  var currentColor = hslCircle[i];
  var hue = rgbToHsl(currentColor[0], currentColor[1], currentColor[2])[0]; // Extract hue
  hues[i] = Math.round(255 * hue); // Fill hues array
  for(j=1; j<6; j++) { // saturation values
    for(k=1; k<5; k++) { // luminance values
      palette.push(hslToRgb(hue, (2*j)/10, (2*k)/10));
    }
  }
}
for(h=0; h<6; h++) { // greys
  palette.push([51*h, 51*h, 51*h]);
}

// Image data and quantization data
var canvas;
var context;
var imageData;
var width;
var height;
var resulting_palette;
var resulting_colors = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
var most_present_color = [0, 0, 0];
var opts = {
	colors: 24,              // desired palette size
	method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
	boxSize: [64,64],        // subregion dims (if method == 2)
	boxPxls: 2,              // min-population threshold (if method == 2)
	initColors: 4096,        // # of top-occurring colors to start with (if method == 1)
	minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
	dithKern: null,          // dithering kernel name, see available kernels in docs below
	dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
	dithSerp: false,         // enable serpentine pattern dithering
	palette: palette,        // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
	reIndex: true,           // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
	useCache: false,         // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
	cacheFreq: 10,           // min color occurance count needed to qualify for caching
	colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
};

// Create web audio API context:
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// create Oscillator and Gain nodes:
var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
var osc4 = audioCtx.createOscillator();
osc1.type = 'sawtooth';
osc2.type = 'sawtooth';
osc3.type = 'sawtooth';
osc4.type = 'sawtooth';
var g = audioCtx.createGain();
g.gain.value = 0;
osc1.connect(g);
osc2.connect(g);
osc3.connect(g);
osc4.connect(g);
g.connect(audioCtx.destination); 
osc1.start();
osc2.start();
osc3.start();
osc4.start();

// Handle input image:
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var file  = input.files[0];
    reader.onload = function(e) {
      background = document.getElementById('dynamic-background');
      $('.image-upload-wrap').hide();
      $('.file-upload-content').show();
      background.classList.remove('initial-bg');
      background.classList.add('updated-bg');
      background.style.backgroundImage = 'url(' + e.target.result + ')';
      canvas = document.getElementById("myimage");
      context = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() {
        // Limit the dimensions of the canvas to 400x400 mantaining ratio
        if (img.width > img.height) {
          width = 400;
          canvas.width = width;
          height = Math.round((img.height*400)/(img.width));
          canvas.height = height;
          context.drawImage(img,0,0,width,height)
        }
        else {
          height = 400;
          canvas.height = height;
          width = Math.round((img.width*400)/(img.height));
          canvas.width = width;
          context.drawImage(img,0,0,width,height)
        }
        imageData = context.getImageData(0,0,width,height).data;
        // Quantize image
		    var q = new RgbQuant(opts);
		    q.sample(imageData);
		    var outA = q.reduce(imageData);
        var uint8clamped = new Uint8ClampedArray(outA.buffer);
		    var DAT = new ImageData(uint8clamped, width, height);
        context.putImageData(DAT, 0, 0);

        /* 
        * Obtain color list from quantized image. 
        * tuples if true will return an array of [r,g,b] triplets, otherwise a Uint8Array is returned by default. 
        * noSort if true will disable palette sorting by hue/luminance and leaves it ordered from highest to lowest color occurrence counts.
        */
        var tuples = true;
        var noSort = true;
        resulting_palette = q.palette(tuples, noSort); 

        var i = 0;
        var j = 0;
        while (i<resulting_palette.length) { // Remove greys from color list
          if (resulting_palette[i][0] == resulting_palette[i][1] && resulting_palette[i][1] == resulting_palette[i][2]) {
            resulting_palette.splice(i, 1);
          }

          else { // Extract hue and store it if it hasn't been found yet
            var current_hue = Math.round(255 * rgbToHsl(resulting_palette[i][0], resulting_palette[i][1], resulting_palette[i][2])[0]);
            /*if (j==0 || current_hue - resulting_colors[j-1] != 0) {
              resulting_colors[j] = current_hue;
              j++;
            }*/
            resulting_colors[i] = current_hue;
            i++;
          }
        }
        resulting_colors = [...new Set(resulting_colors)]; // Remove duplicates
        if ((resulting_colors[resulting_colors.length - 1]) == -1) {resulting_colors.pop();} // Delete last element if -1
        console.log(resulting_colors);
        //x determines the rotation of the array to be confronted depending on the most prominent value
        x=0;
        if (resulting_colors[0]==0){x=0};
        if (resulting_colors[0]==21){x=1};
        if (resulting_colors[0]==43){x=2};
        if (resulting_colors[0]==64){x=3};
        if (resulting_colors[0]==85){x=4};
        if (resulting_colors[0]==106){x=5};
        if (resulting_colors[0]==128){x=6};
        if (resulting_colors[0]==149){x=7};
        if (resulting_colors[0]==170){x=8};
        if (resulting_colors[0]==191){x=9};
        if (resulting_colors[0]==213){x=10};
        if (resulting_colors[0]==234){x=11};
  
        console.log(x);
        //values2 is the array rotated
        values2 = arrayRotate(values, x);
        console.log(values2);
        //now we'll multiplicate the values of values2 elementwise with the binary format of the modes in order to
        //select only the values that are present on that scale. This because later we'll confont those values with the
        // values in the array resulting_colors to see what's the most similar mode

        //here's the example with ionian scale
        ionian_values=[0,0,0,0,0,0,0,0,0,0,0,0];
        for (i=0;i<12;i++) {
          //elementwise multiplication
          ionian_values[i]=values2[i]*ionian[i];
        };
        console.log(ionian_values);

        //here's how we decide what's the most similar mode: we confront the values of resulting_colors with, for example,
        //ionian_values. For each value that is present in both scales, the punteggio increases by one.
        //We'll do it for every mode and then select the max "punteggio" to decide the mode
        punteggio_ionian=0;
        for (i=0;i<resulting_colors.length;i++)
        {
          if (resulting_colors[i]==ionian_values[1] || resulting_colors[i]==ionian_values[2]||
            resulting_colors[i]==ionian_values[3] || resulting_colors[i]==ionian_values[4]||
            resulting_colors[i]==ionian_values[5] || resulting_colors[i]==ionian_values[6]||
            resulting_colors[i]==ionian_values[7] || resulting_colors[i]==ionian_values[8]||
            resulting_colors[i]==ionian_values[9] || resulting_colors[i]==ionian_values[10]||
            resulting_colors[i]==ionian_values[11] || resulting_colors[i]==ionian_values[0])
            {punteggio_ionian++};
        };
        console.log(punteggio_ionian);
        
        values    = [0,21,43,64,85,106,128,149,170,191,213,234];
        

	    }
	  
      img.src = e.target.result;

      // Eyedropper functionalities:

      $("#myimage").click(function (e) {
      var mouseX = parseInt(e.offsetX);
      var mouseY = parseInt(e.offsetY);
      var pxData = context.getImageData(mouseX, mouseY, 1, 1);
      var eyeDropperColor = [pxData.data[0], pxData.data[1], pxData.data[2]];
      console.log("Mouse position: " + mouseX + "," + mouseY);
      var grey = false;
      if (eyeDropperColor[0] == eyeDropperColor[1] && eyeDropperColor[0] == eyeDropperColor[2]) {
        grey = true;
      }
      if (!grey) {
        var playingColor = Math.round(255 * rgbToHsl(eyeDropperColor[0], eyeDropperColor[1], eyeDropperColor[2])[0]); // Extract hue of current color
        console.log("Hue: " + playingColor);
        $(".change-image").css("backgroundColor", "rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")");
        //g.gain.value = 0.5;
        var index = hues.indexOf(playingColor);
        osc1.frequency.value = 440*Math.pow(2, index/12); // value in hertz
        osc2.frequency.value = 440*Math.pow(2, (index + 2)/12);
        osc3.frequency.value = 440*Math.pow(2, (index + 4)/12);
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.5);
        g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        //osc4.frequency.value = 440*Math.pow(2, (index + 5)/12);
      }
      else {
        g.gain.value = 0;
      }
      
      });
      
    };
    
    reader.readAsDataURL(file);
  } 
  
  else {
    removeUpload();
  }
  
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
  g.gain.value = 0;
}

$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});


/*
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 */
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

/*
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}