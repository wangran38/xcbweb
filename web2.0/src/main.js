import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@wangeditor/editor/dist/css/style.css'
import '@/icons' // icon
import '@/permission' // permission control
/*百度编辑器 */
// import '../public/static/ue/ueditor.config.js'
// import '../public/static/ue/ueditor.parse.js'
// import '../public/static/ue/_examples/editor_api.js'

// import '../public/static/ue/ueditor.config.js'
// import '../public/static/ue/ueditor.all.min.js'
// import '../public/static/ue/lang/zh-cn/zh-cn.js'
// import '../public/static/ue/ueditor.parse.js'
// import '../public/static/ue/themes/default/css/ueditor.css'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
