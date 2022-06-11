import { parse, subTitleType } from "subtitle";
import "./css/style.css";
import UI from "./ui";

const VideoSelector = ".html5-video-player";

function patchXMLRequest() {
	((open) => {
		console.log("patch...");
		XMLHttpRequest.prototype.open = function (method: string, url: string) {
			if (url.match(/^http/g) !== null) {
				const urlObject = new URL(url);
				if (urlObject.pathname === "/api/timedtext") {
					window.dispatchEvent(
						new CustomEvent("subtitle_fetch", { detail: urlObject.href })
					);
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
	window.addEventListener("subtitle_fetch", processSubData as EventListener);
}

// chrome.webRequest.onCompleted.addListener((details) => {
//     console.log(details.url);
// },  {urls: ["<all_urls>"]},)

async function processSubData(event: CustomEvent) {
	const urlObject: URL = new URL(event.detail);
	urlObject.searchParams.set("fmt", "vtt");
	console.log(urlObject.href);
	const resp = await fetch(urlObject.href);
	const text = await resp.text();
	console.log("fetching subtitle");
	let subs = parse(text);
	window.dispatchEvent(new CustomEvent("subtitle_updated", { detail: subs }));
}

if (!window.titleNavigationInjected) {
	if (window.location.host === "www.youtube.com") {
		injectScript();
		importBootsfont();
		createUI();
	}
}

function createUI() {
	UI.renderSubs("body");
}

function importBootsfont() {
	let style: HTMLStyleElement = document.createElement("style");
	let font1Url = chrome.runtime.getURL(`dist/fonts/bootstrap-icons.woff`);
	let font2Url = chrome.runtime.getURL(`dist/fonts/bootstrap-icons.woff2`);
	var font1 = new FontFace("bootstrap-icons", `url(${font1Url})`);
	// var font2 = new FontFace('Junction Regular', `url(${font1Url})`);
	console.log(font1);
	font1.load().then((loaded_face) => {
		console.log("font loaded");
		document.fonts.add(loaded_face);
	});
	// style.appendChild(
	// 	document.createTextNode(`
	//         @font-face {
	//         font-family: "bootstrap-icons";
	//         src: url('${font2}') format("woff2"),
	//         url('${font1}') format("woff");
	//         }
	// `)
	// );

	// document.head.appendChild(style);
}
