// ==UserScript==
// @name        Orpheus: Better.php Freeleech
// @namespace   klutzybubbles
// @description Adds freeleech button to better.php single seeded
// @version     0.0.1
// @author      KlutzyBubbles
// @match       https://orpheus.network/better.php?method=single
// @require     https://greasyfork.org/scripts/470000/code/GM%20Requests.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

const values = {
    'B': 1,
    'KiB': 1024,
    'MiB': 1024 * 1024,
    'GiB': 1024 * 1024 * 1024,
    'TiB': 1024 * 1024 * 1024 * 1024,
}

const tokenVal = 512 * values['MiB'];

(function() {
    'use strict';

    let totalBytes = 0;
    let seperated = []

    $('.rowa,.rowb').each(function (index, item) {
        const sizeString = ($(item).find('td').html().split('</div>').slice(-1)[0] ?? '0B').trim();
        const size = parseFloat(sizeString.split(' ')[0]);
        const unit = sizeString.split(' ')[1];
        const bytes = size * values[unit]
        totalBytes += bytes;
        const unsure = bytes % tokenVal === 0;
        const tokens = bytes <= tokenVal ? 1 : ((bytes - (bytes % tokenVal)) / tokenVal) + 1;
        seperated.push({
            tokens: tokens,
            unsure: unsure
        });
    });

    const unsure = totalBytes % tokenVal === 0;
    const tokens = totalBytes <= tokenVal ? 1 : ((totalBytes - (totalBytes % tokenVal)) / tokenVal) + 1;
    console.log(tokens, unsure);
    console.log(seperated);
    const altUnsure = seperated.reduce((prev, current) => {
        return current.unsure ? prev + 1 : prev;
    }, 0)
    const altTokens = seperated.reduce((prev, current) => {
        return prev + current.tokens;
    }, 0)


    const block = $('.torrents_links_block');
    const link = block.find('a').attr('href');
    const blockSplit = block.html().split('<br>');
    // blockSplit.splice(1, 0, `<a id="collector-list" class="brackets" href="${link}&usetoken=1">Freeleech All (${unsure ? `${tokens}-${tokens + 1}` : tokens}) (${altUnsure > 0 ? `${altTokens}-${altTokens + altUnsure}` : altTokens})</a>`);
    blockSplit[0] += `<a id="collector-list-fl-ghyjj" class="brackets" href="#!">Freeleech All (${altUnsure > 0 ? `${altTokens}-${altTokens + altUnsure}` : altTokens} Tokens)</a>`
    block.html(blockSplit.join('<br>'));

    $('#collector-list-fl-ghyjj').click((event) => {
        event.preventDefault();
        $('.rowa,.rowb').each(function (index, item) {
            const sizeString = ($(item).find('td').html().split('</div>').slice(-1)[0] ?? '0B').trim();
            const size = parseFloat(sizeString.split(' ')[0]);
            const unit = sizeString.split(' ')[1];
            const bytes = size * values[unit]
            totalBytes += bytes;
            const unsure = bytes % tokenVal === 0;
            const tokens = bytes <= tokenVal ? 1 : ((bytes - (bytes % tokenVal)) / tokenVal) + 1;
            seperated.push({
                tokens: tokens,
                unsure: unsure
            });
        });
    });
})();
