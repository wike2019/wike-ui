<template>
    <ul class="markdown-toolbars">
        <li class="tools_title">WK编辑器</li>
        <li  :name="item.tip" v-for="item in data" >
            <WIcon  :name="item.name"  class="iconfont" @click="()=>command({action:item.action})"></WIcon>
        </li>
        <li  :name="item.tip" v-for="item in title" >
            <i style="font-size: 16px;" @click="()=>command({action:item.action,level:item.level})" >{{item.name}}</i>
        </li>
        <li  :name="item.tip" v-for="item in other" >
            <WIcon  :name="item.name"  class="iconfont" @click="()=>command({action:item.action})"></WIcon>
        </li>
        <li  name="本地图片" >
            <WIcon  name="fa-file-image-o"  class="iconfont" @click="chooseImage"></WIcon>
        </li>
        <li  :name="item.tip" v-for="item in alertdata" >
            <WIcon  :name="item.name"  class="iconfont" @click="()=>alertShow({atrr:item.attr,value:item.value})"></WIcon>
        </li>
        <li  :name="item.tip" v-for="item in attr" >
            <WIcon  :name="item.name"  class="iconfont" @click="()=>attrChange({atrr:item.attr,value:item.value})"></WIcon>
        </li>
        <li  name="导入MD文件"  >
            <WIcon  name="fa-file-text-o"  class="iconfont" @click="selectFileMd"></WIcon>
            <input
                     v-show="false"
                    type="file"
                     ref="mdInputRef"
                    @change="importMd($event)"
                    accept="text/markdown"
            />
        </li>
        <li  name="导入word" >
            <WIcon  name="fa-file-word-o"  class="iconfont" @click="onSupport"></WIcon>
            <input
                    v-show="false"
                    type="file"
            />
        </li>
        <li  name="解析html" >
            <WIcon  name="fa-html5"  class="iconfont" @click="onSupport"></WIcon>
        </li>

        <li :name='scollTip'>
            <WIcon name="fa-toggle-on" v-if="scrolling" class="iconfont"   @click="()=>attrChange({atrr:'scrolling',value:false})" ></WIcon>
            <WIcon name="fa-toggle-off" v-else class="iconfont"  @click="()=>attrChange({atrr:'scrolling',value:true})"></WIcon>
        </li>
        <li   class="download">
            <WIcon name="fa-download" class="iconfont"></WIcon>
            <ul class="hover_show">
                <li @click="()=>command({action:'exportFile'})" >
                    <WIcon name="fa-file-o" class="iconfont" style="display:inline;margin-right:10px"></WIcon>
                    导出 Markdown
                </li>
                <li  @click="onSupport">
                    <WIcon name="fa-file-pdf-o" class="iconfont" style="display:inline;margin-right:10px"></WIcon>
                    导出 pdf
                </li>
            </ul>
        </li>
        <li class="empty"></li>
        <li  name="退出全屏" v-if="fullscreen">
            <WIcon name="fa-window-close-o" class="iconfont"  @click="()=>attrChange({atrr:'fullscreen',value:false})"></WIcon>
        </li>
        <li  name="全屏" v-else>
            <WIcon name="fa-arrows-alt" class="iconfont"  @click="()=>attrChange({atrr:'fullscreen',value:true})"> </WIcon>
        </li>
    </ul>
</template>

<script lang="ts">
    import { message } from 'ant-design-vue';
    import WIcon from  "../icon/index.vue"
    import { defineComponent,onMounted ,ref,toRefs,computed} from 'vue'
    import {data,title,other,alertdata,attr} from "./config"
    export default defineComponent({
        name: 'editor_tools',
        components:{
            WIcon
        },
        props:['scrolling','fullscreen'],
        emits:['on-upload-image','insert','command','attrChange','alertChange'],
        setup(props,ctx){

            let  mdInputRef= ref(null)
            let scollTip=computed(()=>{
                return props.scrolling ? "同步滚动:开" : "同步滚动:关"
            })
            function importMd(e) {// 导入本地文件
                const file = e.target.files[0];
                if (!file) {
                    return;
                }
                if(!/^md$/ig.test(file.name.split(".").pop())){
                    message.error("文件格式不对")
                    return;
                }
                const reader = new FileReader();
                reader.readAsText(file, {
                    encoding: "utf-8"
                });
                reader.onload = () => {
                    e.target.value = "";
                    ctx.emit('insert',(reader.result));
                };
                reader.onerror = err => {
                    console.error(err);
                }
            }
            function onSupport() {
                message.error("内部功能,暂不对外开发")
            }
            function selectFileMd() {
                mdInputRef.value.click()
            }
            function command($event) {
                    ctx.emit('command',$event)
            }
            function chooseImage() {// 选择图片
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = ()=>{
                    const files = input.files;
                    if(files[0]){
                        ctx.emit('on-upload-image', files[0]);
                        input.value = '';
                    }
                }
                input.click();
            }
            function attrChange($event) {
                ctx.emit('attrChange',$event)
            }
            function  alertShow($event) {

                    ctx.emit('alertChange',$event)

            }

            return {data,alertdata,title,other,attr,alert,alertShow,attrChange,chooseImage,scollTip,importMd,onSupport,selectFileMd,mdInputRef,command,...toRefs(props)}
        }
    })
</script>
<style>

</style>
