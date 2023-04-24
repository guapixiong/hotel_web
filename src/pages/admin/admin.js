import Vue from 'vue';
import App from './App'
import router from './router/router'
import VueRouter from "vue-router";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import store from './store/store'
import Vuex from 'vuex'
Vue.use(Antd)
Vue.use(VueRouter)

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')