var ctx = document.getElementById('colorWheel').getContext('2d');
var chart = new Chart(ctx, {
  
  type: 'doughnut', 
  
  data: {
    labels: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#" ],
    datasets: [
      {
        backgroundColor: [ 'rgb(255, 255, 0)',
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


rgbCircle = [[255, 255, 0],[255, 132, 0],[255, 0, 0],[247, 0, 64],[239, 2, 126],[131, 1, 126],[19, 0, 123], [10, 82, 165],[0, 159, 197],[0, 147, 126],[0, 140, 57], [130, 198, 28], [255,255,255]];

var imageData;
var width;
var height;
var opts = {
	colors: 8,               // desired palette size
	method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
	boxSize: [64,64],        // subregion dims (if method = 2)
	boxPxls: 2,              // min-population threshold (if method = 2)
	initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
	minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
	dithKern: null,          // dithering kernel name, see available kernels in docs below
	dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
	dithSerp: false,         // enable serpentine pattern dithering
	palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
	reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
	useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
	cacheFreq: 10,           // min color occurance count needed to qualify for caching
	colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
  };

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var file  = input.files[0];
    reader.onload = function(e) {
      background = document.getElementById('body-bg');
      $('.image-upload-wrap').hide();
      $('.file-upload-content').show();
      background.classList.remove('initial-bg');
      background.classList.add('updated-bg');
      background.style.backgroundImage = 'url(' + e.target.result + ')';
      var canvas = document.getElementById("myimage");
      var context = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() {
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
		//console.log(imageData);
		  
		var q = new RgbQuant(opts);
		q.sample(imageData);
		var outA = q.reduce(imageData);
		//console.log(outA);
	
		var uint8clamped = new Uint8ClampedArray(outA.buffer)
		var DAT = new ImageData(uint8clamped, width, height);
		//console.log(DAT);
		context.putImageData(DAT, 0, 0);
	  }
	  
      img.src = e.target.result
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
}
$('.image-upload-wrap').bind('dragover', function () {
		$('.image-upload-wrap').addClass('image-dropping');
	});
	$('.image-upload-wrap').bind('dragleave', function () {
		$('.image-upload-wrap').removeClass('image-dropping');
});