<template>
 <nav >
    <router-link tag="a"  to="/markdown">Markdown编辑</router-link>
    <router-link tag="a"  to="/textBus">富文本编辑器</router-link>
    <router-link tag="a"  to="/more">更多项目</router-link>
     <router-link tag="a"  to="/about">关于我们</router-link>
    <a tag="a" href="https://github.com/wike2019/wike-ui/tree/master/doc" target="_blank">文档</a>
    <a  href="https://github.com/wike2019/wike-ui/blob/master/doc/changelog.md" target="_blank">更新日志</a>
    <a  href="https://github.com/wike2019/wike-ui/blob/master/doc/font.md" target="_blank">合作与赞助</a>
    <a  href="https://github.com/wike2019/wike-ui" target="_blank"><WIcon name='fa-github' style="margin-right:5px"></WIcon>代码仓库</a>
 </nav>
 <h1  class="title"> WIKE-UI <span >公测版 v2.0.x</span></h1>
</template>

<script lang="ts">
 import { defineComponent} from 'vue'

 import WIcon from  "../icon/index.vue"
 export default defineComponent({
  name: 'mHeader',
  components:{
   WIcon
  },
  setup(props){

  }
 })
</script>
