<template>
    <wike_md
            @input="getDate"
            @on-ready="onReady"
            @on-upload-image="onUpladImage"
            @on-save="onSave"
            :height="800"
            :value="defaultHtml"
    ></wike_md>


    <div class="otherinfo">
        <div  class="quick-links">
            <p  class="ad">
                <strong >基于vue3的新一代markdown文本编辑器</strong>
                <br > 架构清晰,合理易于扩展</p>
            <a  class="ui-btn ui-btn-success ui-btn-lg"  target="_blank" href="">开 始</a>
            <a class="ui-btn ui-btn-dark ui-btn-lg"  target="_blank" href="">文档中心</a>
        </div>
        <div  class="advantage">
            <div  class="ui-container">
                <h3 >wk-markdown 的特点</h3>
                <div  class="ui-row">
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-etsy"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >简单易用</h4>
                            <p >使用简单，克隆项目，按照依赖，即可使用，不需要繁琐的初始化配置。</p>
                        </div>
                    </div>
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-code"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >代码高亮</h4>
                            <p >编辑集成了强大的codemirror,支持多种语法高亮,实时预览</p>
                        </div>
                    </div>
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-cog"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >易于扩展</h4>
                            <p >方便扩展，根据实际需求，支持常见的功能配置，也可根据实际需求进行深度定制</p>
                        </div>
                    </div>
                </div>
                <div  class="ui-row">
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-file"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >支持导入导出</h4>
                            <p >支持markdown文件导出导入,未来会支持更多文件类型</p>
                        </div>
                    </div>
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-rocket"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >更简短的输出结果</h4>
                            <p >可输出最简短的 HTML，这意味着更快的下载速度，更小的储存空间，更少的带宽</p>
                        </div>
                    </div>
                    <div  class="ui-col-sm-8">
                        <div  class="icon">
                            <wicon name="fa-chrome"></wicon>
                        </div>
                        <div  class="desc">
                            <h4 >更新的架构思路</h4>
                            <p >加入了强大的IOC容器机制,让核心层与视图解耦</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>


<script>
    import wicon from  "../components/icon/index.vue"
    import wike_md from '../components/md_editor/index.vue'
    import { defineComponent} from 'vue'
    import {defaultHtml} from '../components/md_editor/defaulthtml'
    export default defineComponent({
        name: 'markdown',
        components:{
            wike_md,
            wicon
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
              return {onReady,onSave,onUpladImage,defaultHtml}
          }
    })
</script>
