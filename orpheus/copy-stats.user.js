// ==UserScript==
// @name         Copy Stats
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Copy stats
// @author       KlutzyBubbles
// @match        https://orpheus.network/user.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orpheus.network
// @require      https://greasyfork.org/scripts/470000/code/GM%20Requests.js

// @resource     toastCss https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js

// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

(function() {
    'use strict';

    // Toast
    const toastCss = GM_getResourceText('toastCss');
    GM_addStyle(toastCss);
    GM_addStyle(`
        .disable-click {
            pointer-events:none;
        }
    `);

    const stats = $('ul.stats').eq(0);
    if (stats.length === 0) return;

    // This is used for extra info but also doubles as a check for whether you are looking at your own profile.
    const userClass = $('div .box_userinfo_nextclass').find('ul.stats').eq(0);
    if (userClass.length === 0) return;
    const userStats = $('div .box_userinfo_stats').find('ul.stats').eq(0);
    if (userStats.length === 0) return;

    const searchableStr = document.URL + '&';
    const userId = searchableStr.match (/[\?\&]id=([^\&\#]+)[\&\#]/i)    [1];

    stats.append(htmlToElement(`<li><a href="javascript:void(0);" id="copy-stats-gygree">Copy to clipboard</a></li>`));

    const selector = stats.find("#copy-stats-gygree");
    selector.on('click', async function() {
        selector.addClass('disable-click tooltip');
        let perfecter = '?';
        let pph = '?';
        userClass.find('li').each((index, item) => {
            const raw = $(item).text();
            if (raw.toLowerCase().includes('perfecter')) {
                perfecter = raw.split(' / ')[0].split(': ')[1];
            }
        });
        userStats.find('li').each((index, item) => {
            const raw = $(item).text();
            if (raw.toLowerCase().includes('points per hour')) {
                pph = raw.split(': ')[1];
            }
        });
        let ret = await requests.get(
            'https://orpheus.network/ajax.php?action=user',
            { id: userId },
            { responseType: 'json' }
        );
        if (ret.status !== 'success') {
            $.toast({
                text: 'Request error',
                stack: false,
                position: 'top-left',
                hideAfter: true,
            });
            selector.removeClass('disable-click tooltip');
            return;
        }
        const r = ret.response;
        const items = [
            r.stats.lastAccess,
            r.stats.uploaded,
            r.stats.downloaded,
            r.stats.requiredRatio,
            r.stats.ratio,
            perfecter,
            r.ranks.uploaded,
            r.ranks.downloaded,
            r.ranks.uploads,
            r.ranks.requests,
            r.ranks.bounty,
            r.ranks.artists,
            r.ranks.collage,
            r.ranks.posts,
            r.ranks.votes,
            r.ranks.bonus,
            r.ranks.overall,
            r.community.posts,
            r.community.torrentComments,
            r.community.collagesContrib,
            r.community.requestsFilled,
            r.community.bountyEarned,
            r.community.requestsVoted,
            r.community.bountySpent,
            r.community.releaseVotes,
            r.community.uploaded,
            r.community.artistsAdded,
            r.community.artistComments,
            r.community.collageComments,
            r.community.requestComments,
            r.community.collagesStarted,
            r.community.perfectFlacs,
            r.community.groups,
            r.community.seeding,
            r.community.leeching,
            r.community.snatched,
            r.community.invited,
            pph,
        ];
        console.log(r);
        navigator.clipboard.writeText(items.join('\t'));
        $.toast({
            text: 'Copied to clipboard',
            stack: false,
            position: 'top-left',
            hideAfter: true,
        });
        selector.removeClass('disable-click tooltip');
    });
})();