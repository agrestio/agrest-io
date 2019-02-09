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

// Replace all SVG images (.inline-svg) with inline SVG
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
    
    // Code Tabs : highlight.js
    if ($('.code-tabs code').length) {
        $('.code-tabs code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }    


    // // // BEGIN                                                                      // // //
    // // // Temporary code                                                             // // //
    // // // Only for development not production                                        // // //
    // // // It's written only for viewing docs and simplicity of creation templates    // // //
    // // // It has constraints like a static parts names that used to load all docs    // // //
    // // // As well it includes `src` and css classes modifiers
    // 
    // Docs : parts onclick .docs-sidebar
        if ($('.docs-parts').length) {
            // make first-time modifications after page load
            getPartContent($('.docs-parts > li:first-child a').attr('href').replace('#agrest-', ''));
            
            // on click handlers
            $('.docs-parts a').on('click', function() {
                getPartContent($(this).attr('href').replace('#agrest-', ''));
            });
        }

    // Docs : load .docs-sidebar contents
        function getPartContent(partName) {
            $.get('docs/' + partName + '.html', '', function (data) {
                var dataHtml = $.parseHTML( data ),
                    partContents = $(dataHtml).find('.sectlevel1'),
                    partContent = $(dataHtml).filter('.sect1');
                
                // insert docs contents
                $('.docs-sidebar li .sectlevel1').remove('.sectlevel1');
                $('.docs-sidebar [href="#agrest-' + partName + '"]').after(partContents);
                
                // insert docs content
                $('.docs-content .sect1').remove('.sect1');
                $('.docs-content-heading h1').text('Agrest ' + partName);
                $('.docs-content').html(partContent);
                prepareDocPage();
                
                // set active part : prepare .docs-sidebar
                if ($('.docs-sidebar').length) {
                    
                    // Add scrollspy classes
                    $('.docs-sidebar ul').addClass('nav');
                    $('.docs-sidebar ul li').addClass('nav-item');
                    $('.docs-sidebar ul li a').addClass('nav-link');
                    
                    // remove #toctitle's not to interfere scrollcpy
                    $('#toctitle').remove();
                }
                
                // set active part : body id and triger
                $('body').attr('id', 'agrest-' + partName);
                window.scrollY == 0 ? $(window).scrollTop(1) : $(window).scrollTop(0);
            });
        }
    
    
    // Docs : base doc page
        function prepareDocPage() {
            // Docs : highlight.js
            if ($('.docs-content pre code').length) {
                $('.docs-content pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }
            
            // Docs : img (add responsiveness and proper src)
            if ($('.docs-content img').length) {
                $('.docs-content img').each(function(){
                    var $this = $(this);
                    $this.addClass('img-fluid').attr('src',$this.attr('src').replace('img','docs/img'));
                })
            }
            
            // Docs : tables 
            if ($('.docs-content table').length) {
                $('.docs-content table').addClass('table table-bordered');
            }
        }
    // // // Temporary code                                                             // // //
    // // // END                                                                        // // //
        
}); //end $(document).ready()