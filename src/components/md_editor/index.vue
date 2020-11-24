<template>
  <main class="wk_editor">
    <div v-if="!isPreview" :class="`markdown ${fullscreen ? 'fullscreen' : ''} ${bordered ? 'border' : ''}`" ref="markdown" :style="{ width: width + 'px', height: height + 'px' }">
      <!-- 工具栏组件 -->
      <WTools @command="command"  @on-upload-image="upload" @insert="insert" @attrChange="attrChange" :scrolling="scrolling" :fullscreen="fullscreen" @alertChange="alertChange"></WTools>
      <!-- 关闭预览按钮 -->
      <div
              class="close-preview"
              v-show="preview && !isPreview"
              @click="preview = false"
      >
        <span class="iconfont icon-close"></span>
      </div>
      <!-- 编辑器 -->
      <div
              class="markdown-content"
              :style="{ background: preview ? '#fff' : '' }"
      >
        <!-- codemirror 编辑器 -->
        <div
                class="codemirror"
                ref="editorRef"
                id="edtior"
                v-show="!preview"
                @mouseenter="mousescrollSide('left')"
        ></div>
        <!--  预览效果 -->
        <div
                v-show="editorPreview"
                class="markdown-preview"
                :class="`${'markdown-theme-' + themeName}`"
                ref="previewRef"
                @scroll="previewScroll"
                @mouseenter="mousescrollSide('right')"
        >
          <div v-html="html" ref="previewInner"></div>
        </div>
      </div>
    </div>
    <!-- 设置时isPreview只显示预览-->
    <div v-else
         class="markdown-preview"
         :class="`${'markdown-theme-' + themeName}`"
    >
      <div v-html="html" ref="previewInner"></div>
    </div>

      <!--    预览图片-->
      <a-modal v-model:visible="previewImgModal" :footer="null"  width="100%"  >
          <div class="flex_center">
              <img :src="previewImgSrc" :class="[previewImgMode]" alt=""/>
          </div>

      </a-modal>
  </main>

  <div class="alert_modal">
      <a-modal v-model:visible="sqlShow" title="生成sql文档" @ok="sqlPrase" okText="生成sql" >
          <div class="common_dialog">
              <h4>温馨提示：将数据库创建脚本复制到文本框，自动解析生成文档.</h4>
              <h5>示例sql</h5>
              <pre>
      CREATE TABLE `test` (
        `name` varchar(255) DEFAULT NULL,
        `id` int(11) NOT NULL,
        PRIMARY KEY (`id`),
        KEY `a` (`name`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      </pre>
              <div   class="markdown-content">
                  <div  id="sqlEditor"  class="sql"  ></div>
              </div>
          </div>
      </a-modal>
      <a-modal v-model:visible="tableShow" title="生成表格" @ok="tablePrase" okText="生成表格" width="1200px" >
          <div >
              <div class="table_dialog_item">
                          <span style="margin-right:20px;font-weight: bold">设置单元格数</span>
                          <div class="algin">
                              <strong>对齐方式</strong>
                              <label >
                                  <WIcon name="fa-align-right"></WIcon>
                                  <input type="radio" v-model="algin"  value="right">
                              </label>
                              <label>
                                  <WIcon name="fa-align-center"></WIcon>
                                  <input type="radio" v-model="algin"  value="center">
                              </label>
                              <label >
                                  <WIcon name="fa-align-left"></WIcon>
                                  <input type="radio" v-model="algin"  value="left">
                              </label>
                              <label>
                                  <WIcon name="fa-align-justify"></WIcon>
                                  <input type="radio" v-model="algin" value="default">
                              </label>
                          </div>

                              <span  >行数</span>
                              <a-input v-model:value="row" type="number"  placeholder="请输入行数"  />
                              <span   >列数</span>
                              <a-input v-model:value="col" type="number"  placeholder="请输入列数"  />

                              <a-button type="primary" @click="setData">
                                  创建表格
                              </a-button>
              </div>
              <a-divider />
              <div class="table_dialog_table" v-if="table_header.length>0&&row>0">
                  <h4>设置单元格名称</h4>
                  <div class="table_header">
                      <div v-for="(item,i) in table_header"  class="td">
                          <a-textarea
                                  v-model:value="table_header[i]" size="small"
                          />
                      </div>
                  </div>
                  <div class="max_hight">
                      <h4>设置单元格内容</h4>
                      <div class="table_body_item"  v-for="(item,i) in tableData">
                          <div v-for="(item2,k) in tableData[i]"  class="td">
                              <a-textarea
                                      v-model:value="tableData[i][k]" size="small"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </a-modal>

      <a-modal v-model:visible="codeShow" title="添加代码块" @ok="codePrase" okText="添加代码块" width="800px" >
          <h4 class="editormd-code-toolbar">
              <span style="margin-right:20px">代码语言</span>
              <a-select
                      v-model:value="code_dialog_lang"
                      style="min-width:140px;">
                  <a-select-option :value="item" v-for="item,index in lang_type" :key="index">{{item}}</a-select-option>
              </a-select>
          </h4>
          <div   class="markdown-content" style="height:420px;border-radius:10px;margin-top:30px;position: relative">
              <div  ref="codeEditorRef" id="codeEditor"  class="codemirror"  ></div>
          </div>
      </a-modal>
      <a-modal v-model:visible="linkShow" title="生成超链接" @ok="linkPraseData" okText="添加超链接"  >
          <div   class="href_dialog_item">
              <label>链接地址</label>
              <a-input v-model:value="href_dialog_href" type="text"  placeholder="请输入链接地址"  />
          </div>
          <div   class="href_dialog_item">
              <label>链接标题</label>
              <a-input v-model:value="href_dialog_txt" type="text"  placeholder="请输入链接标题"  />
          </div>
      </a-modal>
  </div>


</template>

<script lang="ts">
    import {handlePaste} from "./fns";

    const defaultln=`
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
\n\n\n\n\n\n\n
    `
  import { message } from 'ant-design-vue';
  import WIcon from  "../icon/index.vue"
  import { defineComponent,onMounted ,ref,reactive,watch,toRefs,computed,nextTick,onUnmounted} from 'vue'
  import {toHtml,sqlparse,renderTable} from './render'
  import WTools from  "./tool.vue";
  import {core} from "../../core/core";
  import "./ioc.ts"
  export default defineComponent({
    name: 'editor',
    props: {
      value: {
        type: [String, Number],
        default: "",
      },
      width: {
        // 初始化宽度
        type: [Number, String],
        default: "auto",
      },
      height: {
        // 初始化高度
        type: Number,
        default: 600,
      },
      theme: {// 默认主题
        type: String,
        default: 'dark'
      },

        copyCode: {// 复制代码
            type: Boolean,
            default: true
        },
        copyBtnText: {// 复制代码按钮文字
            type: String,
            default: '复制代码'
        },
      autoSave: {
        // 是否自动保存
        type: Boolean,
        default: false,
      },
      interval: {
        // 自动保存间隔 mm
        type: Number,
        default: 10000,
      },
      isPreview: {
        //是否是预览模式
        type: Boolean,
        default: false,
      },
    },
    emits:['input','on-ready','on-save','on-upload-image','on-copy'],
    components:{
      WTools, WIcon
    },
    setup(props,ctx){
        //默认数据
      let lang_type=["html", "bash", "css", "c", "cpp", "csharp",  "dart", "delphi", "erlang", "golang", "groovy", "other", "java", "json", "javascript", "lua", "less", "markdown", "objective-c", "php", "perl", "python", "r", "rst", "ruby", "sql", "sass", "shell", "scala", "swift", "vb", "xml", "yaml"]
      let timeId=null
        //定义弹出层
      let alert_data=reactive({
        sqlShow:false,
        tableShow:false,
        codeShow:false,
        linkShow:false,
        previewImgModal:false
      });
      let previewImgSrc=ref('')
      let imgs=ref([])
      //表格数据设置
      let table_attr=reactive({
        algin:"default",
        col:0,
        row:0,
        tableData:[],
        table_header:[]
      });

      let href_attr=reactive({
          href_dialog_href:'https://',
          href_dialog_txt:'',
      });
      let sql=ref('')

      let editor_main_attr=reactive({
          editorScrollHeight:0,
          html:'',
          editorScroll:{},

       });
      let currentValue=ref('')
      let editor_code_attr=reactive({
        code_data:defaultln,
        code_dialog_lang:"html"
      });
      let editor_tools_attr = reactive({
        scrolling:true,
        fullscreen:false,
        scrollSide:"",
        split:true,
        preview:false,
      });

      //ref对象
      let editorRef=ref<HTMLElement>(null)
      let previewRef=ref<HTMLElement>(null)
      let codeEditorRef=ref<HTMLElement>(null)



      onMounted(()=>{
         let editor =core.getInstance("MainEditor",core.container,'default')
             .factory(editorRef.value,editor_main_attr,props.height,ctx,currentValue)
       // editor=factory(editorRef.value,props.height,props.exportFileName)

        ctx.emit('on-ready', {
          vm: editor,
          insertContent:editor.insertContent,
          insertImage:editor.insertImage
        })
          let temp=props.value?props.value:defaultln
          editor.setValue(temp)
          renderHtml(temp)
          document.querySelector('#edtior').addEventListener('paste', (e) => {
              handlePaste(e,ctx)
          })
      })
      function insert($event){
          let editor =core.getInstance("MainEditor",core.container,'default')
          editor.insertContent($event)
      }
      onUnmounted(() => {
        clearInterval(timeId)
      });
        function renderHtml(data){
            toHtml(data).then((data:string)=>{
                data.replace(/href="/gi, 'target="_blank" href="');
                if (props.copyCode && data !== '') {
                    data = data.replace(/<pre>/g, '<div class="code-block"><span class="copy-code">' + props.copyBtnText + '</span><pre>').replace(/<\/pre>/g, '</pre></div>')
                }

                addImageClickListener();
                addCopyListener();
                editor_main_attr.html=data
                ctx.emit('input', {data:data,html:editor_main_attr.html});
            })
        }
      //监听事件
      watch(currentValue,(data,old)=>{
          renderHtml(currentValue.value)
      })
        watch(editor_main_attr,(data)=>{
           markdownScroll()
        })
      watch(props.value, (value) => {
          let editor =core.getInstance("MainEditor",core.container,'default')
          editor.setValue(value)
      });
      function  command($event){
          let editor =core.getInstance("MainEditor",core.container,'default')
          editor[$event.action]($event.level)
      }
      const editorPreview = computed(() => {
        return editor_tools_attr.preview ?  editor_tools_attr.preview : editor_tools_attr.split;
      });


      function mousescrollSide(side:string) {// 设置究竟是哪个半边在主动滑动
          editor_tools_attr.scrollSide = side;
      }

      const previewScroll = () => {
          let editor =core.getInstance("MainEditor",core.container,'default')
        if (editor_tools_attr.scrolling && editor_tools_attr.scrollSide === 'right') {
          const preview =previewRef.value;
          if(!preview){
            return
          }
          const contentHeight = preview.offsetHeight;
          const previewScrollHeight = preview.scrollHeight;
          const previewScrollTop = preview.scrollTop;
          const scrollTop = parseInt((previewScrollTop * (editor_main_attr.editorScrollHeight - contentHeight)) / (previewScrollHeight - contentHeight), 0);
            editor.editor.scrollTo(0, scrollTop);
        }
      };

      const markdownScroll = () => {
        //编辑器区域滚动
        if ( editor_tools_attr.scrolling && editor_tools_attr.scrollSide =="left") {
          const { height, scrollTop } =editor_main_attr.editorScroll ;
          const preview = previewRef.value;
          const contentHeight = preview.offsetHeight;
          const previewScrollHeight = preview.scrollHeight;
          if (preview) {
            preview.scrollTop = parseInt(
                    (scrollTop * (previewScrollHeight - contentHeight)) / (height - contentHeight),
                    0,
            );
          }
        }
      };


      function  upload($event) {
        ctx.emit("on-upload-image", $event);
      }

      function attrChange($event){
          changeData($event.atrr,$event.value)
      }
      let codeEditor;
      let sqlEditor
      function alertChange($event){
          let editor =core.getInstance("CodeEditor",core.container,'default')
          let sEditor =core.getInstance("SqlEditor",core.container,'default')
          let MainEditor =core.getInstance("MainEditor",core.container,'default')
          alert_data[$event.atrr]=$event.value
          let selectdata=MainEditor.getSelection()
          if(!selectdata){
              selectdata=defaultln
          }
          if($event.atrr=='codeShow'){
               nextTick(()=>{
                   if(!codeEditor){
                       codeEditor=editor.factory(codeEditorRef.value,editor_code_attr,450)
                   }
                   codeEditor.setValue(selectdata)
               })
          }
          if($event.atrr=='sqlShow'){
              nextTick(()=>{
                  if(!sqlEditor){
                      sqlEditor=sEditor.factory('sqlEditor',sql,450)
                  }
                  sqlEditor.setValue(selectdata)
              })
          }

          if($event.atrr=='linkShow'){
              href_attr.href_dialog_txt=selectdata;
          }
      }
      setTimeout(() => {
        if (props.autoSave) { //如果配置了autoSave则定时保存
          timeId = setInterval(() => {
              ctx.emit("on-save",{rawvalue:editor_main_attr.currentValue,html:editor_main_attr.html})
          }, props.interval);
        }
      }, 20);
      const changeData=(key:string,value)=>{

          editor_tools_attr[key]=value;
        if(key=="split"&&value==true){
          nextTick(()=>{
            if( previewRef.value)
              previewRef.value.innerHTML = editor_main_attr.html;
          })

        }
      }
      function sqlPrase() {
          let data=''
          try {
              data=sqlparse(sql.value)
          }catch (e) {
              message.error('您填写的sql不正确');
              return
          }

          if(data[0]&&data[1].length>0){
              let table_header=['字段名','类型','NULL','默认值','注释','索引']
              insert('\n### 表名:'+data[0]+'\n');
              insert(renderTable(table_header,data[1],"default"))
          }else{
              message.error('sql数据不对');
              return false
          }
          alert_data['sqlShow']=false;
          sql_attr.sql=''
      }
      function  initTable() {
          table_attr.table_header=[]
          table_attr.tableData=[]
      }
      watch(editor_code_attr,(data)=>{
          core.getInstance("CodeEditor",core.container,'default').editor.session.setMode("ace/mode/"+data.code_dialog_lang);
      })
      function setData() {

          initTable()
          let temp_arr=[]
          for(let i =0;i<table_attr.row;i++){
              temp_arr[i]= temp_arr[i]||[];
              temp_arr[i].length=table_attr.col
              for(let j =0;j<table_attr.col;j++){
                  temp_arr[i][j]=temp_arr[i][j]||''
              }
          }

          for (let i=0;i<table_attr.col;i++){
              table_attr.table_header.push("")
          }
          table_attr.tableData=temp_arr
      }
      function tablePrase() {
          if(table_attr.col>0&&table_attr.row>0){
              insert(renderTable(table_attr.table_header,table_attr.tableData,table_attr.algin))
              initTable()
              table_attr.col=0
              table_attr.row=0
          }
          alert_data.tableShow=false
      }
      function codePrase() {
          let editor =core.getInstance("CodeEditor",core.container,'default')
          let lang=''
          if(editor_code_attr.code_data){
              if( editor_code_attr.code_dialog_lang=='other'){
                  lang=''
              }else{
                  lang=editor_code_attr.code_dialog_lang
              }
              insert('\n```'+lang+'\n' + editor_code_attr.code_data + '\n```\n'); //插入代码内容
          }
          editor.setValue('')
          alert_data.codeShow=false
      }
      function linkPraseData() {
          if(href_attr.href_dialog_txt==''||href_attr.href_dialog_href==''){
              return;
          }
          insert('\n['+href_attr.href_dialog_txt+']('+href_attr.href_dialog_href+')'); //插入代码内容
          alert_data.linkShow=false
          href_attr.href_dialog_txt=''  //重置数据
          href_attr.href_dialog_href='https://'
      }

       function previewImage(src) {// 预览图片
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                if (height / width > 1.4) {
                    alert_data.previewImgModal = 'horizontal';
                } else {
                    alert_data.previewImgModal = 'vertical';
                }
                previewImgSrc.value = src;
                alert_data.previewImgModal = true;
            };
        }
        function addCopyListener() {// 监听复制操作
            nextTick(() => {
                const btns = document.querySelectorAll(
                    '.code-block .copy-code'
                );
                for (let i = 0, len = btns.length; i < len; i++) {
                    btns[i].onclick = () => {
                        const code = btns[i].parentNode.querySelectorAll('pre')[0].innerText;
                        const aux = document.createElement('input');
                        aux.setAttribute('value', code);
                        document.body.appendChild(aux);
                        aux.select();
                        document.execCommand('copy');
                        document.body.removeChild(aux);
                        ctx.emit('on-copy', code);
                    };
                }
            })
        }
        function  addImageClickListener() {// 监听查看大图

            if (  imgs.value.length > 0) {
                for (let i = 0, len = imgs.length; i < len; i++) {
                    imgs.value[i].onclick = null;
                }
            }
            setTimeout(() => {
                imgs.value =previewRef.value.querySelectorAll('img');
                for (let i = 0, len = imgs.value.length; i < len; i++) {
                    imgs.value[i].onclick = () => {
                        const src =  imgs.value[i].getAttribute('src');
                        previewImage(src);
                    };
                }
            }, 600);
        }

      return {
       //属性
          lang_type,
          sql,
          ...toRefs(alert_data),
          ...toRefs(table_attr),
          ...toRefs(href_attr),
          ...toRefs(editor_main_attr),
          ...toRefs(editor_code_attr),
          ...toRefs(editor_tools_attr),
          editorRef,
          previewRef,
          codeEditorRef,
          previewImgSrc,
          currentValue,
       //函数
          previewImage,
          insert,
          codePrase,
          linkPraseData,
          tablePrase,
          setData,
          sqlPrase,
          changeData,
          alertChange,
          attrChange,
          upload,
          markdownScroll,
          previewScroll,
          mousescrollSide,
          command,
          editorPreview
      }
    }
  })
</script>
<style>
</style>
