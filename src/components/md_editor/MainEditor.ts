import {core} from "../../core/core";
import {handlePaste,saveMd} from "./fns";

@core.injectable()
export  class MainEditor extends core.Base{
    static classname="MainEditor"
    public  editor:any;
    public factory(root,editor_main_attr,height,ctx,currentValue){

        this.editor=ace.edit("edtior",{minLines: 0})
        let  langTools = ace.require("ace/ext/language_tools");
        this.editor.session.setMode("ace/mode/markdown");
        this.editor.setTheme("ace/theme/nord_dark");
        this.editor.setAutoScrollEditorIntoView(true);
        this.editor.setOption("maxLines", 100);
        this.editor.focus();
        this.editor.resize(true)

        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        this.editor.on('change', data => {
            this.lastPos=this.editor.selection.getCursor()
            currentValue.value=this.editor.getValue()
            editor_main_attr.editorScrollHeight=$(root.value).height()
            this.editor.execCommand("startAutocomplete");
        });



        this.editor.session.on("changeScrollTop", (scrollTop) => {
            let temp=new Object()
            temp.height=$('#edtior').height()
            temp.scrollTop=scrollTop
            editor_main_attr.editorScroll=temp
        }); //2个视窗都滚动

        this.editor.on("keydown", (data, e) => {
            if (e.keyCode === 83) {
                if (e.metaKey || e.ctrlKey) {
                    //ctrl +s 保存
                    e.preventDefault();
                    ctx.emit("save",{rawvalue:editor_main_attr.currentValue,html:editor_main_attr.html})
                }
            } else if (e.keyCode === 13) {
                this.enter()
            } else if (e.keyCode === 8) {
                this.del()
            }
        });
        this.editor.on("focus", () => {
            try {
               // editor_main_attr.lastdata=this.editor.getCursor()
                this.lastPos=this.editor.selection.getCursor()
            }catch (e) {
            }
        });
        this.editor.on("blur", () => {
            try {
                // editor_main_attr.lastdata=this.editor.getCursor()
                this.lastPos=this.editor.selection.getCursor()
            }catch (e) {
            }
        });
        return this
    }
    public  setValue(value){
        //console.log(value)
        this.editor.setValue(value,-1);
    }
    public lastPos={row:0,column:0};
    public lastInsert:string

    public insertContent(str:string) {// 插入文本
        this.editor.session.replace(this.editor.getSelectionRange(), str);
        this.lastInsert = str.replace(/\n/g, '');
    }

    public  setCursor(row = 0, column = 0) {// 设置焦点\
                console.log(row,column)
            this.editor.gotoLine(row+1, column,true);
            this.editor.focus();


    }
    public  getSelection():string{
        return this.editor.getSelectedText()
    }
    public enter(){
        if (this.lastInsert) {   //通过对比lastInsert的值 是否属于list内 然后处理 或者数字递增
            const list = ['-', '- [ ]', '- [x]'];
            if (list.includes(this.lastInsert.trim())) {
                this.insertContent('\n' + this.lastInsert);
            } else if (/^\d+\.$/.test(this.lastInsert.trim())) {
                this.insertContent(
                    '\n' + (parseInt(this.lastInsert, 0) + 1) + '.  '
                );
            }
        }
    }
    public isClean(){
        return this.editor.getValue().trim()==''
    }
    public del(){
        if (!this.isClean()) {
            const value = this.editor.getValue();
            if (value.split("\n").pop() === "") {
                this.lastInsert = "";
            }
        }
    }
    redo(){
        this.editor.redo();//重做编辑器
    }
    undo(){
        this.editor.undo();
    }

    public insertStrong() {// 粗体
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent('**' + selection + '**');
        } else {
            this.insertContent('****');
            this.setCursor(cacolumne.row, cacolumne.column + 2);
        }
    }
    insertItalic() {// 斜体
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent('*' + selection + '*');
        } else {
            this.insertContent('**');
            this.setCursor(cacolumne.row, cacolumne.column + 1);
        }
    }
    insertUnderline() {// 下划线  //和insertStrong原理一样
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("<u>" + selection + "</u>");
        } else {
            this.insertContent("<u></u>");
            this.setCursor(cacolumne.row, cacolumne.column + 3);
        }
    }
    insertOverline() {// 删除线
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("~~" + selection + "~~");
        } else {
            this.insertContent("~~~~");
            this.setCursor(cacolumne.row, cacolumne.column + 2);
        }
    }
    insertTitle(level:any) {// 插入标题
        let cacolumne=this.lastPos
        console.log(cacolumne)
        const titles = {
            1: "#  ",
            2: "##  ",
            3: "###  ",
            4: "####  ",
            5: "#####  ",
            6: "######  "
        };
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("\n" + titles[level] + selection + "\n");
            return
        } else {
            const title = titles[level];
            if (this.isClean()) {  //判断是否是空文档 特殊处理
                this.insertContent(title+"\n ");
                this.setCursor(0,title.length)
                return;
            } else {
                this.insertContent("\n" + title+"\n ");
                this.setCursor(cacolumne.row + 1,title.length)
                return;
            }
        }
    }

    insertLine() {// 插入分割线
        if (this.isClean()) { //判断是否是空文档 特殊处理
            this.insertContent("----\n");
        } else {
            this.insertContent("\n\n----\n");
        }
    }
    insertQuote() {// 引用
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("\n>  " + selection + "\n\n");
        } else {
            if (this.isClean()) {
                this.insertContent(">  ");
                this.setCursor(0, 3);
            } else {
                this.insertContent("\n>  ");
                this.setCursor(cacolumne.row + 1, 3);
            }
        }
    }
    insertUl() {// 无序列表

        let cacolumne=this.lastPos
        const selection = this.getSelection(); //和insertTitle原理一样
        if (selection) {
            this.insertContent("\n-  " + selection + "\n\n");
        } else {
            if (this.isClean() || cacolumne.column === 0) { //此时不仅仅判断为空 还判断是否是一行的起始位置
                this.insertContent("-  ");
                this.setCursor(cacolumne.row, 3);
            } else {
                this.insertContent("\n-  ");
                this.setCursor(cacolumne.row + 1, 3);
            }
        }
    }
    insertOl() {// 有序列表
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("\n1.  " + selection + "\n\n");
        } else {
            if (this.isClean() || cacolumne.column === 0) {
                this.insertContent("1.  ");
                this.setCursor(cacolumne.row, 4);
            } else {
                this.insertContent("\n1.  ");
                this.setCursor(cacolumne.row + 1, 4);
            }
        }
    }
    insertFinished() {// 已完成列表
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("\n- [x] " + selection + "\n\n");
        } else {
            if (this.isClean() || cacolumne.column === 0) {
                this.insertContent("- [x] ");
                this.setCursor(cacolumne.row, 6);
            } else {
                this.insertContent("\n- [x] ");
                this.setCursor(cacolumne.row + 1, 6);
            }
        }
    }
    insertNotFinished() {// 未完成列表
        let cacolumne=this.lastPos
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("\n- [ ] " + selection + "\n\n");
        } else {
            if (this.isClean() || cacolumne.column === 0) {
                this.insertContent("- [ ] ");
                this.setCursor(cacolumne.row, 6);
            } else {
                this.insertContent("\n- [ ] ");
                this.setCursor(cacolumne.row + 1, 6);
            }
        }
    }
    clear(){
        this.editor.setValue("")
    }
    insertImage(url) {// 插入图片
        if(typeof url=="string"){
            this.insertContent("\n![image]("+url+")");
        }else{

            this.insertContent("\n![image](http://csdn.52wike.com/wike.jpeg)");
        }
    }
    exportFile() {// 导出为.md格式
        saveMd(this.editor.getValue(),"我的文档.md");
    }
}




