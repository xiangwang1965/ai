// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import filters from '@/utils/filters'
import dialogUtils from './dialogs/utils'
import eventHub, * as EVENTS from './utils/eventHub'
import store from './vuex/store.js'
import pkg from '../package.json'
import '@/utils'
// import { MAIN_URL } from '@/config'
// import authApi from '@/services/auth'
// import Cookies from 'js-cookie'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

Vue.config.productionTip = false

Object.keys(filters).forEach(v => Vue.filter(v, filters[v]))

Vue.prototype.$eventHub = eventHub
Vue.prototype.$EVENTS = EVENTS
Vue.prototype.$dialog = dialogUtils

Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.coursewareSelect .el-scrollbar__wrap')
    selectWrap.addEventListener('scroll', function () {
      let sign = 100
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
const elScrollBar = (el) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, {
      suppressScrollX: true
    })
  }
}

Vue.directive('scrollBar', {
  inserted (el, binding, vnode) {
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    try {
      vnode.context.$nextTick(
        () => {
          elScrollBar(el)
        }
      )
    } catch (error) {
      console.error(error)
      elScrollBar(el)
    }
  }
})
// if (location.search.toLowerCase().indexOf('token') !== -1) {
//   const TOKEN_KEY = 'ADMIN_TOKEN'
//   // 登录后的用户信息
//   const EXPIRES = 1 // 24 小时过期
//   if (location.search) {
//     let searchArr = location.search.substring(1, location.search.length).split('&')
//     searchArr.map((v, i) => {
//       let objArr = v.split('=')
//       if (objArr[0] === 'token') {
//         Cookies.set(TOKEN_KEY, objArr[1], { expires: EXPIRES, domain: MAIN_URL })
//         // Cookies.set(TOKEN_KEY, objArr[1], { expires: EXPIRES, domain: WB_MAIN_URL })
//         Cookies.set('FROM_URL', 'wisroom', { expires: EXPIRES, domain: MAIN_URL })
//         // Cookies.set('FROM_URL', 'wisroom', { expires: EXPIRES, domain: WB_MAIN_URL })
//       }
//     })
//   }
//   authApi.fetchSchool().then(res => {
//     let { id, name, role_name, school, avatar_url, is_teach, is_live } = res.data.users[0]
//     this.setUser({
//       id,
//       name,
//       role_name,
//       school_id: school.id,
//       school_name: school.name,
//       third_part: school.third_part,
//       is_self_live: school.is_self_live,
//       avatar_url,
//       is_teach,
//       is_live
//     })
//   })
// }

Vue.use(ElementUI)

// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title ? '学校管理-' + to.meta.title : '学校管理'
//   next()
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

// window 上存放版本号
window.res = {
  name: pkg.name,
  version: pkg.version
}

console.log(`   APP ${pkg.name} v${pkg.version} is running`)
