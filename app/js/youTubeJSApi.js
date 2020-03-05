export function initYouTubeJSApi() {

    // YouTubeJSApi
    var player;

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

}
