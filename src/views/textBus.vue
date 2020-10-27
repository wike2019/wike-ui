<template>

 <TextBus   @input="okdata" :config="config" :value="defaultHtml"/>
 <div class="otherinfo">
  <div  class="quick-links">
   <p  class="ad">
    <strong >基于组件的下一代富文本编辑器</strong>
    <br > 相信我，没有比这更好的了！ </p>
   <a  class="ui-btn ui-btn-success ui-btn-lg"  target="_blank" href="https://textbus.tanboui.com/doc/start">开 始</a>
   <a class="ui-btn ui-btn-dark ui-btn-lg"  target="_blank" href="https://textbus.tanboui.com/doc/start">文档中心</a>
  </div>
  <div  class="advantage">
   <div  class="ui-container">
    <h3 >TextBus 的特点</h3>
    <div  class="ui-row">
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-database"></wicon>
      </div>
      <div  class="desc">
       <h4 >抽象数据模型</h4>
       <p >高度抽象的 Component，可轻松创建各种酷炫的效果，定制属于你自己的富文本编辑器</p>
      </div>
     </div>
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-code"></wicon>
      </div>
      <div  class="desc">
       <h4 >代码高亮</h4>
       <p >当 Markdown，不能满足排版需求时，富文本里写代码，一样可以支持高亮，程序员写文档的实用利器</p>
      </div>
     </div>
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-cog"></wicon>
      </div>
      <div  class="desc">
       <h4 >易扩展</h4>
       <p >基于 Typescript，面向接口操作数据结构，无需关心底层实现，扩展功能不再是难题</p>
      </div>
     </div>
    </div>
    <div  class="ui-row">
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-table"></wicon>
      </div>
      <div  class="desc">
       <h4 >流畅的表格操作</h4>
       <p >支持框选操作表格，方便的批量编辑单元格，让富文本有类似 excel 般的体验</p>
      </div>
     </div>
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-rocket"></wicon>
      </div>
      <div  class="desc">
       <h4 >更简短的输出结果</h4>
       <p >高效的优化算法，可输出最简短的 HTML，这意味着更快的下载速度，更小的储存空间，更少的带宽</p>
      </div>
     </div>
     <div  class="ui-col-sm-8">
      <div  class="icon">
       <wicon name="fa-chrome"></wicon>
      </div>
      <div  class="desc">
       <h4 >多种主题</h4>
       <p >简洁的多种主题，更容易适配不同类型的网站</p>
      </div>
     </div>
    </div>
   </div>
 </div>

 </div>

</template>

<script lang="ts">
 import TextBus from "../components/TextBus/index.vue"
 import {defaultHtml} from '../components/TextBus/defaulthtml'
 import { Observable } from 'rxjs';
 import wicon from  "../components/icon/index.vue"
 import {ref} from "vue"
 import { defineComponent} from 'vue'
 export default defineComponent({
  name: 'TextBusView',
  components: {
   TextBus,
   wicon
  },
  setup(){
   let data=ref(defaultHtml)

   const  submit=()=>{
    console.log(data.value)
   }

   function   okdata($event) {
    data.value=($event)
   }
   let config={
    uploader(type: string): string | Promise<string> | Observable<string> {
     switch (type) {
      case 'image':
       const fileInput = document.createElement('input');
       fileInput.setAttribute('type', 'file');
       fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
       fileInput.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0';
       const promise =  new Promise<string>(resolve => {
        fileInput.addEventListener('change', event => {
         const form = new FormData();
         for (const file of event.target.files) {
          form.append('file', file);
         }
         document.body.removeChild(fileInput);
         resolve("https://textbus.tanboui.com/static/img/qq-group.20ce5d73933bb31ff50cbf15cf9e7950.jpg");

        })
       })
       document.body.appendChild(fileInput);
       fileInput.click();
       return promise;
             // case 'video':
             //   console.log('上传视频');
             //   break;
             // case 'audio':
             //   console.log('上传音频');
             //   break;
     }
    }
   }
   return {submit,data,okdata,defaultHtml,config}
  }
 })
</script>
