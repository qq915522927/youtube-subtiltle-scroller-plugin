import { CaptionTrack } from "../types/captionTrack";

export const VideoInformationResponseParser = {
  parse: (htmlStringData: string): CaptionTrack[] => {
    const captionTracks = /\{"captionTracks":(\[.*?\]),/g.exec(htmlStringData);
    if (!captionTracks) throw new Error("Not found caption track list");
    return JSON.parse(captionTracks[1]) as CaptionTrack[];
  },
};
