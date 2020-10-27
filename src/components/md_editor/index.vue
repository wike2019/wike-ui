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
                id="edit"
                v-show="!preview"
                @mouseenter="mousescrollSide('left')"
        ></div>
        <!--  预览效果 -->
        <div
                v-show="editorPreview"
                class="markdown-preview markdown-theme-dark"
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
         class="markdown-preview markdown-theme-dark"
    >
      <div v-html="html" ref="previewInner"></div>
    </div>
  </main>



  <div>
      <a-modal v-model:visible="sqlShow" title="生成sql文档" @ok="sqlPrase" okText="生成sql" :zIndex="9999998">
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
                  <a-textarea
                          v-model:value="sql"
                          placeholder="请输sql语句"
                          allow-clear
                          :autoSize="true"
                  />
              </div>
          </div>
      </a-modal>
      <a-modal v-model:visible="tableShow" title="生成表格" @ok="tablePrase" okText="生成表格" width="1200px" :zIndex="9999998">
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

      <a-modal v-model:visible="codeShow" title="添加代码块" @ok="codePrase" okText="添加代码块" width="800px" :zIndex="9999998">
          <h4 class="editormd-code-toolbar">
              <span style="margin-right:20px">代码语言</span>
              <a-select
                      v-model:value="code_dialog_lang"
                      style="min-width:140px;">
                  <a-select-option :value="item" v-for="item,index in lang_type" :key="index">{{item}}</a-select-option>
              </a-select>

          </h4>

          <div   class="markdown-content">
              <div  ref="codeEditorRef"  class="codemirror" style="height:420px;border-radius:10px" ></div>
          </div>
      </a-modal>

      <a-modal v-model:visible="linkShow" title="生成超链接" @ok="linkPrase" okText="添加超链接" :zIndex="9999998" >
          <div   class="href_dialog_item">
              <label>链接地址</label>
              <a-input v-model:value="href_dialog_href" type="text"  placeholder="请输入链接地址"  />
          </div>
          <div   class="href_dialog_item">
              <label>链接标题</label>
              <a-input v-model:value="href_dialog_txt" type="text"  placeholder="请输入链接标题"  />
          </div>
      </a-modal>

      <div>


      </div>
  </div>


</template>

<script lang="ts">
  import WIcon from  "../icon/index.vue"
  import { defineComponent,onMounted ,ref,reactive,watch,toRefs,computed,nextTick,onUnmounted} from 'vue'
  import {editorCommit,insertContent,listener,factory,scrollTo,setEditorValue,editorEvent,doEnter,del,insertImage,factorySimper,factorySimperlistener} from './editor/interface/index'
  import {toHtml,sqlparse,renderTable} from './render/interface/index'
  import WTools from  "./tool.vue";
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
    emits:['input','on-ready','on-save','on-upload-image'],
    components:{
      WTools, WIcon
    },
    setup(props,ctx){


      let alertdata=reactive({
        sqlShow:false,
        tableShow:false,
        codeShow:false,
        linkShow:false
      });
      let sql=ref('')
      let algin=ref("default")
      let col=ref(0)
      let row=ref(0)
      let editor=reactive({})
      let editorRef=ref<HTMLElement>(null)
      let previewRef=ref<HTMLElement>(null)
      let codeEditorRef=ref<HTMLElement>(null)
      let currentValue=ref("")
      let href_dialog_href=ref('http://')
      let href_dialog_txt=ref('')
      let lastdata=ref({line:0,ch:0})
      let editorScrollHeight=ref(null)
      let html=ref("")
      let codeData=ref('')
      let timeId:any=null
      let code_dialog_lang=ref('other')
      let lang_type=["other", "bash", "css", "c", "cpp", "csharp",  "dart", "delphi", "erlang", "go", "groovy", "html", "java", "json", "javascript", "lua", "less", "markdown", "objective-c", "php", "perl", "python", "r", "rst", "ruby", "sql", "sass", "shell", "scala", "swift", "vb", "xml", "yaml"]
      let data = reactive({
        scrolling:true,
        fullscreen:false,
        scrollSide:"",
        split:true,
        preview:false,
      });
      let codeEditor=null;
      let tableData = ref([])
      let table_header=ref([])
      onMounted(()=>{
        editor=factory(editorRef.value,props.height,props.exportFileName)

        ctx.emit('on-ready', {
          vm: editor,
          insertContent:(str:string)=>{
            insertContent(str,editor,lastdata)
          },
          insertImage:(str:string)=>{
            insertImage(str,editor)
          }
        })
        setEditorValue(props.value,editor)
        listener(lastdata,currentValue,editorScrollHeight)
      })
      function insert($event){
        insertContent($event,editor,lastdata)
      }
      onUnmounted(() => {
        clearInterval(timeId)
      });
      watch(currentValue,(data)=>{
        html.value=toHtml(data)
        ctx.emit('input', {data,html:html.value});
      })
      watch(props.value, (value) => {
        setEditorValue(value,editor)
      });
      function  command($event){
       editorCommit($event.action,editor,lastdata,$event.level)
      }
      const editorPreview = computed(() => {
        return data.preview ?  data.preview : data.split;
      });


      function mousescrollSide(side:string) {// 设置究竟是哪个半边在主动滑动
        data.scrollSide = side;
      }

      const previewScroll = () => {
        if (data.scrolling && data.scrollSide === 'right') {
          const preview =previewRef.value;
          if(!preview){
            return
          }
          const contentHeight = preview.offsetHeight;
          const previewScrollHeight = preview.scrollHeight;
          const previewScrollTop = preview.scrollTop;
          const scrollTop = parseInt((previewScrollTop * (editorScrollHeight.value - contentHeight)) / (previewScrollHeight - contentHeight), 0);
          scrollTo(scrollTop,editor)
        }
      };

      const markdownScroll = (data = {}) => {
        //编辑器区域滚动
        if ( data.scrolling && data.scrollSide === "left") {
          const {
            doc: { height, scrollTop },
          } = data;
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
      const handleSave = () => {
        ctx.emit("on-save", currentValue.value,html.value);
      };
      const handlePaste = (_, e) => {
        const { clipboardData = {} } = e;
        const { types = [], items } = clipboardData;
        let item = null;
        for (let i = 0; i < types.length; i++) {
          if (types[i] === "Files") {
            item = items[i];
            break;
          }
        }
        if (item) {
          const file = item.getAsFile();

          if (/image/gi.test(file.type)) {
            ctx.emit("on-upload-image", file);
            e.preventDefault();
          }
        }
      };
      function  upload($event) {
        ctx.emit("on-upload-image", $event);
      }

      const listerenDelete = () => {
        nextTick(() => { //删除lastInsert的值
          del(editor, lastdata)
        });
      };
      const listerenEnter= () => {
        nextTick(() => { //删除lastInsert的值
          doEnter(editor, lastdata)
        });
      };
      editorEvent.on('scolll',markdownScroll)
      editorEvent.on('paste',({data,e})=>{handlePaste(data, e)})
      editorEvent.on('save',handleSave)
      editorEvent.on('enter',listerenEnter)
      editorEvent.on('delete',listerenDelete)

      function attrChange($event){
          data[$event.atrr]=$event.value
      }
      function alertChange($event){
          alertdata[$event.atrr]=$event.value
          let selectdata=editor.getSelection()
          if($event.atrr=='codeShow'){
               nextTick(()=>{
                   if(!codeEditor){
                       codeEditor=factorySimper(codeEditorRef.value)

                       factorySimperlistener(codeData)
                   }
                   codeEditor.setValue(selectdata)

               })

          }
          if($event.atrr=='linkShow'){
              href_dialog_txt.value=selectdata;
          }
      }
      setTimeout(() => {
        if (props.autoSave) { //如果配置了autoSave则定时保存
          timeId = setInterval(() => {
            handleSave();
          }, props.interval);
        }
      }, 20);
      const changeData=(key:string,value)=>{

        data[key]=value;
        if(key=="split"&&value==true){
          nextTick(()=>{
            if( previewRef.value)
              previewRef.value.innerHTML = html.value;
          })

        }
      }
      function sqlPrase() {
          let data=sqlparse(sql.value)
          if(data[0]&&data[1].length>0){
              let table_header=['字段名','类型','NULL','默认值','注释','索引']
              insertContent('\n### 表名:'+data[0]+'\n',editor,lastdata);
              insertContent(renderTable(table_header,data[1],"default"),editor,lastdata)
          }else{
              alert('sql数据不对')
              return false
          }
          alertdata['sqlShow']=false;
            sql.value=''
      }
      function  initTable() {
          table_header.value=[]
          tableData.value=[]
      }
      function setData() {

          initTable()
          let temparr=[]
          for(let i =0;i<row.value;i++){
              temparr[i]= temparr[i]||[];
              temparr[i].length=col.value
              for(let j =0;j<col.value;j++){
                  temparr[i][j]=temparr[i][j]||''
              }
          }

          for (let i=0;i<col.value;i++){
              table_header.value.push("")
          }
          tableData.value=temparr

      }
      function tablePrase() {
          if(col.value>0&&row.value>0){
              insertContent(renderTable(table_header.value,tableData.value,algin.value),editor,lastdata)
              initTable()
              col.value=0
              row.value=0
          }
          alertdata.tableShow=false
      }
      function codePrase() {
          let lang=''
          if(codeData.value){
              if( code_dialog_lang.value=='other'){
                  lang=''
              }else{
                  lang=code_dialog_lang.value
              }
              insertContent('\n```'+lang+'\n' + codeData.value + '\n```\n',editor,lastdata); //插入代码内容
          }
          codeEditor.setValue('')
          alertdata.codeShow=false
      }
      function linkPrase() {
          if(href_dialog_txt.value==''||href_dialog_href.value){
              return;
          }
          insertContent('\n['+href_dialog_txt.value+']('+href_dialog_href.value+')',editor,lastdata); //插入代码内容
          alertdata.linkShow=false
          href_dialog_txt.value=''  //重置数据
          href_dialog_href.value='http://'
      }
      return {href_dialog_href,linkPrase,href_dialog_txt,code_dialog_lang,codePrase,lang_type,codeEditorRef,tablePrase,tableData,table_header,col,row,sql,setData,sqlPrase,algin,editorRef,alertChange,attrChange,command,...toRefs(alertdata),html,editorPreview,...toRefs(props),...toRefs(data),changeData,mousescrollSide,previewRef,previewScroll,markdownScroll,upload,insert}
    }
  })
</script>
<style>

</style>
