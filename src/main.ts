import { createApp } from 'vue'
import 'ant-design-vue/dist/antd.css';
//加载根组件
import App from './App.vue'
//加载UI组件
import Antd from 'ant-design-vue';
//加载必要样式
import './style/index.less'



const app = createApp(App)
//引入router
import router from './router'

app.use(Antd);
app.use(router)
app.mount('#app')
