export const Annotation={
    __class:{},
    __method:{},
    __attr:{},
    getAnnotation:function(type:string,name:string){
        if(type=='class'){
            return this.__class[name]
        }
        if(type=='method'){
            return this.__method[name]
        }
        if(type=='attr'){
            return this.__attr[name]
        }
        throw("未找到对应注解"+name)

    },
    _class: function <T>(name:string,func:Function) {
        if(  this.__class[name])
            throw("class注解已存在，注解名"+name)
        this.__class[name]=func
        return this
    },
    showClassCase:function(){
        console.log(`
core.Annotation._class('classDecorator',function(arg){
     return  function<T extends {new(...args:any[]):{}}>(constructor:T) {
         console.log(arg)
         return class extends constructor {
             newProperty = "new property";
             hello = "override"
         }

     }
 })
`)
        return this
    },
    showMethodCase:function(){
        console.log(`
core.Annotation._medthod("methodDecorator",function (data: string) {
     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
         console.log('方法装饰器'+data)
     };
`)
        return this
    },
    showAttrCase:function(){
        console.log(`
core.Annotation._attrSet("attrDecorator")
core.Annotation._attrGet("attrDecorator",this, "age");
`)
        return this
    },
    _medthod:function (name:string,func:Function) {
        if(  this.__method[name])
            throw("medthod注解已存在，注解名"+name)
        this.__method[name]=func
        console.log(this.__method)
        return this
    },
    _attrSet:function (name:any) {
        if(  this.__attr[name])
            throw("attr注解已存在，注解名"+name)
        this.__attr[name]=function (value:any) {
            return Reflect.metadata(name, value);
        }
        return this

    },
    _attrGet:function (name:any,target:any,key:any) {
        return Reflect.getMetadata(name,target ,key);
    },
}