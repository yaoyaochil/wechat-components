import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style/element_visiable.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './style.css'
import App from './App.vue'
import wechatMenu from '@/components/wechat-menu.vue'
const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
export { wechatMenu }
