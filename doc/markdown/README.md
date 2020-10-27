#### 在页面内使用

```vue
#### 在页面内使用

​```vue
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
​```


```
