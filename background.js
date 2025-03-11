//
//  background.js
//  New Tab Issue Fix for Chromebooks
//
//  Created by Pablo Van der Sande on March 2025.
//  Copyright © 2025 Pablo Van der Sande
//
//  Version: 1.3
//  
//  Licensed under the MIT License. See LICENSE file for details.
//

let isNewTabOpened = false;
let resetTimeout = null;

chrome.runtime.getPlatformInfo((info) => {
    if (info.os === "cros") {  // "cros" is ChromeOS
        console.log("Running on Chromebook. Extension activated.");

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tab.url && tab.url.startsWith("chrome://newtab")) {
                isNewTabOpened = true;
                console.log("New tab change detected");

                // reset het na 2 sec voor als er op een of andere manier toch niets gebeurt
                if (resetTimeout) clearTimeout(resetTimeout);
                resetTimeout = setTimeout(() => {
                    isNewTabOpened = false;
                    console.log("Reset new tab flag after timeout");
                }, 2000);
            }
        });

        
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (isNewTabOpened && tab.url === "about:blank") {
                chrome.tabs.remove(tabId); // fucking snel sluiten
                isNewTabOpened = false;
                console.log("about:blank page closed");
                if (resetTimeout) clearTimeout(resetTimeout);
            }
        });
    } else {
        console.log("Not running on a Chromebook. Extension inactive.");
    }
});