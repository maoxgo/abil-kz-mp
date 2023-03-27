import App from './App';
import * as filters from './filters' // global filters
import helper from './helper/index.js'

// Api函数polyfill（目前为实验版本，如不需要，可删除！）';
import Polyfill from './polyfill/polyfill';
Polyfill.init();

// 全局mixins，用于实现setData等功能，请勿删除！';
import Mixin from './polyfill/mixins';

// #ifndef VUE3
import Vue from 'vue';
import store from './store'

Vue.mixin(Mixin);
Vue.config.productionTip = false;

Vue.prototype.$helper = helper
Vue.prototype.$store = store

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

App.mpType = 'app';
const app = new Vue({
    ...App
});

store.$app = app
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);
    app.mixin(Mixin);
    return {
        app
    };
}
// #endif
