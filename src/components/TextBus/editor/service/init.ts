import { createEditor } from '@tanbo/textbus';
import mitt from "mitt";
const eventBus=new mitt()
function factorySimple(root:string,config:Object,html:string){

    const editor = createEditor(root, {contents: html,...config,theme:'dark'});
    editor.onChange.subscribe(() => {
        let content=editor.getContents()
        eventBus.emit("currentValue",content.html)
    });

    return editor
}


function listenerSimple(currentValue){

    eventBus.on('currentValue',(data)=>{
        currentValue.value=data
    })


}
export {eventBus,listenerSimple,factorySimple}