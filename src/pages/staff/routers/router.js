import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)
const routes=[
    {   path:'/detail',
        name:'detail',
        component: ()=>import('@/pages/staff/components/record.vue'),
    }
]
const router=new VueRouter({
    routes,
    mode:'history'
})
export default router