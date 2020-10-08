

function createActions(editor,lastPos,lastInsert,emit) {
  const setCursor = (line = 0, ch = 0) =>{// 设置焦点

    const vmeditor = editor.value;
    if (!vmeditor) {
      return;
    }

    try {
      vmeditor.setCursor(line, ch); //游标更新
      // @ts-ignore
      vmeditor.focus(); //触发focus 将更新的游标保存到lastPos中
    }catch (e) {
    }finally {
      vmeditor.refresh()
    }


  }
   const  actions={
    redo(){
       editor?.value.redo();//重做编辑器
     },
     undo(){
       editor?.value.undo();
     },
     insertContent(str){
       editor?.value.replaceSelection(str);
       lastInsert.value = str.replace(/\n/g, ""); //保存上一次插入的内容，去掉空格 这个功能用于 列表等操作按回车自增
     },
     insertStrong(){// 粗体
       const {line = 0, ch = 0} = lastPos;
       const selection = editor?.value.getSelection(); //得到选中的值
       if (selection) { //如果有选中值则将选中值替换成 **" + 选中值 + "**"
         actions.insertContent("**" + selection + "**");
         return;
       } else {
         actions.insertContent("****");
         setCursor(line, ch + 2)
         return;
       }
     },
     insertItalic() {// 斜体
        const {line = 0, ch = 0} = lastPos;
        const selection = editor?.value.getSelection();
        if (selection) {
          actions.insertContent("*" + selection + "*");
          return;
        } else {
          actions.insertContent("**");
          setCursor(line, ch +1)
          return;
        }
      },
     insertUnderline() {// 下划线  //和insertStrong原理一样
        const {line = 0, ch = 0} = lastPos;
        const selection = editor?.value.getSelection();
        if (selection) {
          actions.insertContent("<u>" + selection + "</u>");
          return;
        } else {
          actions.insertContent("<u></u>");
          setCursor(line, ch +3)
          return;
        }
      },
     insertOverline() {// 删除线
       const {line = 0, ch = 0} = lastPos;
       const selection = editor?.value.getSelection();
       if (selection) {
         actions.insertContent("~~" + selection + "~~");
         return;
       } else {
         actions.insertContent("~~~~");
         setCursor(line, ch +2)
         return;
       }
     },

    insertTitle(level) {// 插入标题
      const titles = {
        1: "#  ",
        2: "##  ",
        3: "###  ",
        4: "####  ",
        5: "#####  ",
        6: "######  "
      };
      const {line} = lastPos;
      const selection = editor?.value.getSelection();
      if (selection) {
        actions.insertContent("\n" + titles[level] + selection + "\n");
        return
      } else {
        const title = titles[level];
        if ( editor?.value.isClean()) {  //判断是否是空文档 特殊处理
          actions.insertContent(title+"\n ");
          setCursor(0,title.length)
          return;
        } else {
          actions.insertContent("\n" + title+"\n ");
          setCursor(line + 1,title.length)
          return;
        }
      }
    },
// insertLine() {// 插入分割线
//   const {editor} = this; //和insertStrong原理一样
//   if (editor.isClean()) { //判断是否是空文档 特殊处理
//     this.insertContent("----\n");
//   } else {
//     this.insertContent("\n\n----\n");
//   }
// },
// insertQuote() {// 引用
//   const {editor, lastPos = {}} = this; //和insertTitle原理一样
//   const {line = 0} = lastPos;
//   const selection = editor.getSelection();
//   if (selection) {
//     this.insertContent("\n>  " + selection + "\n\n");
//   } else {
//     if (editor.isClean()) {
//       this.insertContent(">  ");
//       this.setCursor(0, 3);
//     } else {
//       this.insertContent("\n>  ");
//       this.setCursor(line + 1, 3);
//     }
//   }
// },
// insertUl() {// 无序列表
//   const {editor, lastPos = {}} = this;
//   const {line = 0, ch = 0} = lastPos;
//   const selection = editor.getSelection(); //和insertTitle原理一样
//   if (selection) {
//     this.insertContent("\n-  " + selection + "\n\n");
//   } else {
//     if (editor.isClean() || ch === 0) { //此时不仅仅判断为空 还判断是否是一行的起始位置
//       this.insertContent("-  ");
//       this.setCursor(line, 3);
//     } else {
//       this.insertContent("\n-  ");
//       this.setCursor(line + 1, 3);
//     }
//   }
// },
// insertOl() {// 有序列表
//   const {editor, lastPos = {}} = this; //和insertUl原理一样
//   const {line = 0, ch = 0} = lastPos;
//   const selection = editor.getSelection();
//   if (selection) {
//     this.insertContent("\n1.  " + selection + "\n\n");
//   } else {
//     if (editor.isClean() || ch === 0) {
//       this.insertContent("1.  ");
//       this.setCursor(line, 4);
//     } else {
//       this.insertContent("\n1.  ");
//       this.setCursor(line + 1, 4);
//     }
//   }
// },
// insertFinished() {// 已完成列表
//   const {editor, lastPos = {}} = this;  //和insertUl原理一样
//   const {line = 0, ch = 0} = lastPos;
//   const selection = editor.getSelection();
//   if (selection) {
//     this.insertContent("\n- [x] " + selection + "\n\n");
//   } else {
//     if (editor.isClean() || ch === 0) {
//       this.insertContent("- [x] ");
//       this.setCursor(line, 6);
//     } else {
//       this.insertContent("\n- [x] ");
//       this.setCursor(line + 1, 6);
//     }
//   }
// },
// insertNotFinished() {// 未完成列表
//   const {editor, lastPos = {}} = this;  //和insertUl原理一样
//   const {line = 0, ch = 0} = lastPos;
//   const selection = editor.getSelection();
//   if (selection) {
//     this.insertContent("\n- [ ] " + selection + "\n\n");
//   } else {
//     if (editor.isClean() || ch === 0) {
//       this.insertContent("- [ ] ");
//       this.setCursor(line, 6);
//     } else {
//       this.insertContent("\n- [ ] ");
//       this.setCursor(line + 1, 6);
//     }
//   }
// },
// redo() {
//   const {editor} = this;
//   editor.redo();//重做编辑器
//   setTimeout(() => {
//     editor.refresh(); //更新视图
//   }, 20);
// },
// clear(){
//   this.editor.setValue("")
// },
//
// //高级用法
// insertImage(url) {// 插入图片
//   if(typeof url=="string"){
//
//     this.insertContent("\n![image]("+url+")");
//
//   }else{
//
//     this.insertContent("\n![image](http://csdn.52wike.com/wike.jpeg)");
//   }
//
// },
// handleSave() {// 保存操作
//   const {currentValue, themeName, html} = this;
//   this.$emit(eventConfig.save, {
//     theme: themeName,
//     value: currentValue,
//     html
//   });
// },
//
// exportFile() {// 导出为.md格式
//   saveFile(this.currentValue, this.exportFileName + ".md");
// },
// exportPdf(){
//   savePdf(this.vm.html,this.exportFileName+ ".pdf")
// },
// importFile(e) {// 导入本地文件
//   const file = e.target.files[0];
//   if (!file) {
//     return;
//   }
//   if(!/^md$/ig.test(file.name.split(".").pop())){
//     alert("文件格式不对")
//     return;
//   }
//   const reader = new FileReader();
//   reader.readAsText(file, {
//     encoding: "utf-8"
//   });
//   reader.onload = () => {
//     e.target.value = "";
//     this.insertContent(reader.result)
//
//   };
//   reader.onerror = err => {
//     console.error(err);
//   }
// },
// importDoc(e) {// 导入本地文件
//   const file = e.target.files[0];
//   try {
//     if(/^doc[x]?$/ig.test(file.name.split(".").pop())){
//       const reader = new FileReader();
//       reader.readAsArrayBuffer(file);
//       reader.onload = () => {
//         let data=reader.result;
//         mammoth.convertToHtml({arrayBuffer: data}).then((html)=>{
//           this.insertContent("\n"+html2md(html.value)+"\n");
//         })
//       };
//       reader.onerror = err => {
//         console.error(err);
//       }
//
//     }else {
//       alert("文件格式不对")
//     }
//   }catch (e) {
//     console.log(e)
//   }
//
// },
// chooseImage() {// 选择图片
//   const input = document.createElement("input");
//   input.type = "file";
//   input.accept = "image/*";
//   input.onchange = ()=>{
//     const files = input.files;
//     if(files[0]){
//       this.$emit(eventConfig.imageUpload, files[0]);
//       input.value = "";
//     }
//   }
//   input.click();
// },
// //以下为弹窗方法
// insertCode() {// 插入code
//   const selection =this.editor.getSelection(); //代码弹窗
//   this.vm.alert.show(alertConfig.code)
//   this.$nextTick(()=>{
//     this.vm.alert.codeeditor.setValue(selection)
//     this.vm.alert.codeeditor.focus()
//     this.vm.alert.codeeditor.setCursor(0, 0)
//   })
//
// },
//
// insertLink() {// 插入链接
//   const selection =this.editor.getSelection(); //超链接弹窗
//   this.vm.alert.show(alertConfig.href)
//   this.$nextTick(()=>{
//     this.vm.alert.setValue("href_dialog_txt",selection);
//   })
//
// },
// sqlparse(){
//   this.vm.alert.show(alertConfig.sql)
// },
// htmlparse(){
//   this.vm.alert.show(alertConfig.html)
// },
// insertTable(){
//   this.vm.alert.show(alertConfig.table)
// },
//
  }
  return actions
}



export  default createActions;
