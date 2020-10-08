import { defineComponent, ref, onMounted, computed, watch,nextTick ,onUnmounted} from "vue";

// @ts-ignore
import codemirror from "codemirror";
import marked from "./lib/lib";
import WTools from "./lib/components/tools";

const codemirrorConfig = {
  tabSize: 4,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: false,
  line: true,
  mode: "text/x-src",
  theme: "default",
  cursorHeight: 0.8,
  lineWiseCopyCut: true,
};

const WMd = defineComponent({
  name: "WMd",
  components:{
    WTools
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
    const preview = ref(true);
    const split = ref(true);
    const codemirrorview = ref(null);
    const previewview = ref(null);
    const previewInner = ref(null);
    const markdown = ref(null);
    const htmldata = ref("");
    const fullscreen = ref(false);
    const editor = ref(null);
    const value = ref(props.value);
    const editorScrollHeight = ref(0);
    const lastPos = ref("");
    const timeoutId = ref(null);
    const indexLenth = ref(1);
    const scrollSide = ref("");
    const scrolling = ref(true);
    const instance = ref(null);
    const timeid=null
    const eventConfig = {
      imageUpload: "onUploadImage",
      changeData: "change_data",
      save: "on-save",
      ready: "on-ready",
    };

    //事件
    const mousescrollSide = (side) => {
       scrollSide.value = side;
    };
    const previewScroll = () => {
      if (scrolling.value && scrollSide.value === 'right') {
        const preview =previewview.value;
        if(!preview){
          return
        }
        const contentHeight = preview.offsetHeight;
        const previewScrollHeight = preview.scrollHeight;
        const previewScrollTop = preview.scrollTop;
        const scrollTop = parseInt((previewScrollTop * (editorScrollHeigh.value - contentHeight)) / (previewScrollHeight - contentHeight), 0);
        editor.value.scrollTo(0, scrollTop);
      }
    };

    //计算属性
    const showView = computed(() => {
      return preview.value ? preview.value : split.value;
    });
    const  hello=()=>{
      console.log(11111111111)
    }
    //render
    const renderEdior = () => {
      return (
        <div
          class={`markdown ${fullscreen.value ? "fullscreen" : ""} ${
            props.bordered ? "border" : ""
          }`}
          ref={markdown}
          style={{ width: props.width + "px", height: props.height + "px" }}
        >
          <WTools onUploadImage={upload_image}  onSetCursor={setCursor} onHello={hello} fullscreen={props.fullscreen}  split={split.value} scrolling={scrolling.value} ref={instance} preview={preview.value}  editor={editor}   lastPos={lastPos.value} value={value.value} exportFileName={props.exportFileName} ></WTools>
          <div class="markdown-content" style={{ background: preview.value ? "fff" : "" }}>

            {!preview.value ? (
              ""
            ) : (
              <div
                class="codemirror"
                ref={codemirrorview}
                onMouseenter={() => mousescrollSide("left")}
              ></div>
            )}
            {!showView ? (
              ""
            ) : (
              <div
                class="markdown-preview markdown-theme-dark"
                ref={previewview}
                onScroll={() => previewScroll()}
                onMouseenter={() => mousescrollSide("right")}
              >
                <div ref={previewInner}></div>
              </div>
            )}
          </div>
        </div>
      );
    };
    watch(value, () => {
      clearTimeout(timeoutId);
      timeoutId.value = setTimeout(() => {

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
      editor.value.setOption("value", value);
    });
    watch(htmldata, () => {
      previewInner.value.innerHTML = htmldata.value;
    });
    const renderPreview = () => {
      return (
        <div class="markdown-preview markdown-theme-dark">
          <div ref="previewInner"></div>
        </div>
      );
    };
    const markdownScroll = (data = {}) => {
      //编辑器区域滚动
      if (scrolling.value && scrollSide.value === "left") {
        const {
          doc: { height, scrollTop },
        } = data;
        const preview = previewview.value;
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
    const upload_image=(data)=>{
      //让事件冒泡给
      ctx.emit(eventConfig.imageUpload, data);
    };
    const handleSave = () => {
      const vmeditor = editor.value;
      if (!vmeditor) {
        return;
      }
      value.value = vmeditor.getValue();
      ctx.emit(eventConfig.save, value.value);
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
          ctx.emit(eventConfig.imageUpload, file);
          e.preventDefault();
        }
      }
    };
    const listerenKeyupEnter = (e) => {
      console.log(instance.value.props)
      if(!instance.value){
        return
      }
      const {lastInsert} = instance.value;
      console.log(lastInsert)
      if (lastInsert) {   //通过对比lastInsert的值 是否属于list内 然后处理 或者数字递增
        const list = ['-', '- [ ]', '- [x]'];
        if (list.includes(lastInsert.trim())) {
          e.preventDefault();
          instance.value.insertContent('\n' + lastInsert);
        } else if (/^\d+\.$/.test(lastInsert.trim())) {
          e.preventDefault();  //数字递增
          instance.value.insertContent(
            '\n' + (parseInt(lastInsert, 0) + 1) + '.  '
          );
        }
      }
    };
    const listerenDelete = () => {
      nextTick(() => { //删除lastInsert的值
        const vmeditor = editor.value;
        if (!vmeditor) {
          return;
        }
        if (!vmeditor.isClean()) {
          const value = vmeditor.getValue();
          if (value.split("\n").pop() === "") {
             instance.value.lastInsert = "";
          }
        }
      });
    };
    const addEditorLintener = () => {
      const vmeditor = editor.value;
      if (!vmeditor) {
        return;
      }
      vmeditor.setSize("auto",props.height);
      vmeditor.on("change", (data) => {
        lastPos.value = vmeditor.getCursor(); //保存编辑器游标
        value.value = vmeditor.getValue(); //更新值
        const {
          doc: { height }, //取得高度
        } = data;
        editorScrollHeight.value = height; //设置高度
      });

      vmeditor.on("scroll", markdownScroll); //2个视窗都滚动
      vmeditor.on("paste", handlePaste); //监听复制
      vmeditor.on("keydown", (data, e) => {
        if (e.keyCode === 83) {
          if (e.metaKey || e.ctrlKey) {
            //ctrl +s 保存
            e.preventDefault();
            handleSave();
          }
        } else if (e.keyCode === 13) {
          listerenKeyupEnter(e); //回车事件 加入换行
        } else if (e.keyCode === 8) {
          listerenDelete(data); //删除事件  删除字符
        }
      });
      vmeditor.on("focus", () => {
        try {
          console.log(11)
          lastPos.value = vmeditor.getCursor(); //当失去焦点 再点击编辑器 更新此时点击的位置，更新游标
          console.log(lastPos)
        }catch (e) {

        }

      });
    };
    const createEditor = () => {
      editor.value = new codemirror(codemirrorview.value, {
        value: value.value,
        onload: (data) => {
          const {
            doc: { height = 0 },
          } = data;
          editorScrollHeight.value = height;

        },
        ...codemirrorConfig,
      });
      addEditorLintener();
    };
    const init = () =>{// 初始化
      setTimeout(() => {
        if (props.autoSave) { //如果配置了autoSave则定时保存
          timeid = setInterval(() => {
            handleSave();
          }, props.interval);
        }
      }, 20);
    }
    const setCursor = (line = 0, ch = 0) =>{// 设置焦点

      const vmeditor = editor.value;
      if (!vmeditor) {
        return;
      }
      vmeditor.refresh()
      try {
        vmeditor.setCursor(line, ch); //游标更新
        // @ts-ignore
        vmeditor.focus(); //触发focus 将更新的游标保存到lastPos中
      }catch (e) {
        vmeditor.setCursor(0, 0); //游标更新
        // @ts-ignore
        vmeditor.focus(); //触发focus 将更新的游标保存到lastPos中
      }

    }
    onMounted(() => {
      //console.log(marked)
      createEditor();
      init()
    });
    onUnmounted(() => {
      clearInterval(timeid)
    });

    return () => {
      return <div>
        {!props.isPreview ? renderEdior() : renderPreview()}
      </div>;
    };
  },
});

export default WMd;
/*

 */
