import { defineComponent, ref,reactive,computed,onUnmounted,onMounted,watch,nextTick} from "vue";

import codemirror from "codemirror";
import marked from "./lib/lib";
import WTools from "./lib/components/tools";

import {eventfactory} from "./event"
import WIcon from "../../Icon";
import {renderJsx} from "./render";
const codemirrorConfig = {
  tabSize: 4,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: false,
  line: true,
  mode: "text/x-src",
  theme: "default",
  cursorHeight: 1,
  lineWiseCopyCut: true,
};

const WMd = defineComponent({
  name: "WMd",
  components:{
    WTools,
    WIcon
  },
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
    toolbars: {
      // 工具栏
      type: Object,
      default() {
        return {};
      },
    },
    bordered: {
      //是否有边框
      type: Boolean,
      default: true,
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
    exportFileName: {
      // 默认导出文件名称
      type: String,
      default: "我的文档",
    },
    markedOptions: {
      //marked.js配置项
      type: Object,
      default() {
        return {};
      },
    },
    isPreview: {
      //是否是预览模式
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    //数据
    let data = reactive({
      scrolling:true,
      fullscreen:false,
      scrollSide:"",
      split:true,
      preview:true,
      editorScrollHeight:0,
      lastInsert:""
    });

    const codemirrorview = ref(null);//编辑器

    const previewview = ref(null); //markdown预览根容器

    const previewInner = ref(null); //markdown预览内容

    const markdown = ref(null); //markdown编辑器根容器

    const htmldata = ref("");//html内容

    let actions = reactive({});//操作

    const value = ref(props.value);//编辑器内容

    const lastPos = ref("");//编辑器操作光标

    let timeoutId =null ;//延迟生成html

    const intervalId=null ;//定时保存

    let editor=null;//编辑器实例

    let eventFn=null;


    //计算属性
    const showView = computed(() => {
      return data.preview && data.split
    });



    watch(value, () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {

        let html = marked(value.value, {
          sanitize: false,
          ...props.markedOptions
        }).replace(/href="/gi, 'target="_blank" href="');

        htmldata.value = html;
        ctx.emit('input', value.value);
      }, 30);
    });
    watch(props.value, (value) => {
      value.value= value;
      editor.setOption("value", value);
    });
    watch(htmldata, () => {
      if( previewInner.value)
      previewInner.value.innerHTML = htmldata.value;
    });




    //
    const listerenKeyupEnter = (e) => {

      const {lastInsert} = data;
      if (lastInsert) {   //通过对比lastInsert的值 是否属于list内 然后处理 或者数字递增
        const list = ["-", "- [ ]", "- [x]"];
        if (list.includes(lastInsert.trim())) {
          e.preventDefault();
          // @ts-ignore
          actions.insertContent("\n" + lastInsert);
        } else if (/^\d+\.$/.test(lastInsert.trim())) {
          e.preventDefault();  //数字递增
          // @ts-ignore
          actions.insertContent("\n" + (parseInt(lastInsert, 0) + 1) + ".  ");
        }
      }
    };
    const listerenDelete = () => {
      nextTick(() => { //删除lastInsert的值
        if (!editor.isClean()) {
          const value = editor.getValue();
          if (value.split("\n").pop() === "") {
             data.lastInsert = "";
          }
        }
      });
    };
    const addEditorLintener = (editor,fn) => {
      editor.setSize("auto",props.height);
      editor.on("change", (info) => {
        lastPos.value = editor.getCursor(); //保存编辑器游标
        value.value = editor.getValue(); //更新值
        const {
          doc: { height }, //取得高度
        } = info;
        data.editorScrollHeight = height; //设置高度
      });

      editor.on("scroll",  fn.markdownScroll); //2个视窗都滚动
      editor.on("paste",  fn.handlePaste); //监听复制
      editor.on("keydown", (data, e) => {
        if (e.keyCode === 83) {
          if (e.metaKey || e.ctrlKey) {
            //ctrl +s 保存
            e.preventDefault();
            fn.handleSave();
          }
        } else if (e.keyCode === 13) {
          listerenKeyupEnter(e); //回车事件 加入换行
        } else if (e.keyCode === 8) {
          listerenDelete(data); //删除事件  删除字符
        }
      });
    };
    const createEditor = () => {
      editor = new codemirror(codemirrorview.value, {
        value: value.value,
        onload: (data) => {
          const {
            doc: { height = 0 },
          } = data;
          data.editorScrollHeight = height;

        },
        ...codemirrorConfig,
      });
      eventFn=eventfactory(data,previewview,ctx,editor,value,actions,previewInner,htmldata)
      addEditorLintener(editor,eventFn);
      init(eventFn)

    };
    const init = (fn) =>{// 初始化
      setTimeout(() => {
        if (props.autoSave) { //如果配置了autoSave则定时保存
          intervalId = setInterval(() => {
            fn.handleSave();
          }, props.interval);
        }
      }, 20);
    }

    onMounted(() => {
      createEditor();

    });
    onUnmounted(() => {
      clearInterval(intervalId)
    });



    return () => {
     //return  111111111111
      return renderJsx(props.isPreview,data,null,lastPos,codemirrorview,showView,previewview,previewInner,markdown,props.bordered,props.width,props.height,props.exportFileName)
    }
  }
});

export default WMd;
/*

 */
