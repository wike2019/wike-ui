import {core} from "../../core/core";

@core.injectable()
export  class CodeEditor extends core.Base{
    static classname="CodeEditor"
    public  editor:any;
    public factory(root,editor_code_attr,height){

        this.editor=ace.edit('codeEditor',{minLines: 0})

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
            editor_code_attr.code_data=this.editor.getValue()
        });

        return this.editor
    }
    public  setValue(value){
        this.editor.setValue(value,-1);
    }
}




