import {Container, inject, injectable, interfaces, named} from "inversify";
import mitt from 'mitt'
import {DWorker} from "./work";
import "reflect-metadata"
import {Base} from "./base";
import {Annotation} from "./Annotation";
import {cache} from "./cache";


const container=new Container();
const bus = mitt()
function getInstance<T>(className:string,container:interfaces,tagName:string){
    return container.getNamed<T>(className,tagName)

}


let core={
    Base,
    getInstance,
    container,
    Container,
    bus,
    Annotation,
    DWorker,
    injectable,
    inject,
    mitt,
    cache,
    named
}


export {core}