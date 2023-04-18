/**
 * @description :
 * @author : Xiong Penghui
 * @date : 2023-04-17 16:18
 **/
import VueRouter from 'vue-router';
const routes = [
    {
        path:'/signIn',
        component:()=>import('@/pages/login/components/SignIn')
    },
    {
        path: '/signUp',
        component:()=>import('@/pages/login/components/SignUp')
    },
    {
        path:'/goToHome',
        redirect:'/admin/frontPage'
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})
export default router