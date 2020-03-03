import 'bootstrap/js/dist/modal.js';
import '../styles/main.scss';
require('bootstrap/js/dist/scrollspy');
require('bootstrap/js/dist/collapse');
require('bootstrap/js/dist/dropdown');
require('bootstrap/js/dist/tab');

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

var hljs        = require('highlight.js/lib/highlight.js');
var xml         = require('highlight.js/lib/languages/xml.js');
var java        = require('highlight.js/lib/languages/java');
var json        = require('highlight.js/lib/languages/json');
var bash        = require('highlight.js/lib/languages/bash');
var yaml        = require('highlight.js/lib/languages/yaml');

function initHljs() {
      hljs.registerLanguage('xml', xml);
      hljs.registerLanguage('java', java);
      hljs.registerLanguage('json', json);
      hljs.registerLanguage('bash', bash);
      hljs.registerLanguage('yaml', yaml);
      hljs.initHighlightingOnLoad();
}

//---------------------------------------------------------------------------
//  DOCUMENT READY
//---------------------------------------------------------------------------

$(document).ready(function() {
    // YouTubeJSApi
    var player;

    initHljs();

    /**
     * gets called once the player API has loaded
     * this func should be on upper level
     */
    window["onYouTubeIframeAPIReady"] = onYouTubeIframeAPIReady;

    function onYouTubeIframeAPIReady() {

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
                player.playVideo();
            });
        });

        $('#videoModal').on('hide.bs.modal', function (e) {
            onLoad.then(function() {
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

    $('#toc').addClass('toc-side');

	// Current year in footer
	var currentYear = new Date().getFullYear();
	$('.current-year').text(currentYear);

}); //end $(document).ready()