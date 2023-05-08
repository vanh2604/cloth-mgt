import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'


const app = createApp(App)

app.use(router)

app.mount('#app')
