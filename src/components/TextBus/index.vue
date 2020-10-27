<template>
  <div id="editorRef"></div>
</template>

<script lang="ts">

  import { defineComponent,onMounted ,ref,watch} from 'vue'
  import {listener,factory} from './editor/interface/index'
  import '@tanbo/textbus/bundles/textbus.min.css';


  export default defineComponent({
    name: 'TextBus',
    props:{
      config:Object,
      value:String
    },
    emits:['input','css'],
    setup(props,ctx){
      const currentValue=ref(props.value)
      const editorRef=ref(null)
      onMounted(()=>{

        factory("#editorRef",props.config,currentValue.value)
        listener(currentValue)
      })
      watch(currentValue,(data)=>{
        ctx.emit('input',data)
      })

      return {editorRef}
    }
  })
</script>
<style>

</style>
