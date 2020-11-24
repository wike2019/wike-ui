import {MainEditor} from "./MainEditor"
import {CodeEditor} from "./CodeEditor"
import{SqlEditor} from "./SqlEditor"
import {core} from "../../core/core";
MainEditor.ioc<MainEditor>(MainEditor,core.container)
CodeEditor.ioc<CodeEditor>(CodeEditor,core.container)
SqlEditor.ioc<SqlEditor>(SqlEditor,core.container)