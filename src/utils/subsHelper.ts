/**
 * Helpers for working with subtitles
 */
import { subTitleType } from 'subtitle'
import {subTitle} from '../components/subtitles'

import { getCurrentTime } from './videoHelpers'


export const subTextToChildNodesArray = (text: string): ChildNode[] => {
  const tmpDiv = document.createElement('div') as HTMLDivElement
  tmpDiv.innerHTML = text.replace(/(<\d+:\d+:\d+.\d+>)?<[/]?[c].*?>/g, '').replace(/[\r\n]+/g, '\r\n ')
  return Array.from(tmpDiv.childNodes)
}

export const getCleanSubText = (text: string): string => {
    if (!text) return '';
  const tmpDiv = document.createElement('div') as HTMLDivElement
  tmpDiv.innerHTML = text
    .replace(/<\d+:\d+:\d+.\d+><c>/g, '')
    .replace(/<\/c>/g, '')
    .replace(/(\r\n|\n|\r)/gm, ' ')
  return tmpDiv.textContent.trim() || ''
}

export const getCurrentFirstSub = (subs: subTitle[], currentTime: number) => {
  return getAllCurrentSub(subs, currentTime)[0]
}

export const mergeSubs = (subs: subTitleType[]) => {
    let newSubs: subTitleType[] = []
    for(let i=0; i<subs.length -1; i++) {
        let preSub = subs[i];
        let nextSub = subs[i + 1];
        if (i===0) {
            newSubs.push(preSub)
        }
        let duplicatedLen = hasDuplicateText(preSub.text, nextSub.text)
        if (duplicatedLen) {
            // cut off the duplication part in the nextSub
            let nextText = nextSub.text.slice(duplicatedLen, nextSub.text.length).trim()
            newSubs.push(
                {
                    start: nextSub.start,
                    end: nextSub.end,
                    text: nextText
                }
            )
        } else {
            newSubs.push(
                {
                    start: nextSub.start,
                    end: nextSub.end,
                    text: nextSub.text
                }
            )
        }
    }
    return newSubs;

}

/**
 * test if there is a substring in the end text1 existing in the beginning of text2
 * return the length of the most long substring
 */
export const hasDuplicateText = (text1: string, text2: string) => {
    let maxLength = 0
    for(let i=1; i <= text1.length; i++) {
        let subInText1 = text1.slice(text1.length-i , text1.length)
        let subInText2 = text2.slice(0, i)
        if (subInText1  === subInText2) {
            maxLength = i;
        }
    }
    return maxLength
}

// export const getCurrentLastSub = (subs: subTitleType[], currentTime: number) => {
//   return getAllCurrentSub(subs, currentTime).slice(-1)[0]
// }

// export const getPrevSub = (subs: subTitleType[], currentTime: number): subTitleType | undefined => {
//   const currentSub = getCurrentLastSub(subs, currentTime)
//   if (currentSub) {
//     const indexCurrentSub = subs.findIndex((sub) => sub === currentSub)
//     return subs[indexCurrentSub - 1]
//   }

//   return subs.find((sub, index) => {
//     return sub.end <= currentTime && (!subs[index + 1] || subs[index + 1].start >= currentTime)
//   })
// }

// export const getNextSub = (subs: subTitleType[], currentTime: number): subTitleType | undefined => {
//   const currentSub = getCurrentFirstSub(subs, currentTime)
//   if (currentSub) {
//     const indexCurrentSub = subs.findIndex((sub) => sub === currentSub)
//     return subs[indexCurrentSub + 1]
//   }

//   return subs.find((sub) => sub.start >= currentTime)
// }

const getAllCurrentSub = (subs: subTitle[], currentTime: number) => {
  return subs.filter((sub: subTitle) => sub.subInfo.start <= currentTime && sub.subInfo.end >= currentTime)
}
