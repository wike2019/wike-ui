import {defineComponent} from "vue"
import "./font-awesome/css/font-awesome.min.css"
const WIcon = defineComponent({
  name: "WIcon",
  props: {
    name: {
      type: String,
      required:true
    }
  },
  setup (props) {
    return () => (
      <i class={`fa ${props.name}`} aria-hidden="true" />
    )
  }
})

export default WIcon
