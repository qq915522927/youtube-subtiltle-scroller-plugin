import * as React from "react";
import Draggable from "react-draggable";
import { subTitleType } from "subtitle";
import { getCleanSubText, getCurrentFirstSub } from "../utils/subsHelper";
import { moveToTime, getCurrentTime } from "../utils/videoHelpers";
import {scroller, Element} from 'react-scroll'
export type subTitle = {
	id: number;
	highlighted: Boolean;
  subInfo: subTitleType;
};

type SubsState = {
  subs: subTitle[];
  stopScroll: boolean;
};

class SubTitles extends React.Component<{ subs: subTitleType[] }> {
  videoElement = document.querySelector("video");
  rowRefs: {[index: number]: HTMLElement}  = {} ;

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
		subs: this.normalizeInputSubs(this.props.subs).map((sub, index) => {
			return {
				id: index,
				subInfo: sub,
				highlighted: false,
			};
    }),
    stopScroll: false
	};

	normalizeInputSubs(subs: subTitleType[]) {
		return this.props.subs.map((sub) => {
			return {
				text: getCleanSubText(sub.text),
				start: sub.start,
				end: sub.end,
			};
		});
	}

	selectRow(sub: subTitle) {
    this.highlightRow(sub);
    this.moveToSub(sub)
  }
  scrollToSub(sub: subTitle) {
    scroller.scrollTo(
      `subtitleRow${sub.id}`, {
        containerId: 'subtitle-container',
        offset: -120,
      }
    )
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
    let ctime = getCurrentTime(this.videoElement)
    let sub = getCurrentFirstSub(this.state.subs, ctime)
    this.highlightRow(sub)
    this.scrollToSub(sub)
  }

  componentDidMount() {
    setInterval(()=> this.updateSubtitleBoard(), 300)
  }

	render() {
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
					</ul>
					<div
						id="subtitle-container"
						className="subtitle-container container-fluid collapse"
					>
						{this.state.subs.map((sub, index) => {
							return (
								<div
									key={sub.id}
                  className="row subtitle-row"
                  
                  ref={(div) => {this.rowRefs[index] = div}}
									onClick={() => this.selectRow(sub)}
								>
									<div
										className={"col" + (sub.highlighted ? " higlight-row" : "")}
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

}

export default SubTitles;
