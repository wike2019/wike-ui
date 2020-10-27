import { Container} from "inversify";


import {Editor} from "./models/Editor"
type EditorProvider = (editor:any, lastPos:any) => Promise<Editor>;
const container = new Container();
container.bind<Editor>("Editor").to(Editor)

container.bind<EditorProvider>("EditorProvider").toProvider<Editor>((context) => {
    return (editor:any, lastPos:any) => { // Custom args!
        return new Promise<Editor>((resolve) => {

                let Editor = context.container.get<Editor>("Editor");
                Editor.editor = editor;
                Editor.lastPos = lastPos?.value;
                resolve(Editor);
        });
    };
});
export {container}
