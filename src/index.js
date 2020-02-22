import VCode from './views/Index.vue'
import VueCompositionApi from '@vue/composition-api'

const install = Vue => {
  Vue.use(VueCompositionApi)
  Vue.component(VCode.name, VCode)
}

// auto install if used in browser
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {VCode}

export default install
