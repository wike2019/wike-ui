import {Ieditor,lastPos} from "../type"
import { injectable } from "inversify";
import  {eventBus as editorEvent} from "../service/init";
import  {saveMd} from "../storage/download";
import "reflect-metadata";
@injectable()
export  class Editor implements Ieditor {
    public editor: any;
    public lastPos: lastPos;
    public lastInsert:string

    public insertContent(str:string) {// 插入文本

        this.editor.replaceSelection(str);
        this.lastInsert = str.replace(/\n/g, '');
    }

    private  setCursor(line = 0, ch = 0) {// 设置焦点
        this.editor.setCursor(line, ch);
        this.editor.focus();
    }
    private  getSelection():string{
        return this.editor.getSelection();
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
    public del(){
        if (!this.editor.isClean()) {
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
        const selection = this.getSelection();
        if (selection) {
            this.insertContent('**' + selection + '**');
        } else {
            this.insertContent('****');
            this.setCursor(this.lastPos.line, this.lastPos.ch + 2);
        }
    }
    insertItalic() {// 斜体
        const selection = this.getSelection();
        if (selection) {
            this.insertContent('*' + selection + '*');
        } else {
            this.insertContent('**');
            this.setCursor(this.lastPos.line, this.lastPos.ch + 1);
        }
    }
    insertUnderline() {// 下划线  //和insertStrong原理一样

        const selection = this.getSelection();
        if (selection) {
            this.insertContent("<u>" + selection + "</u>");
        } else {
            this.insertContent("<u></u>");
            this.setCursor(this.lastPos.line, this.lastPos.ch + 3);
        }
    }
    insertOverline() {// 删除线
        const selection = this.getSelection();
        if (selection) {
            this.insertContent("~~" + selection + "~~");
        } else {
            this.insertContent("~~~~");
            this.setCursor(this.lastPos.line, this.lastPos.ch + 2);
        }
    }
    insertTitle(level:any) {// 插入标题
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
            if (this.editor.isClean()) {  //判断是否是空文档 特殊处理
                this.insertContent(title+"\n ");
                this.setCursor(0,title.length)
                return;
            } else {
                this.insertContent("\n" + title+"\n ");
                this.setCursor(this.lastPos.line + 1,title.length)
                return;
            }
        }
    }

    insertLine() {// 插入分割线
      if (this.editor.isClean()) { //判断是否是空文档 特殊处理
        this.insertContent("----\n");
      } else {
        this.insertContent("\n\n----\n");
      }
    }
    insertQuote() {// 引用

      const selection = this.getSelection();
      if (selection) {
        this.insertContent("\n>  " + selection + "\n\n");
      } else {
        if (this.editor.isClean()) {
          this.insertContent(">  ");
          this.setCursor(0, 3);
        } else {
          this.insertContent("\n>  ");
          this.setCursor(this.lastPos.line + 1, 3);
        }
      }
    }
    insertUl() {// 无序列表


      const selection = this.getSelection(); //和insertTitle原理一样
      if (selection) {
        this.insertContent("\n-  " + selection + "\n\n");
      } else {
        if (this.editor.isClean() || this.lastPos.ch === 0) { //此时不仅仅判断为空 还判断是否是一行的起始位置
          this.insertContent("-  ");
          this.setCursor(this.lastPos.line, 3);
        } else {
          this.insertContent("\n-  ");
          this.setCursor(this.lastPos.line + 1, 3);
        }
      }
    }
    insertOl() {// 有序列表
      const selection = this.getSelection();
      if (selection) {
        this.insertContent("\n1.  " + selection + "\n\n");
      } else {
        if (this.editor.isClean() || this.lastPos.ch === 0) {
          this.insertContent("1.  ");
          this.setCursor(this.lastPos.line, 4);
        } else {
          this.insertContent("\n1.  ");
          this.setCursor(this.lastPos.line + 1, 4);
        }
      }
    }
    insertFinished() {// 已完成列表

      const selection = this.getSelection();
      if (selection) {
        this.insertContent("\n- [x] " + selection + "\n\n");
      } else {
        if (this.editor.isClean() || this.lastPos.ch === 0) {
          this.insertContent("- [x] ");
          this.setCursor(this.lastPos.line, 6);
        } else {
          this.insertContent("\n- [x] ");
          this.setCursor(this.lastPos.line + 1, 6);
        }
      }
    }
    insertNotFinished() {// 未完成列表
      const selection = this.getSelection();
      if (selection) {
        this.insertContent("\n- [ ] " + selection + "\n\n");
      } else {
        if (this.editor.isClean() || this.lastPos.ch === 0) {
          this.insertContent("- [ ] ");
          this.setCursor(this.lastPos.line, 6);
        } else {
          this.insertContent("\n- [ ] ");
          this.setCursor(this.lastPos.line + 1, 6);
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
    handleSave() {// 保存操作
        editorEvent.emit("save")
    }
    exportFile() {// 导出为.md格式
        saveMd(this.editor.getValue(),"我的文档.md");
    }


}
