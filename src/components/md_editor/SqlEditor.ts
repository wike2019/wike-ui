import {core} from "../../core/core";


@core.injectable()
export  class SqlEditor extends core.Base{
    static classname="SqlEditor"
    public  editor:any;
    public factory(root,sql){

        this.editor=ace.edit(root,{minLines: 0})
        let  langTools = ace.require("ace/ext/language_tools");
        this.editor.session.setMode("ace/mode/sql");
        this.editor.setTheme("ace/theme/nord_dark");
        this.editor.setAutoScrollEditorIntoView(true);
        this.editor.setOption("maxLines", 25);
        this.editor.resize(true)
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
        });

        this.editor.on('change', data => {
            this.editor.execCommand("startAutocomplete");
            sql.value=this.editor.getValue()
        });

        return this.editor
    }
    public  setValue(value){
        this.editor.setValue(value,-1);
    }
}




