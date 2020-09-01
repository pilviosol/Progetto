// Create web audio API context:
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillators, Filter and Gain nodes:
osc0 = audioCtx.createOscillator(); // Bass note
osc1 = audioCtx.createOscillator(); // Root note
osc2 = audioCtx.createOscillator(); // 3rd
osc3 = audioCtx.createOscillator(); // 5th
osc4 = audioCtx.createOscillator(); // 7th
osc0.type = 'square';
osc1.type = 'sawtooth';
osc2.type = 'sawtooth';
osc3.type = 'sawtooth';
osc4.type = 'sawtooth';
// Lowpass filter
f = audioCtx.createBiquadFilter(); 
f.type = 'lowpass';
f.frequency.setValueAtTime(2500, audioCtx.currentTime);
// White noise
/*var bufferSize = 2 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);
for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
}
var whiteNoise = audioCtx.createBufferSource();
whiteNoise.buffer = noiseBuffer;
whiteNoise.loop = true;*/
// Reverb
reverbNode = audioCtx.createConvolver();
/* 
* impulseResponse is defined in another file as a base64 encoded string,
* we need to convert it to a binary array.
*/
reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
audioCtx.decodeAudioData(reverbSoundArrayBuffer, 
  function(buffer) {
    reverbNode.buffer = buffer;
  },
  function(e) {
    alert("Error when decoding audio data" + e.err);
  }
);
// Connections between nodes
gbass = audioCtx.createGain();
gr = audioCtx.createGain();
g3 = audioCtx.createGain();
g5 = audioCtx.createGain();
g7 = audioCtx.createGain();
gn = audioCtx.createGain();
g = audioCtx.createGain(); // Output gain
singleGain = 0.07;
gbass.gain.value = singleGain * 0.75;
gr.gain.value = singleGain;
g3.gain.value = singleGain;
g5.gain.value = singleGain;
g7.gain.value = 0; // Gain for the 7th
//gn.gain.value = 0 // Gain for the noise osc
g.gain.value = 0; // Gain for the triad + bass
osc0.connect(gbass);
osc1.connect(gr);
osc2.connect(g3);
osc3.connect(g5);
osc4.connect(g7);
gbass.connect(f);
gr.connect(f);
g3.connect(f);
g5.connect(f);
g7.connect(f);
f.connect(g);
//whiteNoise.connect(gn);
//gn.connect(g);
g.connect(reverbNode);
reverbNode.connect(audioCtx.destination);
//Starting sources:
//whiteNoise.start(0);
osc0.start();
osc1.start();
osc2.start();
osc3.start();
osc4.start();

// Musical variables
$('#select-tonic').prop('selectedIndex', 0); // Restore tonic selector to default value
var note_names = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
var selected_tonic = 0;
$('#select-tonic').on('change', function() { // Rotate note names array accordingly to the selected tonic: default is A
  selected_tonic = this.value - 1;
  note_names = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
  arrayRotate(note_names, selected_tonic);
});
//modes in binary form
var lydian =    [1,0,1,0,1,0,1,1,0,1,0,1];
var ionian =    [1,0,1,0,1,1,0,1,0,1,0,1];
var mixolydian= [1,0,1,0,1,1,0,1,0,1,1,0];
var dorian =    [1,0,1,1,0,1,0,1,0,1,1,0];
var aeolian =   [1,0,1,1,0,1,0,1,1,0,1,0];
var phrygian =  [1,1,0,1,0,1,0,1,1,0,1,0];
var locrian =   [1,1,0,1,0,1,1,0,1,0,1,0];
var modes = [lydian, ionian, mixolydian, dorian, aeolian, phrygian, locrian]; // Array of modes
var resulting_mode = []; // Mode obtained from the image in binary form
var mode_intervals = []; // Intervals in semitones (from the tonic) of the obtained mode. Contains 7 values.
var index; // Distance in semitones between the root note of the playing chord and the the tonic
var int1;
var int2;
var int3;
var degree; // Degree of the root note of the currently playing chord (int)
var degree_name = ""; // Degree of the root note of the currently playing chord (String)
var triad = ""; // Can be "min", "maj", or "dim". Determined by the first 3 noted of the currently playing chord. Determied by function selectTriad
var chord = ""; // If the currently playing chord is a triad then chord = triad, if it's a quadriad the name is determined by function selectQuadriad
var quadriad = false; // Boolean value which determines if the played chord is a triad or a quadriad.
$("#quadriad-switch-input").prop( "checked", false ); // Restore quadriad toggle switch to "off" position
$("#quadriad-switch-input").on('change', function() {
  if ($(this).is(':checked')) {
    quadriad = $(this).is(':checked'); // true, chords are quadriads
  }
  else {
    quadriad = $(this).is(':checked'); // false, chords are triads
  }
});

// Color Wheel:
/*var wheelBackground = [ 'rgb(255, 255, 0)',
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
                        ]; // RGB Circle
var wheelBackground = [ 'rgb(255, 0, 0)',
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
                      ]; // HSL Circle*/
const wheelBackground = [ "#FF0000",
                          "#FF7F00",
                          "#FFFF00",
                          "#7FFF00",
                          "#00FF00",
                          "#00FF7F",
                          "#00FFFF",
                          "#007FFF",
                          "#0000FF",
                          "#7F00FF",
                          "#FF00FF",
                          "#FF007F"
                        ]; // HSL Circle, hex format
var ctx = document.getElementById('colorWheel').getContext('2d');
var chart = new Chart(ctx, {
  
  type: 'doughnut', 
  
  data: {
    labels: note_names, 
    datasets: [
      {
        backgroundColor: wheelBackground, 
        borderWidth: 3,
        // borderColor: 'rgb(0, 0, 0)',
        data: [1,1,1,1,1,1,1,1,1,1,1,1],
       }, 
    ]
  },
  
  options: {
    cutoutPercentage: 50,
    legend: {display: false,},
    tooltips: {
      enabled: false,
      /*displayColors: false,*/
    },
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

// Colors in the Color Wheel as an array of RGB triplets:
// rgbCircle = [[255, 255, 0], [255, 132, 0], [255, 0, 0], [247, 0, 64], [239, 2, 126], [131, 1, 126], [19, 0, 123], [10, 82, 165], [0, 159, 197], [0, 147, 126], [0, 140, 57], [130, 198, 28]];
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
var mode_visualizer = document.getElementById('mode-visualizer');
var hue_hist = []; // Hue histogram of the quantized image (max 12 hues)
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

// Handle input image:
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var file  = input.files[0];
    reader.onload = function(e) {
      background = document.getElementById('dynamic-background');
      $('.image-upload-wrap').hide();
      $('.file-upload-content').show();
      $('#quadriad-switch').show();
      $('#quadriad-text').show();
      background.classList.remove('initial-bg');
      background.classList.add('updated-bg');
      background.style.backgroundImage = 'url(' + e.target.result + ')';
      canvas = document.getElementById("myimage");
      context = canvas.getContext("2d");
      var img = new Image();
      var maxDim = 400;
      img.onload = function() {
        // Limit the dimensions of the canvas to maxDim x maxDim mantaining ratio
        if (img.width > img.height) {
          width = maxDim;
          canvas.width = width;
          height = Math.round((img.height*maxDim)/(img.width));
          canvas.height = height;
          context.drawImage(img,0,0,width,height)
        }
        else {
          height = maxDim;
          canvas.height = height;
          width = Math.round((img.width*maxDim)/(img.height));
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

        // rot determines the rotation of the array to be confronted depending on the most prominent value
        rot = hues.indexOf(hue_hist[0][0]);
  
        // hues_r is the hue array w/ the most present hue at the first place
        hues_r = arrayRotate(hues, rot);
        // Restore wheel to initial position before rotating, we cannot use wheelBackground since it gets modified by pSBC
        chart.data.datasets[0].backgroundColor = [ "#FF0000", 
                                                   "#FF7F00",
                                                   "#FFFF00",
                                                   "#7FFF00",
                                                   "#00FF00",
                                                   "#00FF7F",
                                                   "#00FFFF",
                                                   "#007FFF",
                                                   "#0000FF",
                                                   "#7F00FF",
                                                   "#FF00FF",
                                                   "#FF007F"
                                                 ]; 
        arrayRotate(chart.data.datasets[0].backgroundColor, rot); // Rotate color wheel bringing most present color at the top
        chart.update();
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
        var mode_name= modeName(resulting_mode);
        //var mode_visualizer = document.getElementById('mode-visualizer');
        mode_visualizer.innerHTML = "Resulting mode: " + mode_name;
        for (i = 0; i < 12; i++) {
          if (resulting_mode[i])
            mode_intervals.push(i);
        }
      }
	  
      img.src = e.target.result;

      // "Eyedropper" functionalities:
      var silent = true; // No sound is playing
      var lastStart = 0; // Last time a chord was played
      $("#myimage").click(function (e) {
        audioCtx.resume();
        var mouseX = parseInt(e.offsetX);
        var mouseY = parseInt(e.offsetY);
        var pxData = context.getImageData(mouseX, mouseY, 1, 1);
        var eyeDropperColor = [pxData.data[0], pxData.data[1], pxData.data[2]];
        var grey = false;

        if (eyeDropperColor[0] == eyeDropperColor[1] && eyeDropperColor[0] == eyeDropperColor[2]) {
          grey = true;
        }

        if (audioCtx.currentTime - lastStart > 0.6) { // Limit the speed of chord changes to avoid conflicts with envelopes
          if (!grey) {

            var playingColor = Math.round(255 * rgbToHsl(eyeDropperColor[0], eyeDropperColor[1], eyeDropperColor[2])[0]); // Extract hue of current color
            $(".change-image").css("backgroundColor", "rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")");
            var colorup = playingColor;
            var colordown = colorup;
            while (hues_r.indexOf(playingColor) == -1) { // Deal with incorrect roundings when calculating playingColor
              colorup++;
              colordown--;
              if (hues_r.indexOf(colorup) != -1) playingColor = colorup;
              if (hues_r.indexOf(colordown) != -1) playingColor = colordown;
            }
            index = hues_r.indexOf(playingColor); // Distance in semitones from the tonic
            if (resulting_mode[index] == 0) index--; // Handle colors that are not present in the resulting mode by choosing the previous note
            // Determine the intervals of the chord notes. PROBLEM: some colors of the image do not correspond to any note in the resulting mode.
            var skip1 = nextInterval(resulting_mode, index); // skip the next note in the scale
            int1 = nextInterval(resulting_mode, index + skip1) + skip1; // first interval of the chord
            var skip2 = nextInterval(resulting_mode, (index + int1)) + int1;
            int2 = nextInterval(resulting_mode, (index + skip2)) + skip2; // second interval of the chord
            var skip3 = nextInterval(resulting_mode, (index + int2)) + int2; 
            int3 = nextInterval(resulting_mode, (index + skip3)) + skip3; // third interval of the chord
            var root = index + selected_tonic;
            osc0.frequency.value = (220*Math.pow(2, root/12))/2; // Bass note
            osc1.frequency.value = 220*Math.pow(2, root/12); // Root note
            osc2.frequency.value = 220*Math.pow(2, (root + int1)/12); // 3rd
            osc3.frequency.value = 220*Math.pow(2, (root + int2)/12); // 5th
            osc4.frequency.value = 220*Math.pow(2, (root + int3)/12); // 7th
            //var noise_gain = rgbToHsl(eyeDropperColor[0], eyeDropperColor[1], eyeDropperColor[2])[2];
            //gn.gain.setValueAtTime(noise_gain * 0.07, audioCtx.currentTime);
            if (silent) { // Increase volume "slowly" when there's no previous sound playing
              g.gain.setValueAtTime(0, audioCtx.currentTime);
              g.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.5);
              if (quadriad) {
                g7.gain.setValueAtTime(0, audioCtx.currentTime);
                g7.gain.linearRampToValueAtTime(singleGain, audioCtx.currentTime + 0.5);
              }
              silent = false;
            }
            
            triad = selectTriad(resulting_mode, index); 
            degree = mode_intervals.indexOf(index); // Degree of the root note of the chord
            degree_name = degreeName(degree, triad);
            if (quadriad) { 
              chord = selectQuadriad(resulting_mode,index);
            }
            else {
              chord = triad;
            }

            // Higlight the colors that ar currently playing on the wheel, show the chord name at the center
            chart.data.datasets[0].backgroundColor = [ "#FF0000",
                                                       "#FF7F00",
                                                       "#FFFF00",
                                                       "#7FFF00",
                                                       "#00FF00",
                                                       "#00FF7F",
                                                       "#00FFFF",
                                                       "#007FFF",
                                                       "#0000FF",
                                                       "#7F00FF",
                                                       "#FF00FF",
                                                       "#FF007F"
                                                     ];
            arrayRotate(chart.data.datasets[0].backgroundColor, rot);
            chart.data.datasets[0].backgroundColor[index%12] = pSBC(-0.9, chart.data.datasets[0].backgroundColor[(index)%12]);
            chart.data.datasets[0].backgroundColor[(index + int1)%12] = pSBC(-0.9, chart.data.datasets[0].backgroundColor[(index + int1)%12]);
            chart.data.datasets[0].backgroundColor[(index + int2)%12] = pSBC(-0.9, chart.data.datasets[0].backgroundColor[(index + int2)%12]);
            if (quadriad) 
              chart.data.datasets[0].backgroundColor[(index + int3)%12] = pSBC(-0.9, chart.data.datasets[0].backgroundColor[(index + int3)%12]);
            chart.options.elements.center.text = note_names[index] + chord + " (" + degree_name + ")";
            chart.update();
            lastStart = audioCtx.currentTime;
          }
          // Turn the sound off when clicking greys, restore the color wheel
          else { s
            if (!silent) {
              g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
              g7.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
              silent = true;
              chart.data.datasets[0].backgroundColor = [ "#FF0000",
                                                         "#FF7F00",
                                                         "#FFFF00",
                                                         "#7FFF00",
                                                         "#00FF00",
                                                         "#00FF7F",
                                                         "#00FFFF",
                                                         "#007FFF",
                                                         "#0000FF",
                                                         "#7F00FF",
                                                         "#FF00FF",
                                                         "#FF007F"
                                                       ];
              arrayRotate(chart.data.datasets[0].backgroundColor, rot);
              chart.options.elements.center.text = "";
              chart.update();
            }
          }
        }
      });
      // Turn the sound off when leaving the image, restore the color wheel
      $('#myimage').mouseleave(function(e) { 
        if (!silent) {
          g.gain.setValueAtTime(singleGain, audioCtx.currentTime);
          if (quadriad) g7.gain.setValueAtTime(singleGain, audioCtx.currentTime);
          g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
          g7.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
          silent = true;
          chart.data.datasets[0].backgroundColor = [ "#FF0000",
                                                     "#FF7F00",
                                                     "#FFFF00",
                                                     "#7FFF00",
                                                     "#00FF00",
                                                     "#00FF7F",
                                                     "#00FFFF",
                                                     "#007FFF",
                                                     "#0000FF",
                                                     "#7F00FF",
                                                     "#FF00FF",
                                                     "#FF007F"
                                                   ];
          arrayRotate(chart.data.datasets[0].backgroundColor, rot);
          chart.options.elements.center.text = "";
          chart.update();
          $(".change-image").css("backgroundColor", "rgb(0,0,0)");
        }
      });
    };
    reader.readAsDataURL(file);
  } 
  
  else {
    removeUpload();
  }
}

/*-----------------------------------------------------------
 FUNCTIONS:
 ----------------------------------------------------------*/

/*****************************
* Remove image and reset data:
*****************************/ 
function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
  mode_visualizer.innerHTML = "";
  $('#quadriad-switch').hide();
  $('#quadriad-text').hide();
  g.gain.setValueAtTime(0, audioCtx.currentTime);
  g7.gain.setValueAtTime(0, audioCtx.currentTime);
  hue_hist = []; 
  resulting_mode = [];
  mode_intervals = [];
}

$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});

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
/************************** 
* function to rotate arrays
**************************/
function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
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

/*********************************************************
* Given a mode (binary) and a note (from 0 to 11), returns
* the interval in semitones with the next degree note
*********************************************************/
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

/*************************************************
* Converts base64 encoded string to a binary array
*************************************************/
function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++)        {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/*******************************************************
* TRIADS: select the chord depending on the mode and the 
* position of the note in the scale
*******************************************************/
function selectTriad(resulting_mode, note) {

  var triad;

  switch(resulting_mode) {
//----------------------lydian------------------------------------
    case modes[0]:
      if (note==0||note==2||note==7) {
        triad="maj";
      }
      else if (note==4||note==9||note==11) {
        triad="min";
      }
      else if (note==6) {
        triad="dim";
      }
      else triad="undefined";
      break;
//-------------------------ionian---------------------------------
    case modes[1]:
      if (note==0||note==5||note==7) {
        triad="maj";
      }
      else if (note==2||note==4||note==9) {
        triad="min";
      }
      else if (note==11) {
        triad="dim";
      }
      else triad="undefined";
      break;
//---------------------------mixolydian-------------------------------
    case modes[2]:
      if (note==0||note==5||note==10) {
        triad="maj";
      }
      else if (note==2||note==7||note==9) {
        triad="min";
      }
      else if (note==4) {
        triad="dim";
      }
      else triad="undefined";
      break;
//---------------------------dorian-------------------------------
    case modes[3]:
      if (note==3||note==5||note==10) {
        triad="maj";
      }
      else if (note==0||note==2||note==7) {
        triad="min";
      }
      else if (note==9) {
        triad="dim";
      }
      else triad="undefined";
      break;
//----------------------------aeolian------------------------------
    case modes[4]:
      if (note==3||note==8||note==10) {
        triad="maj";
      }
      else if (note==0||note==5||note==7) {
        triad="min";
      }
      else if (note==2) {
        triad="dim";
      }
      else triad="undefined";
      break;
//-------------------------phrygian---------------------------------
    case modes[5]:
      if (note==1||note==3||note==8) {
        triad="maj";
      }
      else if (note==0||note==5||note==10) {
        triad="min";
      }
      else if (note==7) {
        triad="dim";
      }
      else triad="undefined";
      break;
//--------------------------locrian--------------------------------
    case modes[6]:
      if (note==1||note==6||note==8) {
        triad="maj";
      }
      else if (note==3||note==5||note==10) {
        triad="min";
      }
      else if (note==0) {
        triad="dim";
      }
      else triad="undefined";
      break;
    }
  return triad;
}

/**********************************************************
* QUADRIADS: select the chord depending on the mode and the 
* position of the note in the scale
**********************************************************/

function selectQuadriad(resulting_mode, note) {

  var quadriad;

  switch(resulting_mode) {
//----------------------lydian------------------------------------
    case modes[0]:
      if (note==9||note==11||note==4) {
        quadriad="m7";
      }
      else if (note==0||note==7) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==2) {
        quadriad="7";
      }
      else if (note==6) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[0],note)[0];
      break;
//-------------------------ionian---------------------------------
    case modes[1]:
      if (note==9||note==2||note==4) {
        quadriad="m7";
      }
      else if (note==0||note==5) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==7) {
        quadriad="7";
      }
      else if (note==11) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[1],note)[0];
      break;
//---------------------------mixolydian-------------------------------
    case modes[2]:
      if (note==2||note==7||note==9) {
        quadriad="m7";
      }
      else if (note==10||note==5) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==0) {
        quadriad="7";
      }
      else if (note==4) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[2],note)[0];
      break;
//---------------------------dorian-------------------------------
    case modes[3]:
      if (note==0||note==2||note==7) {
        quadriad="m7";
      }
      else if (note==10||note==3) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==5) {
        quadriad="7";
      }
      else if (note==9) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[3],note)[0];
      break;
//----------------------------aeolian------------------------------
    case modes[4]:
      if (note==0||note==5||note==7) {
        quadriad="m7";
      }
      else if (note==3||note==8) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==10) {
        quadriad="7";
      }
      else if (note==2) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[4],note)[0];
      break;
//-------------------------phrygian---------------------------------
    case modes[5]:
      if (note==0||note==5||note==10) {
        quadriad="m7";
      }
      else if (note==1||note==8) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==3) {
        quadriad="7";
      }
      else if (note==7) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[5],note)[0];
      break;
//--------------------------locrian--------------------------------
    case modes[6]:
      if (note==3||note==5||note==10) {
        quadriad="m7";
      }
      else if (note==1||note==6) {
        quadriad=String.fromCharCode(916);
      }
      else if (note==8) {
        quadriad="7";
      }
      else if (note==0) {
        quadriad="m7/5-";
      }
      else quadriad=nearestQuadriad(modes[6],note)[0];
      break;
    }
  return quadriad;
}

function modeName(mode) {
  var mode_name = ""
  switch (mode) {
    case modes[0]:
      mode_name = "Lydian";
      break;
    case modes[1]:
      mode_name = "Ionian";
      break;
    case modes[2]:
      mode_name = "Myxolydian";
      break;
    case modes[3]:
      mode_name = "Dorian";
      break;
    case modes[4]:
      mode_name = "Aeolian";
      break;
    case modes[5]:
      mode_name = "Phrygian";
      break;
    case modes[6]:
      mode_name = "Locrian";
      break;
  }
  return mode_name;
}
  
function degreeName(degree, triad) {
  var degree_name = "";
  switch (degree) {
    case 0:
      degree_name = "i";
      break;
    case 1:
      degree_name = "ii";
      break;
    case 2:
      degree_name = "iii";
      break;
    case 3:
      degree_name = "iv";
      break;
    case 4:
      degree_name = "v";
      break;
    case 5:
      degree_name = "vi";
      break;
    case 6:
      degree_name = "vii";
      break;
  }
  if (triad == "maj") degree_name = degree_name.toUpperCase();
  if (triad == "dim") degree_name = degree_name + String.fromCharCode(176);
  return degree_name;
}

function startAudio() {
  // create Oscillators, Filter and Gain nodes:
  const osc0 = audioCtx.createOscillator(); // Bass note
  const osc1 = audioCtx.createOscillator(); // Root note
  const osc2 = audioCtx.createOscillator(); // 3rd
  const osc3 = audioCtx.createOscillator(); // 5th
  const osc4 = audioCtx.createOscillator(); // 7th
  osc0.type = 'square';
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  osc3.type = 'sawtooth';
  osc4.type = 'sawtooth';
  // Lowpass filter
  const f = audioCtx.createBiquadFilter(); 
  f.type = 'lowpass';
  f.frequency.setValueAtTime(2500, audioCtx.currentTime);
  // White noise
  /*var bufferSize = 2 * audioCtx.sampleRate,
      noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
      output = noiseBuffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
  }
  var whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;*/
  // Reverb
  const reverbNode = audioCtx.createConvolver();
  /* 
  * impulseResponse is defined in another file as a base64 encoded string,
  * we need to convert it to a binary array.
  */
  var reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
  audioCtx.decodeAudioData(reverbSoundArrayBuffer, 
    function(buffer) {
      reverbNode.buffer = buffer;
    },
    function(e) {
      alert("Error when decoding audio data" + e.err);
    }
  );
  // Connections between nodes
  const gbass = audioCtx.createGain();
  const gr = audioCtx.createGain();
  const g3 = audioCtx.createGain();
  const g5 = audioCtx.createGain();
  const g7 = audioCtx.createGain();
  const gn = audioCtx.createGain();
  const g = audioCtx.createGain(); // Output gain
  const singleGain = 0.07;
  gbass.gain.value = singleGain * 0.75;
  gr.gain.value = singleGain;
  g3.gain.value = singleGain;
  g5.gain.value = singleGain;
  g7.gain.value = 0; // Gain for the 7th
  //gn.gain.value = 0 // Gain for the noise osc
  g.gain.value = 0; // Gain for the triad + bass
  osc0.connect(gbass);
  osc1.connect(gr);
  osc2.connect(g3);
  osc3.connect(g5);
  osc4.connect(g7);
  gbass.connect(f);
  gr.connect(f);
  g3.connect(f);
  g5.connect(f);
  g7.connect(f);
  f.connect(g);
  //whiteNoise.connect(gn);
  //gn.connect(g);
  g.connect(reverbNode);
  reverbNode.connect(audioCtx.destination);
  //Starting sources:
  //whiteNoise.start(0);
  osc0.start();
  osc1.start();
  osc2.start();
  osc3.start();
  osc4.start();
}

function resumeAudio() {
  audioCtx.resume();
}