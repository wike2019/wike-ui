## mardown编辑器使用方式
```vue
<template>
	<wike_md
            @input="getDate"
            @on-ready="onReady"
            @on-upload-image="onUpladImage"
            @on-save="onSave"
            :height="800"
    ></wike_md>
</template>
<script>
    import wike_md from '../components/md_editor/index.vue'
    import { defineComponent} from 'vue'
  
   default defineComponent({
      name: 'markdown',
      components:{
			wike_md
      },
      setup(){
          function onReady({vm,insertContent,insertImage}) {
            // vm 编辑实例
            // insertContent 给用户的底层方法,可以往编辑器里插入内容
            // insertImage 插入图片到编辑器中

            // 请根据需要保持这3个值
          }
          function onUpladImage(file) {
              let formData = new FormData()
              //file就是后台接收的key
              formData.append('file', file, file.name)
              //将formdata发送到后台即可
              //axios.post('服务器地址', formData).then((data) => {
              //     console.log(data)
              //     //取得图片地址插入到编辑器里
              //     insertImage(data.data.url);
              // })
          }
          function onSave({value,html}) {
              //value 为md编辑器的内容
              //html 为md内容解析成的html
          }
 		  function getDate($event) {
              //$event.data 为md编辑器的内容
  			  //$event.html 为md内容解析成的html
          }
  
          return {onReady,onSave,onUpladImage,getDate}
      }
  })
    }
</script>
```
## 富文本编辑器使用方式


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
