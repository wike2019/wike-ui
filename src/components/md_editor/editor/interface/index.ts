import {container as editorIoc} from "../ioc";
import {Ieditor} from "../type";
import {factory,listener,factorySimper,factorySimperlistener} from "../service/init";
import  {eventBus as editorEvent} from "../service/init";

const editorCommit=(type:string,editor,lastdata,level)=>{

    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");

    EditorProvider(editor, lastdata).then((vm:Ieditor) => { // Apply all custom args
        vm[type](level)
    });
}

const insertContent=(str:string,editor, lastdata)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor, lastdata).then((vm:Ieditor) => { // Apply all custom args
        vm.insertContent(str)
    });

}
const  insertImage=(str:string,editor, lastdata)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor, lastdata).then((vm:Ieditor) => { // Apply all custom args
        vm.insertImage(str)
    });

}
const scrollTo=(scrollTop:number,editor)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor).then((vm:Ieditor) => { // Apply all custom args
        vm.editor.scrollTo(0, scrollTop);
    });

}
const setEditorValue=(value:string,editor)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor).then((vm:Ieditor) => { // Apply all custom args
        vm.editor.setOption("value", value);
    });

}
const doEnter=(editor, lastdata)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor,lastdata).then((vm:Ieditor) => { // Apply all custom args
        vm.enter()
    });

}

const del=(editor, lastdata)=>{
    let EditorProvider = editorIoc.get<EditorProvider>("EditorProvider");
    EditorProvider(editor,lastdata).then((vm:Ieditor) => { // Apply all custom args
        vm.del()
    });

}

export {editorCommit,insertContent,factory,listener,scrollTo,setEditorValue,editorEvent,doEnter,del,insertImage,factorySimper,factorySimperlistener}
