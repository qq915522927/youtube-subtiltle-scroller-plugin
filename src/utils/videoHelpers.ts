/**
 * Helpers for working with video
 */
import { subTitleType } from 'subtitle'

import { getCurrentFirstSub,} from './subsHelper'

import { castSubTime } from './castSubTime'

const rewindTime = 5000

export const getCurrentTime = (video: HTMLVideoElement) => {
  return Math.round(video.currentTime * 1000)
}

export const moveToTime = (video: HTMLVideoElement, time: number | string) => {
    video.currentTime = castSubTime(time) / 1000
}
