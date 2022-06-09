import { parse, subTitleType } from 'subtitle'
import UI from './ui';

let subs: subTitleType[] = [
    {end: 2, text: "hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello hello", start:1},
    {end: 2, text: "world2", start:1},
    {end: 2, text: "hello", start:1},
    {end: 2, text: "morning", start:1},

]

UI.renderSubs("body", subs);
