// Color Wheel:
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
                          ], // RGB Circle*/
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
                          ], // HSL Circle
        borderWidth: 5,
        data: [1,1,1,1,1,1,1,1,1,1,1,1],
        
       }, 
    ]
  },
  
  options: {
    cutoutPercentage: 50,
    legend: {display: false,},
    tooltips: {enabled: false,},
    elements: {
      center: {
        text: '',
        color: '#FFFFFF', // Default is #000000
        fontStyle: 'Roboto Mono', // Default is Arial
        sidePadding: 20, // Default is 20 (as a percentage)
        minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
        lineHeight: 25 // Default is 25 (in px), used for when text wraps
      }
    }
  }  

}); 

// Colors in the Color Wheel:
rgbCircle = [[255, 255, 0], [255, 132, 0], [255, 0, 0], [247, 0, 64], [239, 2, 126], [131, 1, 126], [19, 0, 123], [10, 82, 165], [0, 159, 197], [0, 147, 126], [0, 140, 57], [130, 198, 28]];
hslCircle = [[255, 0, 0], [255, 127, 0], [255, 255, 0], [127, 255, 0], [0, 255, 0], [0, 255, 127], [0, 255, 255], [0, 127, 255], [0, 0, 255], [127, 0, 255], [255, 0, 255], [255, 0, 127]];
var hues = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; // The 12 hues of our circle, filled in the next step
var palette = []; // Built in the next step

/*
* Generate a color palette containing the colors in the color circle AND THEIR SHADES 
* (different luminance and saturation values), plus some greys (for aesthetical purposes).
* We cannot use the color wheel as it is because less saturated colors or colors w/ high 
* or low luminance would be mapped in greys causing loss of information about hues.
* Total number of colors: 246.
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
var hue_hist = []; // Hue histogram of the quantized image (max 12 hues)
var resulting_mode = [];
var scale_notes = [];
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

//modes in binary form
var lydian =    [1,0,1,0,1,0,1,1,0,1,0,1];
var ionian =    [1,0,1,0,1,1,0,1,0,1,0,1];
var mixolydian= [1,0,1,0,1,1,0,1,0,1,1,0];
var dorian =    [1,0,1,1,0,1,0,1,0,1,1,0];
var aeolian =   [1,0,1,1,0,1,0,1,1,0,1,0];
var phrygian =  [1,1,0,1,0,1,0,1,1,0,1,0];
var locrian =   [1,1,0,1,0,1,1,0,1,0,1,0];
var modes = [lydian, ionian, mixolydian, dorian, aeolian, phrygian, locrian];

//function to rotate arrays
function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

// Create web audio API context:
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// create Oscillators and Gain nodes:
var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
var osc4 = audioCtx.createOscillator();
osc1.type = 'sawtooth';
osc2.type = 'sawtooth';
osc3.type = 'sawtooth';
osc4.type = 'triangle';
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
        var q1 = new RgbQuant(opts);
        q1.sample(DAT);
        var resulting_freqs = q1.histFrequencies();

        // Hue histogram w/ duplicates (no greys), useful for debugging:
        /*var hue_hist_dup = [];
        for (i = 0; i<resulting_palette.length; i++) {
          if (!(resulting_palette[i][0] == resulting_palette[i][1] && resulting_palette[i][1] == resulting_palette[i][2])) {
            hue_hist_dup.push([Math.round(255 * rgbToHsl(resulting_palette[i][0], resulting_palette[i][1], resulting_palette[i][2])[0]), resulting_freqs[i]]);
          }
        }
        console.log("hue hist w/ duplicates:");
        console.log(hue_hist_dup);*/

        // Extract Hue histogram from quantized image
        var i = 0;
        while (i<resulting_palette.length) {
          if (resulting_palette[i][0] == resulting_palette[i][1] && resulting_palette[i][1] == resulting_palette[i][2]) 
            i++; // ignore greys
          else {
            var current_hue = Math.round(255 * rgbToHsl(resulting_palette[i][0], resulting_palette[i][1], resulting_palette[i][2])[0]);
            var current_freq = resulting_freqs[i]; // occurrences of the considered color
            var already_present = false;
            if (hue_hist.length == 0) { // insert first element w/o checking if already present
              hue_hist.push([current_hue, current_freq]);
              i++;
            }
            else {
              for (j = 0; j<hue_hist.length; j++) { // check if the hue is already present, update occurrencies if it is
                if (hue_hist[j][0] == current_hue) {
                  hue_hist[j][1] =  hue_hist[j][1] + current_freq;
                  already_present = true;
                  break;
                }
              }
              if (!already_present) // if hue is not already present add it to current_colors
                hue_hist.push([current_hue, current_freq]);
              i++;
            }
          }
        }
        hue_hist.sort(function(a,b) { // sort the hue histogram by occurrences (descending order)
          return b[1]-a[1]
        });

        //rot determines the rotation of the array to be confronted depending on the most prominent value
        rot = hues.indexOf(hue_hist[0][0]);
  
        //hues_r is the hue array w/ the most present hue at the first place
        hues_r = arrayRotate(hues, rot);
       
        /* 
        * Here's how we decide what's the most similar mode: for each element in common between the
        * resulting scale and one of the modes, the score of said mode increases by a number which is
        * proportional to the occurrence of that element (color/note).
        * The mode with the highest score is the chosen one.
        */
        resulting_scale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i=0; i<hue_hist.length; i++) { // Put the number of occurrences in place of the present notes/colors
          resulting_scale[hues_r.indexOf(hue_hist[i][0])] = hue_hist[i][1] //alternatively: 12 - hue_hist.indexOf(hue_hist[i]);      
        }
        var scores = []; // Build array of scores
        for (i = 0; i < 7; i++) {
          var current_score = 0;
          for (j = 0; j < 12; j++) {
            current_score += modes[i][j]*resulting_scale[j];
          }
          scores.push(current_score);
        }
        resulting_mode = modes[indexOfMax(scores)]; // Pick the mode with the highest scores

        for (i = 0; i < 12; i++) {
          if (resulting_mode[i])
            scale_notes.push(i + 1);
        }
	    }
	  
      img.src = e.target.result;

      // Eyedropper functionalities:

      $("#myimage").click(function (e) {
      var mouseX = parseInt(e.offsetX);
      var mouseY = parseInt(e.offsetY);
      var pxData = context.getImageData(mouseX, mouseY, 1, 1);
      var eyeDropperColor = [pxData.data[0], pxData.data[1], pxData.data[2]];
      var grey = false;
      if (eyeDropperColor[0] == eyeDropperColor[1] && eyeDropperColor[0] == eyeDropperColor[2]) {
        grey = true;
      }
      if (!grey) {
        var playingColor = Math.round(255 * rgbToHsl(eyeDropperColor[0], eyeDropperColor[1], eyeDropperColor[2])[0]); // Extract hue of current color
        $(".change-image").css("backgroundColor", "rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")");
        var index = hues_r.indexOf(playingColor);
        // Determine the intervals of the chord notes. PROBLEM: some colors of the image do not correspond to any note in the resulting mode.
        var skip1 = nextInterval(resulting_mode, index); // skip the next note in the scale
        var int1 = nextInterval(resulting_mode, index + skip1) + skip1; // first interval of the chord
        var skip2 = nextInterval(resulting_mode, (index + int1)) + int1;
        var int2 = nextInterval(resulting_mode, (index + skip2)) + skip2; // second interval of the chord
        //var skip3 = nextInterval(resulting_mode, (index + int2)) + int3; 
        //var int3 = nextInterval(resulting_mode, (index + skip3)) + skip3; // third interval of the chord
        osc1.frequency.value = 440*Math.pow(2, index/12); 
        osc2.frequency.value = 440*Math.pow(2, (index + int1)/12);
        osc3.frequency.value = 440*Math.pow(2, (index + int2)/12);
        osc4.frequency.value = (440*Math.pow(2, index/12))/2; // Bass note
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1);
        //g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        var [triad, mode] = selectTriad(resulting_mode,index);
        var mode_visualizer = document.getElementById('mode-visualizer');
        mode_visualizer.innerHTML = mode;
        chart.options.elements.center.text = triad;
        chart.update();
      }
      else {
        g.gain.setValueAtTime(0, audioCtx.currentTime);
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
  hue_hist = []; 
  resulting_mode = [];
  scale_notes = [];
}

$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});

/*-----------------------------------------------------------
 FUNCTIONS:
 ----------------------------------------------------------*/

/***********************************************************
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 ***********************************************************/
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

/************************************************************ 
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 ************************************************************/

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

/******************************************* 
* Returns index of max element in array arr
********************************************/
function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}
/************************************************************************************* 
* Given a mode and a note, return the interval in semitones with the next degree note
*************************************************************************************/
function nextInterval(mode, note) {
  if (mode[note] == 0) {
    console.log("This note is not present in the mode.")
    return NaN;
  }
  var index = note % 12;
  var i = 1;
  while (mode[index + i] == 0) 
    i++;
  return i;
}

/*****************************************************************************************
* TRIADS: select the chord depending on the mode and the position of the note in the scale
*****************************************************************************************/
function selectTriad(resulting_mode, note) {

  var triad;
  var mode;

  switch(resulting_mode) {
//----------------------lydian------------------------------------
    case modes[0]:
      mode = "Lydian"
      if (note==0||note==2||note==7) {
        triad="MAJOR";
      }
      if (note==4||note==9||note==11) {
        triad="minor";
      }
      if (note==6) {
        triad="diminished";
      }
//-------------------------ionian---------------------------------
    case modes[1]:
      mode = "Ionian"
      if (note==0||note==5||note==7) {
        triad="MAJOR";
      }
      if (note==2||note==4||note==9) {
        triad="minor";
      }
      if (note==11) {
        triad="diminished";
      }
//---------------------------mixolydian-------------------------------
    case modes[2]:
      mode = "Myxolydian"
      if (note==0||note==5||note==10) {
        triad="MAJOR";
      }
      if (note==2||note==7||note==9) {
        triad="minor";
      }
      if (note==4) {
        triad="diminished";
      }
//---------------------------dorian-------------------------------
    case modes[3]:
      mode = "Dorian"
      if (note==3||note==5||note==10) {
        triad="MAJOR";
      }
      if (note==0||note==2||note==7) {
        triad="minor";
      }
      if (note==9) {
        triad="diminished";
      }
//----------------------------aeolian------------------------------
    case modes[4]:
      mode = "Aeolian"
      if (note==3||note==8||note==10) {
        triad="MAJOR";
      }
      if (note==0||note==5||note==7) {
        triad="minor";
      }
      if (note==2) {
        triad="diminished";
      }
//-------------------------phrygian---------------------------------
    case modes[5]:
      mode = "Phrygian"
      if (note==1||note==3||note==8) {
        triad="MAJOR";
      }
      if (note==0||note==5||note==10) {
        triad="minor";
      }
      if (note==7) {
        triad="diminished";
      }
//--------------------------locrian--------------------------------
    case modes[6]:
      mode = "Locrian"
      if (resulting_mode==modes[6] && (note==1||note==6||note==8)) {
        triad="MAJOR";
      }
      if (resulting_mode==modes[6] && (note==3||note==5||note==10)) {
        triad="minor";
      }
      if (resulting_mode==modes[6] && (note==0)) {
        triad="diminished";
      }
  }

  /*
//----------------------lydian------------------------------------
  if (resulting_mode==modes[0] && (note==0||note==2||note==7)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[0] && (note==4||note==9||note==11)) {
    triad="minor";
  }
  if (resulting_mode==modes[0] && (note==6)) {
    triad="diminished";
  }

//-------------------------ionian---------------------------------
  if (resulting_mode==modes[1] && (note==0||note==5||note==7)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[1] && (note==2||note==4||note==9)) {
    triad="minor";
  }
  if (resulting_mode==modes[1] && (note==11)) {
    triad="diminished";
  }

//---------------------------mixolydian-------------------------------
  if (resulting_mode==modes[2] && (note==0||note==5||note==10)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[2] && (note==2||note==7||note==9)) {
    triad="minor";
  }
  if (resulting_mode==modes[2] && (note==4)) {
    triad="diminished";
  }

//---------------------------dorian-------------------------------
  if (resulting_mode==modes[3] && (note==3||note==5||note==10)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[3] && (note==0||note==2||note==7)) {
    triad="minor";
  }
  if (resulting_mode==modes[3] && (note==9)) {
    triad="diminished";
  }

//----------------------------aeolian------------------------------
  if (resulting_mode==modes[4] && (note==3||note==8||note==10)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[4] && (note==0||note==5||note==7)) {
    triad="minor";
  }
  if (resulting_mode==modes[4] && (note==2)) {
    triad="diminished";
  }

//-------------------------phrygian---------------------------------
  if (resulting_mode==modes[5] && (note==1||note==3||note==8)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[5] && (note==0||note==5||note==10)) {
    triad="minor";
  }
  if (resulting_mode==modes[5] && (note==7)) {
    triad="diminished";
  }

//--------------------------locrian--------------------------------
  if (resulting_mode==modes[6] && (note==1||note==6||note==8)) {
    triad="MAJOR";
  }
  if (resulting_mode==modes[6] && (note==3||note==5||note==10)) {
    triad="minor";
  }
  if (resulting_mode==modes[6] && (note==0)) {
    triad="diminished";
  }*/
  
  return [triad, mode];
}
/******************************************************************************** 
* Modification to Chart.js in order to obtain text at the center of donut chart:
********************************************************************************/
Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      var words = txt.split(' ');
      var line = '';
      var lines = [];

      // Break words up into multiple lines if necessary
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (var n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});