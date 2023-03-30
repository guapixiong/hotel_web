
import VueRouter from 'vue-router';

const routes=[
    {   path:'/frontPage',
        name:'frontPage',
        component: ()=>import('@/pages/staff/components/FrontPage.vue'),
    }
]
const router=new VueRouter({
    routes,
    mode:'history'
})
export default router