// import '@babel/polyfill'
// 清除旧版本数据
import App from './App.vue'
import ensureVueComponent from './config/vue-ensure'
import router from './router/index.js'
import store from './store'
import { preventReClick } from '@/utils/plugins'; // 直接在要使用的按钮上面添加v-prevent-re-click，就可以防止多次提交
import Clipboard from 'v-clipboard'
import './assets/css/public.styl'; // 全局引用公共样式文件
import './assets/css/homework.styl'; // 作业模块公共样式文件
import 'vue-happy-scroll/docs/happy-scroll.css'; // 引入滚动条优化插件样式文件
import API from './api'; // 引入API文件
import clickOutside from './directives/click-outside'; // 自定义全局点击空白处指令
import permit from './directives/permit'; // 自定义全局权限指令
import $CONFIG from './config'; // 引入配置文件
import * as FILTER from './utils/filters'; // 全局过滤器
import one from './one-builder'
import uploader from 'vue-simple-uploader'
import all from '@/utils/common.js';
import importDirective from './directives/index.js' // 引入自定义指令
import './timer/index.js' // 引入定时器文件
import './version'
import gokBus from './gok-bus'
import { LOG_DAU } from '@_c/log'
import componentsLoader from '@/components/components-loader'
import '@/design/index.styl'

const Vue = require('vue')
Vue.config.devtools = true
// const isDebugMode = process.env.NODE_ENV !== 'production'
// Vue.config.devtools = isDebugMode
componentsLoader.install(Vue)
Vue.use(all);// 将全局函数当做插件来进行注册
LOG_DAU.dauLog();

// one.init(function (res) {
// 导出的是对象，可以直接通过 key 和 value 来获得过滤器的名和过滤器的方法
Object.keys(FILTER).forEach(key => {
  Vue.filter(key, FILTER[key])
})
Vue.config.productionTip = false;
Vue.prototype.$API = API; // 引入API文件
Vue.prototype.$CONFIG = $CONFIG; // 引入配置文件
Vue.prototype.$one = one; // 引入gok-one
Vue.prototype.$gokBus = gokBus; // 引入gok-one
Vue.use(preventReClick)
Vue.use(Clipboard)
Vue.directive('clickOutside', clickOutside); // 自定义全局点击空白处指令
Vue.directive('permit', permit); // 自定义全局权限指令
Vue.use(uploader)
// 按需加载需要使用的iview组件
// ensureVueComponent(Vue)
importDirective(Vue); // 注册指令

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
// })
