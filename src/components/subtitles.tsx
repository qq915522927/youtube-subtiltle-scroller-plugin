
import Draggable from 'react-draggable'

function SubTitles(props) {


    return (
        <Draggable handle="#handle">
          <div className="subtitle-box">
            <div id="handle" className="subtitle-nav">
              哈哈哈哈
            </div>
            <div className="subtitle-container">
              { props.subs.slice(1,20).map((sub, index) => {
                return (<p key={index}>{sub.text}</p>)
              }) }


            </div>
          </div>
        </Draggable>
      )
}

export default SubTitles
