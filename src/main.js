import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入main.css,重置样式
import './assets/css/main.css'

// 导入element-plus中相关依赖
import ElementPlus from 'element-plus'
// 导入样式
import 'element-plus/dist/index.css'
// 导入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入语言库
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入后端请求的api
import api from './api/index.js'

// 创建app应用
const app= createApp(App)


// 注册elementplus
app.use(ElementPlus)

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 注册语言库
app.use(ElementPlus, {
    locale: zhCn,
})

// 将封装好的后端请求接口,定义为app这个应用的全局属性
app.config.globalProperties.$api = api

app.use(router).mount('#app')
