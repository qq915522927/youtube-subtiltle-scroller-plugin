import { parse, subTitleType } from 'subtitle'
import "./css/style.css"
import UI from './ui';


const VideoSelector = '.html5-video-player'

function patchXMLRequest() {
	((open) => {
        console.log("patch...");
		XMLHttpRequest.prototype.open = function (method: string, url: string) {
			if (url.match(/^http/g) !== null) {
				const urlObject = new URL(url);
				if (urlObject.pathname === "/api/timedtext") {
                    window.dispatchEvent(new CustomEvent('subtitle_fetch', { detail: urlObject.href }))
					console.log("监听到获取字幕的请求");
				}
			}
			open.call(this, method, url, true);
		};
	})(XMLHttpRequest.prototype.open);
}

function injectScript(): void {
    window.titleNavigationInjected = true;
    const sc = document.createElement("script");
	sc.innerHTML = `(${patchXMLRequest.toString()})()`;
	document.head.appendChild(sc);
	document.head.removeChild(sc);
    window.addEventListener('subtitle_fetch', processSubData as EventListener)
}

// chrome.webRequest.onCompleted.addListener((details) => {
//     console.log(details.url);
// },  {urls: ["<all_urls>"]},)

async function processSubData(event: CustomEvent) {
    console.log(event.detail);
    const urlObject: URL = new URL(event.detail)
    urlObject.searchParams.set('fmt', 'vtt')
    const resp = await fetch(urlObject.href)
    const text = await resp.text()
    console.log("fetching subtitle")
    let subs  = parse(text)
    window.dispatchEvent(new CustomEvent('subtitle_updated', { detail: subs}))
}

if (!window.titleNavigationInjected) {
    if (window.location.host === 'www.youtube.com') {
        injectScript();
        createUI();
    }
}


function createUI() {
    UI.renderSubs("body");
}
