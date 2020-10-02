import { defineComponent, ref, onMounted, computed, watch } from "vue";

import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
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
    const eventConfig = {
      imageUpload: "on-upload-image",
      changeData: "change_data",
      save: "on-save",
      ready: "on-ready",
    };

    //事件
    const mousescrollSide = (left) => {
      //htmldata.value = "<div>111111111</div>";
    };
    const previewScroll = () => {};

    //计算属性
    const showView = computed(() => {
      return preview.value ? preview.value : split.value;
    });

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
                <div ref={previewInner}>444444444</div>
              </div>
            )}
          </div>
        </div>
      );
    };
    watch(htmldata, () => {
      previewInner.value.innerHTML = htmldata.value;
    });
    const renderPreview = () => {
      return (
        <div class="markdown-preview markdown-theme-dark">
          <div ref="previewInner">333333333333</div>
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
    const listerenKeyupEnter = () => {};
    const listerenDelete = () => {};
    const addEditorLintener = () => {
      const vmeditor = editor.value;
      if (!vmeditor) {
        return;
      }
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
        lastPos.value = vmeditor.getCursor(); //当失去焦点 再点击编辑器 更新此时点击的位置，更新游标
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
    onMounted(() => {
      createEditor();
    });
    return () => {
      return <div>{!props.isPreview ? renderEdior() : renderPreview()}</div>;
    };
  },
});

export default WMd;
/*

 */
