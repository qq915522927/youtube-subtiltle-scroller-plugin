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


chrome.webRequest.onCompleted.addListener(details => {
    console.log(details.url)
},
// {urls: ["https://*.youtube.com/*"]}
    {urls: ["https://www.youtube.com/*"]},
)

 fetch("https://www.youtube.com/watch?v=fIV6P1W-wuo").then(
     (resp) => {
         console.log("Get response")
     }
 )

console.log("background")

setInterval(()=> {console.log("hello")}, 1000)
