import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal.js';
import 'bootstrap/js/dist/scrollspy';
import 'bootstrap/js/dist/dropdown';

import '../styles/main.scss';
import { initYouTubeJSApi } from './youtube.js';
// this is unsupported plugin from the highlight.js devs, to enable html blocks in the code samples
// https://github.com/highlightjs/highlight.js/issues/2889
import mergeHTMLPlugin from './hljs-html.js'

// Highlight.js
import hljs from 'highlight.js/lib/core';
import xml  from 'highlight.js/lib/languages/xml';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';

function initHljs() {
      hljs.registerLanguage('xml', xml);
      hljs.registerLanguage('java', java);
      hljs.registerLanguage('json', json);
      hljs.registerLanguage('bash', bash);
      hljs.registerLanguage('yaml', yaml);
      hljs.configure({
        ignoreUnescapedHTML: true
      });

      hljs.addPlugin(mergeHTMLPlugin);
      hljs.highlightAll();
}

function initMainMenuBlur() {
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
}

//---------------------------------------------------------------------------
//  DOCUMENT READY
//---------------------------------------------------------------------------

initHljs();

$(document).ready(function() {
    initYouTubeJSApi();
    initMainMenuBlur();
	// Current year in the footer
	$('.current-year').text(new Date().getFullYear());
});