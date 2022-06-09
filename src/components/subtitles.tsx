import Draggable from "react-draggable";

function SubTitles(props) {
	return (
		<Draggable handle="#handle">
			<div className="subtitle-box">
				<div id="handle" className="subtitle-nav container-fluid">
					<button
						className="btn btn-primary"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#subtitle-container"
						aria-expanded="false"
						aria-controls="collapseExample"
					>
						折叠
					</button>
				</div>
				<div  id="subtitle-container" className="subtitle-container container-fluid collapse">
					{props.subs.map((sub, index) => {
						return (
							<div className="row">
								<div className="col" key={index}>
									{sub.text}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Draggable>
	);
}

export default SubTitles;
