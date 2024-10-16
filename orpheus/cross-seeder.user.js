// ==UserScript==
// @name         Cross Seeder
// @namespace    klutzybubbles
// @version      0.8.1
// @description  Highlight torrents that have been uploaded via cross seeding tools
// @author       KlutzyBubbles, Hawkeye
// @match        https://orpheus.network/torrents.php?id=*
// @match        https://redacted.ch/torrents.php?id=*
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orpheus.network
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log(GM_info);
    // We add text that is added when you use any of these tools.
    // Redcurry will have Uploaded with Redcurry, transplant transplant... others will have stuff.
    // Stuff that should always be the same because those tools will not make any changes.
    var certainStrings = [
        "{ Uploaded with RedCurry }",
        "cross-post of my RED upload",
        "Transplant of my own upload on RED",
        "Transplanted from RED",
        "Transplanted from OPS",
        "Transplant of my own upload on OPS",
        "cross-post of my OPS upload"
    ];
    // This is for stuff that someone might have sourced from the other tracker
    // but it does not mean that it is 100% cross-seedable like certainStrings
    // Always check these just to be sure
    var uncertainStrings = [
        "from RED",
        "on RED",
        "from OPS",
        "on OPS"
    ];
    var certainStringsColor = "#49652E"; //"#8bc34a"; // Colour of "certain/safe" row
    var uncertainStringsColor = "#7E7834"; //"#ffee58"; // Colour of "uncertain/possibly unsafe" row
    var safety = false;
    function f_Search(){
        $('table.torrent_table tbody tr td blockquote').each(function() {
            var blockquoteText = $(this).text().toLowerCase();
            if(safety == false) {
                for(var i = 0; i < uncertainStrings.length; i++) {
                    if (blockquoteText.includes(uncertainStrings[i].toLowerCase())) {
                        // console.log("Possible cross-seed found!");
                        var parent = $(this).closest('tr').attr('id').replace('_', "");
                        parent = "#" + parent;
                        $(parent).css("background-color", uncertainStringsColor);
                    }
                }
            }
            for(var j = 0; j < certainStrings.length; j++) {
                if (blockquoteText.includes(certainStrings[j].toLowerCase())) {
                    // console.log("Cross-seed found!");
                    var parent1 = $(this).closest('tr').attr('id').replace('_', "");
                    parent1 = "#" + parent1;
                    $(parent1).css("background-color", certainStringsColor);
                }
            }
        });
    }
    f_Search();
    //});
})();