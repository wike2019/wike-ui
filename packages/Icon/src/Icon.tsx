import {defineComponent} from "vue"
const WIcon = defineComponent({
  name: "WIcon",
  props: {
    name: {
      type: String,
      required:true
    }
  },
  setup (props,context) {
    return () => (
      <span class={`fa ${props.name}`} aria-hidden="true" />
    )
  }
})

export default WIcon
