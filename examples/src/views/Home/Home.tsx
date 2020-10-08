import { defineComponent } from "vue";




import WMd from "../../../../packages/Md";
//import WIcon from "../../../../packages/Icon";
export default defineComponent({
  name: "App",
  setup() {
    return () => (
        <div><WMd  /></div>
    );
  }
});
