//hljs体积过大，多数为解决代码高亮显示的问题,所以只引入部分语言，如果需要可自行加载

import hljs from './highlight'

import javascript from './languages/javascript'
import java from './languages/java';
import css from './languages/css';
import less from './languages/less';
import go from './languages/go';
import markdown from './languages/markdown';
import php from './languages/php';
import typescript from './languages/typescript';
import xml from './languages/xml';
import autohotkey from './languages/autohotkey';
import bash from './languages/bash';
import stylus from './languages/stylus';
import scss from './languages/scss';
import shell from './languages/shell';
export const languages = {
     shell,
     scss,
     bash,
     stylus,
     javascript,
     java,
     css,
     less,
     markdown,
     go,
     php,
    typescript,
    xml,
    autohotkey,

 }

Object.keys(languages).forEach(key => {
    hljs.registerLanguage(key, languages[key])
})

export default hljs;

