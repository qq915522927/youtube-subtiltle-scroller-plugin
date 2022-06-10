import ReactDOM from 'react-dom'
import React from 'react'
import SubTitles from './components/subtitles';
import { subTitleType } from 'subtitle'
import "./css/style.css"
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap"

const e = React.createElement;

class UI {
  public static renderSubs(playerContainerElementSelector: string) {
    const playerContainerElement = document.querySelector(playerContainerElementSelector)
    const subsContainerElement = document.createElement('div')
    subsContainerElement.id = 'subtitle-navigation'
    playerContainerElement?.appendChild(subsContainerElement)
    ReactDOM.render(e(SubTitles) , document.querySelector('#subtitle-navigation'));
  }

}

export default UI
