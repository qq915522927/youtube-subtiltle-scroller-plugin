// chrome.tabs.onActivated.addListener(function (tab) {
//     chrome.tabs.get(tab.tabId, function (current_tab_info) {
//         console.log(current_tab_info.url);
//         if (current_tab_info.url.includes("https://www.youtube.com/")) {
//             chrome.tabs.executeScript(tab.tabId, { "file": "./dist/foreground.js" }, function () { return console.log("injected"); });
//             // chrome.tabs.insertCSS(tab.tabId, { "file": "./style.css" }, function () { return console.log("css injected"); });
//         }
//     });
// });

// chrome.tabs.onUpdated.addListener(function (tab) {
//         console.log("onUpdated");
// });
