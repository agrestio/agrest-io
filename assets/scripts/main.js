// SVG SUPPORT
function supportsSVG() {
  return !! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect;  
}
if (supportsSVG()) {
  document.documentElement.className += ' svg';
} else {
  document.documentElement.className += ' no-svg';
  var imgs = document.getElementsByTagName('img');
  var dotSVG = /.*\.svg$/;
  for (var i = 0; i != imgs.length; ++i) {
    if(imgs[i].src.match(dotSVG)) {
      imgs[i].src = imgs[i].src.slice(0, -3) + 'png';
    }
  }
}

// Replace all SVG images (.svg-icon) with inline SVG
Array.prototype.forEach.call(
    document.querySelectorAll('img.inline-svg'),
    function(img){
        var imgID = img.id;
        var imgClass = img.className;
        var imgURL = img.src;
        fetch(imgURL).then(function(response) {
            return response.text();
        }).then(function(text){
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var svg = xmlDoc.getElementsByTagName('svg')[0];
            if(typeof imgID !== 'undefined') {
                svg.setAttribute('id', imgID);
            }
            if(typeof imgClass !== 'undefined') {
                svg.setAttribute('class', imgClass+' replaced-svg');
            }
            svg.removeAttribute('xmlns:a');
            if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
                svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
            }
            img.parentNode.replaceChild(svg, img);
        });
    }
);


//---------------------------------------------------------------------------
//  DOCUMENT READY
//---------------------------------------------------------------------------

$(document).ready(function() {
//    console.log("ready")
    // YouTubeJSApi
    var player;

    /**
     * gets called once the player API has loaded
     * this func should be on upper level
     */
    window["onYouTubeIframeAPIReady"] = onYouTubeIframeAPIReady;
    
    function onYouTubeIframeAPIReady() {
        // console.log("onYouTubeIframeAPIReady")

        $(".play-btn").css('visibility', 'visible');

        var videoId =  $('#video').attr('data-youtube-id');

        var onLoad = new Promise(function (resolve) {
            player = new YT.Player('video', {
                videoId: videoId,
                playerVars: {
                    'enablejsapi':1,
                    'html5':1,
                    'modestbranding':1,
                    'rel':0,
                    'showinfo':0
                },
                events: {
                    'onReady': onPlayerReady
                }
            });

            function onPlayerReady() {
                resolve();
            }
        });
        
        $('#videoModal').on('shown.bs.modal', function (e) {
            onLoad.then(function() {
                // console.log(">> play");
                player.playVideo();
            });
        });
            
        $('#videoModal').on('hide.bs.modal', function (e) {
            onLoad.then(function() {
                // console.log(">> stop");
                player.stopVideo();
            });

        });
    }

    // Modal Close
    $('#videoModal .modal-content').on('click', function() {
        $('#videoModal').modal('hide'); 
    });


    // Inject YouTube API script
    if ($('#video').length) {
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    

    // Navbar-overlay-blur
    $('#mainmenu').on('show.bs.collapse', function () {
        $('html').addClass('navbar-collapse-shown');
    });
    $('#mainmenu').on('hide.bs.collapse', function () {
        $('html').removeClass('navbar-collapse-shown');
    });

    // Hide main menu
    $(document).on('click', function (ev) {
        // if need to exclude specific DOM els use `ev.target`
        $('.navbar-collapse').collapse('hide');
    });

	// Current year in footer
	var currentYear = new Date().getFullYear();
	$('.current-year').text(currentYear);

}); //end $(document).ready()