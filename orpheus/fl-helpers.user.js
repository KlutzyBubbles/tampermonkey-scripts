// ==UserScript==
// @name        Orpheus: Freeleech helper
// @namespace    klutzybubbles
// @description Removes FL token confirm, lists how many tokens it will use
// @version     0.0.2
// @author      KlutzyBubbles
// @match       https://orpheus.network/collages.php?id=*
// @match       https://orpheus.network/torrents.php*
// @match       https://orpheus.network/bookmarks.php?type=torrents
// @match       https://orpheus.network/artists.php?id=*
// ==/UserScript==

const values = {
    'B': 1,
    'KiB': 1024,
    'MiB': 1024 * 1024,
    'GiB': 1024 * 1024 * 1024,
    'TiB': 1024 * 1024 * 1024 * 1024,
}

const tokenVal = 512 * values['MiB'];

const DEBUG = true;

function debugMessage(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

(function() {
    'use strict';
    
    $('.torrent_row, .group_torrent:not(.edition)').each(function (index, item) {
        const sizeString = $(item).find('.td_size').text();
        const size = parseFloat(sizeString.split(' ')[0].replace(',', ''));
        const unit = sizeString.split(' ')[1];
        const bytes = size * values[unit]
        const unsure = bytes % tokenVal === 0;
        const tokens = bytes <= tokenVal ? 1 : ((bytes - (bytes % tokenVal)) / tokenVal) + 1;

        debugMessage(size, unit, bytes, unsure, tokens);
        const buttons = $(item).find('.torrent_links_block').eq(0);
        const tokenString = unsure ? `${tokens}-${tokens + 1}` : `${tokens}`;
        if (buttons.length === 0) return;
        const buttonsHtml = buttons.html()
        if (buttonsHtml.includes('FL</a>')) {
            // Has freeleech button
            buttons.html(buttonsHtml.replace('FL</a>', `FL (${tokenString})</a>`))
            buttons.find('a[href^="torrents.php?action=download"]').removeAttr('onclick');
        } else {
            // Has no freeleech button
            const split = buttonsHtml.split(' | ');
            split.splice(1, 0, `FL (${tokenString})`);
            buttons.html(split.join(' | '));
        }
        buttons.find('a').each((index, item) => {
            $(item).css('color', 'aquamarine');
        })
        // console.log(tokens);
    });
})();