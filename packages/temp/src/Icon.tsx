import {defineComponent} from "vue"

const ElIcon = defineComponent({
  name: "ElIcon",
  props: {
    name: {
      type: String
    }
  },
  setup (props) {
    return () => (
      <i class={`el-icon-${props.name}`}></i>
    )
  }
})

export default ElIcon