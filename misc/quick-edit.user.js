// ==UserScript==
// @name         Quick Edit
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Quick Edit to quickly rename movies
// @author       KlutzyBubbles
// @run-at          document-end
// @match        http://radarr.klutzybubbles.me:7878/movie/*
// @match        http://sonarr.klutzybubbles.me:8989/series/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script started");

    const observer = new MutationObserver(() => {
        placeButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const DEFAULT_DELAY = 200; 
    let delay = DEFAULT_DELAY;

    const btnId = 'batch-edit';
    const startLabel = 'Quick Edit';
    const btn = document.createElement("button");
    btn.setAttribute("id", btnId);
    btn.classList.add('btn', 'btn-primary', 'ml-3');
    btn.innerHTML = startLabel;
    btn.onclick = () => {
        run()
    };

    function placeButton() {
        const el = getElementByXpath("//button/div/div[text()='Preview Rename']");
        if (el && !document.getElementById(btnId)) {
            const button = el.parentElement.parentElement;
            const container = button.parentElement;
            container.appendChild(btn);
            // sortElementChildren(container);
            el.classList.add('ml-3');
        }
    }

    function debug(...args) {
        const debug = false;
        if (debug) {
            console.log(...args)
        }
    }

    async function run() {
        console.log('run');
        await click("//button/div/div[text()='Edit']");
        await click("//button[@title='Root Folder']");
        await click("//button[text()='Update Path']");
        await click("//button/span/span/span[text()='Save']");
        await click("//button[text()='Yes, Move the Files']");
    }

    const MAX_TRIES = 3;

    async function click(path, tries = 0) {
        const element = getElementByXpath(path);
        if (element === null) {
            if (tries >= MAX_TRIES) {
                console.log('returning', tries);
                return;
            } else {
                console.log('Running on delay', delay * (tries + 1), tries);
                await delayAction(delay * (tries + 1));
                return await click(path, tries + 1);
            }
        }
        $(element).click();
        await delayAction(delay);
        return;
    }

    async function delayAction(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
})();