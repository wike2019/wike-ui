import {core} from "../../core/core";

export  function  sqlparse(data) {
    let datacontent=/CREATE\s+TABLE\s+`(\w+)`\s*\(([\W\w]+)\)/i.exec(data)

    //console.log(datacontent[2])
    let arr=datacontent[2].split(/,\n/)
    let res=[]
    //console.log(arr)
    for(let i=0;i<arr.length;i++){

        let item1=/\s*`(\w+)`\s+([\S]+)\s+(NOT NULL)\s*/i.exec(arr[i]) //是否为null
        let item2=/\s*`(\w+)`\s+([\S]+)[\W\w]+DEFAULT\s+([\S]+)\s*/i.exec(arr[i]) //默认值2
        let item3=/\s*`(\w+)`\s+([\S]+).+DEFAULT\s+[\'\"](.*?)[\'\"]\s*/i.exec(arr[i]) //默认值1
        let item4=/^\s*`(\w+)`\s+([\S]+)\s*/i.exec(arr[i]) //表名和数据类型
        let item5=/\s*`(\w+)`\s+([\S]+).+COMMENT\s+[\'\"](.*?)[\'\"]\s*/i.exec(arr[i])//注释


        if(item4){
            res[i]=[];
        }else{
            continue;
        }


        res[i][0]=item4[1]
        res[i][1]=item4[2]
        res[i][2]=item1?"否":"是"
        if(item3){
            res[i][3]=item3[3]
        }else if(item2){
            res[i][3]=item2[3]
        }else{
            res[i][3]='无'
        }
        if(item5){
            res[i][4]=item5[3]
        }else{
            res[i][4]='无'
        }

    }
    for(let i=0;i<arr.length;i++){
        let item6=/(\w+\s+\w*)\s*`(\w+)`\s+([\S]+)\s*/i.exec(arr[i]) //获取索引
        let item7=/PRIMARY\s+KEY\s+\((.*)\).*/i.exec(arr[i]) //获取索引
        if(item7){

            item7=item7[1].split(',')
            for(let k=0;k<item7.length;k++){

                let temp=item7[k].trim(/[\"\']/g)
                temp=/`(\w+)`/i.exec(temp)[1]

                for(let k2=0;k2<res.length;k2++){
                    if(res[k2][0]==temp){
                        res[k2][5]= res[k2][5]||''
                        if(res[k2][5].indexOf("主键")==-1)
                            res[k2][5]+="主键 "
                    }
                }

            }


        }
        if(item6){
            let KEY=item6[1]
            let item=item6[3].split(',')
            for(let t=0;t<item.length;t++){
                let temp=item[t].trim(/[\"\']/g)
                temp=/`(\w+)`/i.exec(temp)[1]
                for(let k3=0;k3<res.length;k3++){
                    if(res[k3][0]==temp){
                        res[k3][5]= res[k3][5]||''
                        if(/^\s*UNIQUE\s+KEY\s*$/i.exec(KEY)){
                            KEY='唯一索引'
                        }
                        if(/^\s*KEY\s*$/i.exec(KEY)){
                            KEY='普通索引'
                        }
                        if(/^\s*FULLTEXT\s+KEY\s*$/i.exec(KEY)){
                            KEY='全文索引'
                        }
                        if(res[k3][5].indexOf(KEY)==-1)
                            res[k3][5]+=KEY+' '

                    }

                }
            }
        }
    }

    return [datacontent[1],res]
}

/*
* 渲染表格
* */
export function renderTable(tableheader,tabledata,algin='default') {
    let splittype={
        "default":'------------',
        "left":':------------',
        "center":':------------:',
        "right":'------------:',
    }
    let content='\n\n'
    let header ="|"
    for(let j =0;j<tabledata[0].length;j++){
        header+=tableheader[j]+'|'
    }
    content+=header
    content+='\n'
    let split='|'
    for(let t =0;t<tabledata[0].length;t++){
        split+=splittype[algin]+'|'
    }
    content+=split
    content+='\n'
    for(let i =0;i<tabledata.length;i++){
        content+='|'
        for(let j =0;j<tabledata[0].length;j++){
            content+=tabledata[i][j]+'|'
        }
        content+='\n'
    }
    content+='\n'
    return content;
}


export  function  toHtml(data){
    let result={
        data  //全局数据
    }
    const worker = new core.DWorker((data:any)=>{
        //执行一系列操作
        importScripts(base.domain+'/js/marked.min.js');
        importScripts(base.domain+'/js/highlight.pack.js');

        marked.setOptions({
                renderer: new marked.Renderer(),
                highlight: function(code) {
                    return hljs.highlightAuto(code).value;
                },
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            }
        );
        return marked(data.data)
    },result);

    return worker.send({
        method: 'format',
        data: result
    })
}
