<template>
  <i :class="classlist" aria-hidden="true"></i>
</template>

<script lang="ts">
  import { defineComponent} from 'vue'
  export default defineComponent({
    name: 'icon',
    props: {
      name: {
        type: String,
        required:true
      }
    },
    setup(props){
      const classlist="fa "+props.name
     return {classlist}
    }
  })
</script>
