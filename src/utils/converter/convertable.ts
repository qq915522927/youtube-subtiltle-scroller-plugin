import { Alines } from "../../types/aline";

export interface Convertable {
  convert(xmlResponse: string): void;
  format(xmlResponse: string): Alines;
}
