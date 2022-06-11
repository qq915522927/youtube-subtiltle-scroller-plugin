import { parse, subTitleType } from "subtitle";
import UI from "./ui";
import { hasDuplicateText } from "./utils/subsHelper";

let subs: subTitleType[] = [
	{
		end: 2,
		text:
			"hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello",
		start: 1,
	},
	{ end: 2, text: "world2", start: 1 },
	{ end: 2, text: "hello", start: 1 },
	{ end: 2, text: "morning", start: 1 },
];

UI.renderSubs("body");
window.dispatchEvent(new CustomEvent("subtitle_updated", { detail: subs }));

setTimeout(() => {
	window.dispatchEvent(new CustomEvent("subtitle_updated", { detail: subs }));
}, 1);

function testMergeSub() {
	let text1 = "a like to start these videos by showing";
	let text2 =
		"like to start these videos by showing you what we will be creating today and";
	let res = hasDuplicateText(text1, text2);
	console.log("Max duplicated substring is:");
	console.log(text1.slice(text1.length - res, text1.length));
	console.log(text2.slice(0, res));
	console.log(text2.slice(res, text2.length));

	console.log(res);
}

testMergeSub()
