
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


rgbCircle = [[255, 255, 0],[255, 132, 0],[255, 0, 0],[247, 0, 64],[239, 2, 126],[131, 1, 126],[19, 0, 123], [10, 82, 165],[0, 159, 197],[0, 147, 126],[0, 140, 57], [130, 198, 28], [255,255,255]]

document.querySelector(".file-upload-image").style.display="none";

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var file  = input.files[0];
    reader.onload = function(e) {
      background = document.getElementById('body-bg');
      $('.image-upload-wrap').hide();
      //console.log(convertDataURIToBinary(e.target.result))
      //console.log(e.target.result)
      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('body').removeClass('starting-bg')
      //background.classList.remove('initial-bg');
      //background.style.backgroundImage = 'url(' + e.target.result + ')';
      var canvas = document.getElementById("myimage");
      var context = canvas.getContext("2d");
      var img = new Image();
      img.onload = function() {
        context.drawImage(img, 100,100)
      }
      img.src = e.target.result
    };
    
    reader.readAsDataURL(file);
    
  } 
  
  else {
    removeUpload();
 
  }
  
}

function myCanvas(){
  var canvas = document.getElementById("myimage");
  var context = canvas.getContext("2d");

  var img = new Image();
    img.onload = function() {
      context.drawImage(img, 100,100)
    }
    img.src = e.target.result

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

var BASE64_MARKER = ';base64,';
function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}



  
