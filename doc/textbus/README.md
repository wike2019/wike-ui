#### 富文本编辑器使用方式

```vue

<template>

 <TextBus   @input="okdata" :config="config" :value="defaultHtml"/>

</template>

<script lang="ts">
 import TextBus from "../components/TextBus/index.vue"
 import { Observable } from 'rxjs';
 import { ref,defineComponent} from 'vue'
 export default defineComponent({
  name: 'TextBusView',
  components: {
   TextBus,
  },
  setup(){
   let defaultHtml='默认内容'
   let data=ref(defaultHtml)

   const  submit=()=>{
    console.log(data.value)
   }

   function   okdata($event) {
    data.value=$event
   }
  
    //编辑器配置项
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


```
