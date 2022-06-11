import { CaptionsParser } from "../parser/captionsParser";
import { Aline, VttAline } from "../../types/aline";
import { Convertable } from "./convertable";

export class VttConverter implements Convertable {
  public convert(xmlResponse: string) {
    const text = this.format(xmlResponse).reduce((acc, cur) => {
      return acc + `${cur.timestamp}\n${cur.text}\n\n`;
    }, "WEBVTT\n\n");
    return text;

  }

  public format(xmlResponse: string): VttAline[] {
    const parser = new CaptionsParser();
    const trimTranscript: string[] = parser.explode(
      parser.removeXmlTag(xmlResponse)
);
    return trimTranscript.map((line: string) => {
      const aline: Aline = parser.decodeAline(line);
      const text: string = aline.text.replace(/\n/, " ");
      return {
        timestamp: aline.timestamp.formatVtt(),
        text: text,
      };
    });
  }
}
