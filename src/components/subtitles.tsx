import * as React from "react";
import { parse, subTitleType } from "subtitle";
import Draggable from "react-draggable";
import { ClientYoutube } from "../utils/clientYoutube";
import { VideoInformationResponseParser } from "../utils/videoInfoParser";
import {
	getCleanSubText,
	getCurrentFirstSub,
	mergeSubs,
} from "../utils/subsHelper";
import { moveToTime, getCurrentTime } from "../utils/videoHelpers";
import { scroller, Element } from "react-scroll";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export type subTitle = {
	id: number;
	highlighted: Boolean;
	subInfo: subTitleType;
};
import { CaptionTrack } from "../types/captionTrack";

type SubsState = {
	subs: subTitle[];
	autoScroll: boolean;
	unfolded: boolean;
	videoInfo: VideoInfo;
};
interface VideoInfo {
	tracks: CaptionTrack[];
	videoId: string;
	videoTitle: string;
}

class SubTitles extends React.Component<{}> {
	videoElement = document.querySelector("video");
	rowRefs: { [index: number]: HTMLElement } = {};

	mouseEnter = false;

	constructor(props) {
		super(props);
		// this.setState(
		//   {
		//     subs: props.subs.map((sub) => {
		//       return {
		//         subInfo: sub,
		//         highlighted: false
		//       }
		//     })
		//   }
		// )
	}
	state: SubsState = {
		subs: [],
		autoScroll: true,
		unfolded: false,
		videoInfo: null,
	};

	getInitialSubs(subs: subTitleType[]) {
		subs = this.normalizeInputSubs(subs);
		subs = mergeSubs(subs);
		return subs.map((sub, index) => {
			return {
				id: index,
				subInfo: sub,
				highlighted: false,
			};
		});
	}

	normalizeInputSubs(subs: subTitleType[]) {
		return subs.map((sub) => {
			return {
				text: getCleanSubText(sub.text),
				start: sub.start,
				end: sub.end,
			};
		});
	}

	singleClick = true;

	selectRow(e, sub: subTitle) {
		console.log(e.detail);
		if (e.detail !== 1) {
			this.singleClick = false;
			return;
		} // only capture single click
		this.singleClick = true;
		let selection = window.getSelection();
		if (selection.toString().length !== 0) return; // if this is a selection, don't move to the target sub
		setTimeout(() => {
			console.log("Time reached");
			if (this.singleClick) {
				console.log("single click");
				this.highlightRow(sub);
				this.moveToSub(sub);
			}
		}, 200);
	}
	scrollToSub(sub: subTitle) {
		scroller.scrollTo(`subtitleRow${sub.id}`, {
			containerId: "subtitle-container",
			offset: -120,
		});
	}

	highlightRow(sub: subTitle) {
		let originSubs = this.state.subs;
		for (let subItem of originSubs) {
			subItem.highlighted = false;
			if (subItem.id === sub.id) {
				subItem.highlighted = true;
			}
		}
		this.setState({
			subs: originSubs,
		});
	}

	moveToSub(sub: subTitle) {
		let originSubs = this.state.subs;
		for (let subItem of originSubs) {
			if (subItem.id === sub.id) {
				moveToTime(this.videoElement, sub.subInfo.start);
				console.log("Move to: " + sub.subInfo.start);
			}
		}
	}

	updateSubtitleBoard() {
		if (!this.videoElement) {
			this.videoElement = document.querySelector("video");
			if (!this.videoElement) return;
		}

		let ctime = getCurrentTime(this.videoElement);
		if (this.state.subs.length === 0) {
			return;
		}
		let sub = getCurrentFirstSub(this.state.subs, ctime);
		if (!sub) return;
		this.highlightRow(sub);
		if (this.state.autoScroll) {
			this.scrollToSub(sub);
		}
	}

	componentDidMount() {
		getSubTitleTracks();
		setInterval(() => this.updateSubtitleBoard(), 300);
		window.addEventListener("subtitleTracksFetch", (e: CustomEvent) =>
			this.onCaptionTrackUpdated(e)
		);
		window.addEventListener("subtitle_updated", (e: CustomEvent) =>
			this.onSubTitleUpdated(e)
		);
		console.log("mounted");

		if (this.videoElement) {
			console.log("event register");
			this.videoElement.addEventListener("loadstart", (e) => {
				this.reset();
				getSubTitleTracks();
			});
		}
	}
	onSelectCaption(e, track: CaptionTrack) {
		e.preventDefault();
		this.getSubtitle(track).then(() => {
			this.setState({
				unfolded: true,
			});
		});
	}

	getSubtitle(track: CaptionTrack) {
		const client = new ClientYoutube();
		let urlObj = new URL(track.baseUrl);
		urlObj.searchParams.append("fmt", "vtt");
		return client
			.getSubtitle(urlObj.href)
			.then((response: string) => {
				processSubData(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	reset() {
		this.setState({
			subs: [],
		});
	}

	onSubTitleUpdated(event: CustomEvent) {
		console.log("receive msg");
		let subs: subTitle[] = this.getInitialSubs(event.detail);
		this.setState({
			subs: subs,
		});
	}
	onCaptionTrackUpdated(event: CustomEvent) {
		console.log("set video info");
		this.setState({
			videoInfo: event.detail,
		});
		console.log(this.state);
	}

	renderTooltip1(props) {
		return <Tooltip {...props}>Fold/Unfold</Tooltip>;
	}
	renderTooltip2(props) {
		return <Tooltip {...props}>Auto scrolling</Tooltip>;
	}
	renderTooltip3(props) {
		// No subtitles
		return <Tooltip {...props}>Select a caption</Tooltip>;
	}

	getFoldIcon() {
		if (this.state.unfolded) {
			return <i className="bi bi-fullscreen-exit"></i>;
		} else {
			return <i className="bi bi-fullscreen"></i>;
		}
	}
	getAutoScrollIcon() {
		if (this.state.autoScroll) {
			return <i className="bi bi-toggle-on"></i>;
		} else {
			return <i className="bi bi-toggle-off"></i>;
		}
	}

	disableAutoScroll() {
		this.setState({ autoScroll: false });
	}

	toggleFold(event) {
		event.preventDefault();
		this.setState({ unfolded: !this.state.unfolded });
	}

	render() {
		const videoId = new URL(document.URL).searchParams.get("v");
		if (!this.state.videoInfo || !videoId) {
			return <div></div>;
		} else
			return (
				<Draggable handle="#handle">
					<div className="subtitle-box card">
						<ul id="handle" className="nav subtitle-nav text-white">
							{this.getSubsDropDown()}

							<li className="nav-item">
								<OverlayTrigger
									placement="top"
									delay={{ show: 250, hide: 400 }}
									overlay={this.renderTooltip2}
								>
									<a
										className="btn text-white"
										onClick={(event) => this.onAutoScrollToggle(event)}
										href="#"
									>
										{this.getAutoScrollIcon()}
									</a>
								</OverlayTrigger>
							</li>

							<li className="nav-item">
								<OverlayTrigger
									placement="top"
									delay={{ show: 250, hide: 400 }}
									overlay={this.renderTooltip1}
								>
									<a
										className="btn text-white"
										data-bs-toggle="collapse"
										data-bs-target="#subtitle-container"
										aria-expanded="false"
										onClick={(event) => this.toggleFold(event)}
										href="#"
									>
										{this.getFoldIcon()}
									</a>
								</OverlayTrigger>
							</li>
						</ul>

						<div
							id="subtitle-container"
							className={
								"subtitle-container container-fluid collapse" +
								(this.state.unfolded ? " show" : "")
							}
							onWheel={() => this.disableAutoScroll()}
							// onMouseEnter={() => this.mouseEnter = true}
							// onMouseLeave={() => this.mouseEnter = false}
						>
							{this.state.subs.map((sub, index) => {
								return (
									<div
										key={sub.id}
										className="row subtitle-row"
										ref={(div) => {
											this.rowRefs[index] = div;
										}}
										onClick={(e) => this.selectRow(e, sub)}
									>
										<div
											className={
												"col" + (sub.highlighted ? " higlight-row" : "")
											}
											key={index}
										>
											<Element name={`subtitleRow${sub.id}`}>
												{sub.subInfo.text.length !== 0 ? sub.subInfo.text : "-"}
											</Element>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</Draggable>
			);
	}

	onAutoScrollToggle(event) {
		event.preventDefault();
		this.setState({
			autoScroll: !this.state.autoScroll,
		});
	}

	getSubsDropDown() {
		if (!this.state.videoInfo) return;
		if (!this.state.videoInfo.tracks) {
			return (
				<li className="nav-item">
					<a className="nav-link disabled" role="button">
						<i className="bi bi-badge-cc"></i>
					</a>
				</li>
			);
		}
		return (
			<li className="nav-item dropdown">
				<OverlayTrigger
					placement="top"
					delay={{ show: 250, hide: 400 }}
					overlay={this.renderTooltip3}
				>
					<a
						className="nav-link dropdown-toggle"
						href="#"
						id="ccDarkDropdownMenuLink"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<i className="bi bi-badge-cc"></i>
					</a>
				</OverlayTrigger>
				<ul
					className="dropdown-menu dropdown-menu-dark"
					aria-labelledby="navbarDarkDropdownMenuLink"
				>
					{this.state.videoInfo.tracks.map((track, i) => {
						return (
							<li key={i}>
								<a
									className="dropdown-item"
									onClick={(e) => this.onSelectCaption(e, track)}
									href="#"
								>
									{track.name.simpleText}
								</a>
							</li>
						);
					})}
				</ul>
			</li>
		);
	}
}

export default SubTitles;

const getSubTitleTracks = () => {
	const videoId = new URL(document.URL).searchParams.get("v");
	const client = new ClientYoutube();
	client
		.getVideoInformation(videoId)
		.then((response) => {
			const captionTrackList = VideoInformationResponseParser.parse(response);
			let videoInfo: VideoInfo = {
				tracks: captionTrackList,
				videoId,
				videoTitle: getVideoTitle(),
			};
			window.dispatchEvent(
				new CustomEvent("subtitleTracksFetch", { detail: videoInfo })
			);
		})
		.catch((error: Error) => {
			let videoInfo: VideoInfo = {
				tracks: null,
				videoId,
				videoTitle: getVideoTitle(),
				//TODO, add error message
			};
			window.dispatchEvent(
				new CustomEvent("subtitleTracksFetch", { detail: videoInfo })
			);
		});
	return true;
};

const getVideoTitle = (): string => {
	return document.title.replace(/[+|/?^.<>":]/g, "").replace(/ - YouTube/, "");
};

function processSubData(text: string) {
	let subs = parse(text);
	window.dispatchEvent(new CustomEvent("subtitle_updated", { detail: subs }));
}
