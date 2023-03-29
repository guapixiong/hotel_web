import Vue from 'vue';
import App from './views/StaffPage.vue';
import router from './routers/router'

new Vue({
    render: h => h(App),
    router
}).$mount('#app')