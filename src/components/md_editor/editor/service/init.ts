import CodeMirror from "codemirror";
import mitt from 'mitt'


const eventBus = mitt()
const  EditorConfig={
    tabSize: 4,
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: false,
    line: true,
    mode: 'text/x-src',
    theme: 'default',
    cursorHeight:0.8,
    lineWiseCopyCut:true
};
export function factorySimper(root){
    let  editor;
    editor = new CodeMirror(root, {
        value: "",
        ...EditorConfig,
    });
    editor.on('change', data => {
        eventBus.emit("codeData",editor.getValue())
    });
    return editor
}
export function factorySimperlistener(codeData){
    eventBus.on('codeData',(data)=>{
        codeData.value=data
    })
}

export function factory(root,height){
    let  editor;
    editor = new CodeMirror(root, {
        value: "",
        ...EditorConfig,
        onload: (data) => {
            const {doc: {height = 0}} = data;
            eventBus.emit("height",height)
        },
    });
    editor.setSize("auto",height);

    editor.on('change', data => {
        const {
            doc: {height}
        } = data;

        eventBus.emit("lastdata",editor.getCursor())
        eventBus.emit("currentValue",editor.getValue())
        eventBus.emit("height",height)

    });
    editor.on('mousedown',()=>{
        setTimeout(()=>{
            eventBus.emit("lastdata",editor.getCursor())
        },10)


    })
    editor.on("scroll", (data) => {
        eventBus.emit("scroll",data)
    }); //2个视窗都滚动
    editor.on("paste",  (data, e) => {
        eventBus.emit("paste",{data, e})
    }); //监听复制
    editor.on("keydown", (data, e) => {
        if (e.keyCode === 83) {
            if (e.metaKey || e.ctrlKey) {
                //ctrl +s 保存
                e.preventDefault();
                eventBus.emit("save",{data,e})
            }
        } else if (e.keyCode === 13) {
            eventBus.emit("enter",{data,e})
        } else if (e.keyCode === 8) {
            eventBus.emit("delete",{data,e})
        }
    });
    editor.on("focus", () => {
        try {
            eventBus.emit("lastdata",editor.getCursor())

        }catch (e) {

        }

    });
    return editor
}


function listener(lastdata,currentValue,editorScrollHeight,editorScroll){
    eventBus.on('lastdata',(data)=>{
        lastdata.value=data
    })
    eventBus.on('currentValue',(data)=>{
        currentValue.value=data
    })
    eventBus.on('height',(data)=>{
        editorScrollHeight.value=data
    })
    eventBus.on('scroll',(data)=>{
        let temp=new Object()
        temp.height=data.doc.height
        temp.scrollTop=data.doc.scrollTop
        editorScroll.value=temp
    })
}
export {eventBus,listener}
