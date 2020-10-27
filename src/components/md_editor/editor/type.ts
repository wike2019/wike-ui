
export interface Ieditor {
    editor: any;
    lastPos:any;
    insertContent(str:string):void;
    insertStrong():void
    enter():void
    del():void
    insertImage():void
}
