



## Markdown编辑器简介
一款使用marked和highlight.js,codemirror,inversify,vue3,font-awesome,ant-design-vue开发的markdown编辑器，除常见markdown语法外，支持快捷输入、图片粘贴、全屏编辑、预览等功能。

使用起来简单方便，只需几行代码，即可在你的页面上引入一个markdown编辑器,完全适配vue3，支持语法高亮。同时项目完全基于ddd的开发思想，解构了视图层和领域层。

编辑器涵盖了常用的markdown编辑器功能,也可根据需求进行深度定制。易于扩展，代码层次分明，更换视图层对核心领域层没有影响，但还有很多值得改进的地方，这个是我在前端ddd领域驱动开发的一种尝试，追求更好的架构一直是我的目标。希望大家多和我交流。本人邮箱 200569525@qq.com，欢迎提建议。

## TextBus富文本编辑器简介
TextBus 采用 MVC 设计，将 DOM 数据转换为抽象的 Fragment 对象，并通过自实现 Selection，隔离了浏览器的 Selection 及 Range 对象，使后续功能开发，再也不用关心不同浏览器的差异，整体设计架构如下：


![image](https://csdn.52wike.com/2020-10-27/e47ba8ae-72fa-419d-a039-498c54a6e6f2.png)
TextBus 设计之初就充分考虑了可定制性与扩展性，为了践行这一设计，TextBus 核心模块只有组织与调度的能力，其它所有的功能都是只是遵循扩展接口的外部函数或类，也就是说，没有这些外部函数或类，TextBus 核心模块就只剩一个空的骨架，完成不了任何事情。

## 示例


![image](https://csdn.52wike.com/2020-10-27/e011b125-2fc5-4e72-aa4d-5248ee54623c.png)

![image](https://csdn.52wike.com/2020-10-27/4f5bb267-8b71-45a8-bf28-5288212af706.png)



----

## 	Markdown编辑器说明

### 特点
- 使用简单，克隆项目，按照依赖，即可使用，不需要繁琐的初始化配置。
- 方便扩展，根据实际需求，支持常见的功能配置，也可根据实际需求进行深度定制。
- 项目解藕程度高，更换组件不影响项目核心业务。
- 体积小，加载速度快，为了追求性能，highlight配置高亮的语言不多，可以根据自己需要引入更多语法高亮
- 功能强大，支持专业版的编辑器，使用codemirror实现编辑窗口，可识别markdown语法
- 键盘事件监听，如保存、粘贴、回车时上次输入语法判断等
- 可扩展性强，除了提供的属性配置编辑器，也可直接在原有组件基础上进行二次开发

### 实现思路

通过监听文本输入区域内内容的变化，实时将输入的markdown语法进行编译，并渲染到预览区域。

编辑器大致分为头部菜单栏、左侧内容输入区域、右侧预览区域，弹窗四个部分。

弹窗组件用了 饿了么ui 因为我的美工能力比较差所以使用了现成的ui框架。

头部菜单主要为定自定义标题区域和菜单按钮，左侧编辑区域，

使用专业版的codemirror编辑器实现，编辑区域支持手动输入文本和通过头部菜单插入；右侧预览区域可实时预览输入文本，并可通过菜单按钮，进行编辑区域和预览区域的切换。

## 项目安装方式

因为使用的vite，不能打包成第三方库，我也研究了很久，因为vue3倡导es6的模块化，vite打包后会成为一个es6moudle，所以建议git clone 项目在本项目基础上构建你的web应用。

### 将组件复制到项目内
1. 将git仓库代码拉到本地

```
git clone https://github.com/wike2019/wike-ui
```

2. 复制src文件夹下内容到你的项目中


3. 把pulic目录资源复制到你的项目中


## 在项目使用


#### 在页面内使用

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

## API

### 编辑器基本属性

#### value
- Type: `String/Number`
- Default: `''`

编辑器输入的文本，支持通过`v-model`数据双向绑定设置编辑器内容和获取编辑器的值。

#### width
- Type: `String/Number`
- Default: `auto`

编辑器的初始化宽度。

#### height
- Type: `Number`
- Default: `600`

编辑器的初始化高度。


#### autoSave
- Type: `Boolean`
- Default: `false`

是否开启自动保存，设置为开启时可通过绑定`on-save`事件获取编辑器内的文本内容和渲染过后的html字符串。

```vue
<wike_md @on-save="onSave"/>
```



#### interval
- Type: `Number`
- Default: `10000`

自动保存间隔时间，单位：`mm`，默认10000mm，需要`autoSave = true`时才有效。



#### isPreview
- Type: `Boolean`
- Default: `false`

是否是预览模式，开启时可作为一个预览组件使用，与预览组件功能一致。





## 相关事件

#### on-ready

编辑器初始化完成时触发，返回值为Object，包含编辑器实例vm和insertContent,insertImage方法。

#### on-save
编辑器保存事件，自动保存或者手动保存时触发，支持`ctrl+s`或`command+s`触发保存，返回值类型为`Object`，为md编辑器的内容和为md内容解析成的html。


#### on-upload-image

监听编辑器粘贴图片事件，在编辑区域内手动粘贴图片时触发，可用于支持粘贴插入图片文件，返回`file`文件，上传文件后可结合`on-ready`事件内返回的`insertImage`插入图片。




## 代码体积优化



### highlight.js体积优化

highlight.js原本体积也是较大的，主要原因为，编译时为支持各种代码语言，引入了相应的解析文件，
项目内已根据常见的代码语言进行了一次筛选，进行按需引入，可根据自身需求，再次对引用文件进行删减


```js
//文件路径 src/assets/hightlight
//hljs体积过大，多数为解决代码高亮显示的问题,所以只引入部分语言，如果需要可自行加载

import hljs from './highlight'

import javascript from './languages/javascript'
import java from './languages/java';
import css from './languages/css';
import less from './languages/less';
import go from './languages/go';
import markdown from './languages/markdown';
import php from './languages/php';
import typescript from './languages/typescript';
import xml from './languages/xml';
import autohotkey from './languages/autohotkey';
import bash from './languages/bash';
import stylus from './languages/stylus';
import scss from './languages/scss';
import shell from './languages/shell';
//可以引入更多的语言
export const languages = {
     shell,
     scss,
     bash,
     stylus,
     javascript,
     java,
     css,
     less,
     markdown,
     go,
     php,
    typescript,
    xml,
    autohotkey,

 }

Object.keys(languages).forEach(key => {
    hljs.registerLanguage(key, languages[key])
})

export default hljs;
```

## 	TextBus编辑器说明


###  使用方式


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

## 问题反馈

对于功能上的缺陷、使用方法和希望扩展的功能，可以提 [Issues](https://github.com/wike2019/wike-ui/issues/new) QQ:200569525@qq.com

##  license: `MIT`


