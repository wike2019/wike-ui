import {injectable, interfaces } from "inversify";

@injectable()
export abstract class Base {
    static isSingle: boolean = true //是否是单例
    static iocinstance: any; //实例对象
    static tag:string='default'; //容器名字
    private __cach: Base; //上下文缓存

    public __save() {
        this.__cach = Object.assign({}, this) //保存上下文
    }

    public __restore() {
        Object.assign(this, this.__cach) //恢复上个状态
    }

    public static ioc<T>(data: any, container: interfaces) {
        if(!data.classname){
            throw ("classname静态属性必须定义")
        }
        if (data.isSingle) {
            data.iocinstance = container.bind<T>(data.classname).to(data).inSingletonScope().whenTargetNamed(data.tag)
        } else {
            data.iocinstance = container.bind<T>(data.classname).to(data).whenTargetNamed(data.tag)
        }
        return data.iocinstance
    }

    static  Aop<T>(data:any,method:string,before:Function,after:Function){
            data.iocinstance.onActivation((context: any, data: { [x: string]: any; use: any; }) => {
                let handler = {
                    apply: function (target: { apply: (arg0: any, arg1: any) => any; },
                                     thisArgument: any, argumentsList: any) {
                        before?.apply(thisArgument, argumentsList);
                        let result = target.apply(thisArgument, argumentsList);
                        after?.apply(thisArgument, [result, ...argumentsList]);
                        ;
                        return result;
                    }
                };
                data[method] = new Proxy(data[method], handler);
                return data
            })

    }
    showCase(){
        console.log(
`
@core.injectable()
export  class demo extends core.Base{
     static classname="demo"
     @core.inject('demo_inject') @core.named('default')
     public demo_inject:demo_inject
}
demo_inject.ioc<demo_inject>(demo_inject,core.container) //注册
demo.ioc<demo>(demo,core.container) //注册
console.log(core.getInstance("demo",core.container,'default'))//取对象
`
        )
    }
}
