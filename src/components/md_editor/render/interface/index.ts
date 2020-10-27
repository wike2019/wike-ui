import {container as rednerIoc} from "../ioc";
import {Irender} from "../type";
import {sqlparse,renderTable} from "../storage/core";

export function toHtml(data){
    return rednerIoc.get<Irender>("Render").convert(data)
}
export {sqlparse,renderTable}
