import hljs from './hightlight/index';
import marked from './marked/index';

hljs.initHighlightingOnLoad();
const renderer = new marked.Renderer();

export default marked.setOptions({
    renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
})
