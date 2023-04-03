import Vue from 'vue';
import App from './views/AdminPage';
import router from './router/router'
import VueRouter from "vue-router";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd)
Vue.use(VueRouter)
new Vue({
    render: h => h(App),
    router
}).$mount('#app')