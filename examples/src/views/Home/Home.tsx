import { defineComponent } from "vue";




import WMd from "../../../../packages/Md";
import WIcon from "../../../../packages/Icon";
export default defineComponent({
  name: "App",
  setup() {
    return () => (
        <div>hello world<WMd  />2222222<WIcon name="fa-bath" style={{fontSize:"30px"}}></WIcon></div>
    );
  }
});
