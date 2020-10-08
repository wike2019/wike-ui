import { defineComponent, ref} from "vue";
import renderJsx from "./render";
import createAcitons from "./action";
const WTools = defineComponent({
  name: "WTools",
  props:["editor","preview","scrolling","fullscreen","split","lastPos","exportFileName"],
  setup(props,contxext){
      let lastInsert=ref("")

      return ()=>{
         // @ts-ignore
        return <nav class="nav-markdown-toolbars">
          {
            renderJsx(props.preview,props.fullscreen,props.scrolling,props.split,props.exportFileName,createAcitons(props.editor,props.lastPos,lastInsert,contxext.emit))
          }
        </nav>
      }
    }
})


export default WTools;
