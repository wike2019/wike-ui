import {Irender} from "../type"
import { injectable } from "inversify";
import "reflect-metadata";

import hljs from '../../../../assets/hightlight';
import marked from "marked"
const renderer = new marked.Renderer();
hljs.initHighlightingOnLoad();
const markedRender=marked.setOptions({
    renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    toc: true,
    tocm: true,
    tocStartLevel: 1,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
})
@injectable()
export  class Render implements Irender {
   convert(str: string): string {
       return markedRender(str)
   }
}
