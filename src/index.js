import VCode from './views/Code.vue'

const install = Vue => {
  Vue.component(VCode.name, VCode)
}

// auto install if used in browser
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {VCode}

export default install
