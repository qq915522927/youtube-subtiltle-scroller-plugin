import { parse, subTitleType } from 'subtitle'
import "./css/style.css"


function patchXMLRequest() {
	((open) => {
        console.log("patch...");
		XMLHttpRequest.prototype.open = function (method: string, url: string) {
			if (url.match(/^http/g) !== null) {
				const urlObject = new URL(url);
				if (urlObject.pathname === "/api/timedtext") {
                    if (!window.subTitleInit) {
                        window.subtitleUrl = urlObject.href;
                        window.dispatchEvent(new CustomEvent('subtitle_fetch', { detail: urlObject.href }))
                        window.subTitleInit = true;
                    }
					console.log("正在获取字幕");
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

async function processSubData(event: CustomEvent) {
    console.log(event.detail);
    const urlObject: URL = new URL(event.detail)
    urlObject.searchParams.set('fmt', 'vtt')
    createUI();
    const resp = await fetch(urlObject.href)
    const text = await resp.text()
    console.log(text)
    let subs  = parse(text)
    showSubs(subs)
}

function showSubs(subs: subTitleType[] ) {
    let container = document.createElement("div")
    container.classList.add("subtitle-container");
    let html = ""
    for(let sub of subs) {
        html += `<p class="subtitle-nav-row">${sub.start} - ${sub.end}: ${sub.text} </p>`
    }
    container.innerHTML = html
    document.body.appendChild(container);
}



if (!window.titleNavigationInjected) {
    if (window.location.host === 'www.youtube.com') {
        injectScript();
    }
}

function createUI() {
    let container = document.createElement("div")
    container.classList.add("subtitle-nav");
    container.innerHTML = `
    <button id="subtitle-open-btn">打开全部字幕</button>
    `
    document.body.appendChild(container);
}
