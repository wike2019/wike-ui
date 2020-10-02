import { defineComponent } from "vue";




import WMd from "../../../../packages/Md";
export default defineComponent({
  name: "App",
  setup() {
    return () => (
        <div>hello world<WMd  />2222222</div>
    );
  }
});
