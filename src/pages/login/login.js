/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-17 16:19
 **/
import Vue from 'vue';
import App from './views/LoginPage';
import router from "./router/router";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import VueRouter from "vue-router";
Vue.use(Antd)
Vue.use(VueRouter)
new Vue({
    render: h => h(App),
    router
}).$mount('#app')