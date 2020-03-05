//import 'bootstrap/js/dist/collapse';
//import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal.js';
import 'bootstrap/js/dist/scrollspy';
import '../styles/main.scss';
import { initYouTubeJSApi } from '../js/youTubeJSApi.js';

var hljs = require('highlight.js/lib/highlight.js');
var xml  = require('highlight.js/lib/languages/xml.js');
var java = require('highlight.js/lib/languages/java');
var json = require('highlight.js/lib/languages/json');
var bash = require('highlight.js/lib/languages/bash');
var yaml = require('highlight.js/lib/languages/yaml');

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

    initHljs();
    initYouTubeJSApi();

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