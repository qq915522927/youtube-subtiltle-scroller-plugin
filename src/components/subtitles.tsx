import * as React from "react";
import Draggable from "react-draggable";
import { subTitleType } from "subtitle";
import { getCleanSubText, getCurrentFirstSub } from "../utils/subsHelper";
import { moveToTime, getCurrentTime } from "../utils/videoHelpers";
import { scroller, Element } from "react-scroll";
export type subTitle = {
	id: number;
	highlighted: Boolean;
	subInfo: subTitleType;
};

type SubsState = {
	subs: subTitle[];
	autoScroll: boolean;
};

class SubTitles extends React.Component<{}> {
	videoElement = document.querySelector("video");
	rowRefs: { [index: number]: HTMLElement } = {};

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
	};

	getInitialSubs(subs: subTitleType[]) {
		return this.normalizeInputSubs(subs).map((sub, index) => {
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

	selectRow(sub: subTitle) {
    let selection = window.getSelection();
    if(selection.toString().length !== 0) return; // if this is a selection, don't move to the target sub
		this.highlightRow(sub);
		this.moveToSub(sub);
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
		if (!this.videoElement) return;

		let ctime = getCurrentTime(this.videoElement);
		if (this.state.subs.length === 0) {
			return;
		}
		let sub = getCurrentFirstSub(this.state.subs, ctime);
    this.highlightRow(sub);
    if (this.state.autoScroll) {
      this.scrollToSub(sub);
    }
	}

	componentDidMount() {
		setInterval(() => this.updateSubtitleBoard(), 300);
		window.addEventListener("subtitle_updated", (e: CustomEvent) =>
			this.onSubTitleUpdated(e)
    );
    if (this.videoElement) {
      this.videoElement.addEventListener("loadstart", (e) => this.reset());
    }
	}

	reset() {
		this.setState({
			subs: [],
		});
	}

	onSubTitleUpdated(event: CustomEvent) {
		console.log("receive msg");
		let subs: subTitle[] = this.getInitialSubs(event.detail);
		console.log(subs);
		this.setState({
			subs: subs,
		});
	}

	render() {
		console.log(this.state.subs.length);
		if (this.state.subs.length == 0) {
			return <div></div>;
		} else
			return (
				<Draggable handle="#handle">
					<div className="subtitle-box card">
						<ul id="handle" className="nav subtitle-nav text-white">
							<li className="nav-item">
								<a
									className="btn text-white"
									data-bs-toggle="collapse"
									data-bs-target="#subtitle-container"
									aria-expanded="false"
									href="#"
								>
									折叠
								</a>
							</li>

							<div className="form-check form-switch">
								<input
									className="form-check-input"
									type="checkbox"
                  role="switch"
                  checked={this.state.autoScroll}
                  onChange={(e) => this.onAutoScrollToggle(e) }
									id="flexSwitchCheckDefault"
								/>
								<label
									className="form-check-label"
									htmlFor="flexSwitchCheckDefault"
								>
									Auto scrolling
								</label>
							</div>
						</ul>

						<div
							id="subtitle-container"
							className="subtitle-container container-fluid collapse show"
						>
							{this.state.subs.map((sub, index) => {
								return (
									<div
										key={sub.id}
										className="row subtitle-row"
										ref={(div) => {
											this.rowRefs[index] = div;
										}}
										onClick={() => this.selectRow(sub)}
									>
										<div
											className={
												"col" + (sub.highlighted ? " higlight-row" : "")
											}
											key={index}
										>
											<Element name={`subtitleRow${sub.id}`}>
												{sub.subInfo.text}
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

  onAutoScrollToggle(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      autoScroll: e.target.checked
    })
  }
}

export default SubTitles;
