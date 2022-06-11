import { parse, subTitleType } from "subtitle";
import "./css/style.css";
import UI from "./ui";
import { ClientYoutube } from "./utils/clientYoutube";
import { VideoInformationResponseParser } from "./utils/videoInfoParser";

const VideoSelector = ".html5-video-player";


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
		importBootsfont();
		createUI();
	}
}

function createUI() {
	UI.renderSubs("body");
}

function importBootsfont() {
	let style: HTMLStyleElement = document.createElement("style");
	let font1Url = chrome.runtime.getURL(`bootstrap-icons.woff`);
	let font2Url = chrome.runtime.getURL(`bootstrap-icons.woff2`);
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
