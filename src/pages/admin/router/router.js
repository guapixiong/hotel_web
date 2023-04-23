import VueRouter from 'vue-router';
import {message} from "ant-design-vue";

const routes = [
    {
      path: '/',
      redirect:'/login'
    },
    {
        path:'/admin',
        component:()=>import('@/pages/admin/views/AdminPage'),
        children:[
            {
                path: 'frontPage',
                component: () => import('@/pages/admin/components/FrontPage.vue'),
            },
            {
                path:'accommodation/register',
                component:()=>import('@/pages/admin/components/accommodation/AccommodationRegistration'),
            },
            {
                path:'accommodation/reserve',
                component:()=>import('@/pages/admin/components/accommodation/RoomReservation'),
            },
            {
                path:'accommodation/fastCheckIn',
                component:()=>import('@/pages/admin/components/accommodation/FastCheckIn'),
            },
            {
                path:'accommodation/commodityAdd/:id',
                component:()=>import('@/pages/admin/components/accommodation/CommodityAdd'),
            },
            {
                path:'accommodation/orderDetails/:id',
                component:()=>import('@/pages/admin/components/accommodation/OrderDetails'),
            },
            {
                path:'accommodation/checkoutPage/:id',
                component:()=>import('@/pages/admin/components/accommodation/CheckoutPage'),
            },
            {
                path:'accommodation/checkIn/:id',
                component:()=>import('@/pages/admin/components/accommodation/CheckIn'),
            },
            {
                path:'accommodation/reimburse/:id',
                component:()=>import('@/pages/admin/components/accommodation/ReimbursePage'),
            },
            {
                path: 'recordPage',
                component: () => import('@/pages/admin/components/RecordPage.vue'),
            },
            {
                path:'occupant',
                component:()=>import('@/pages/admin/components/OccupantPage'),
            },
            {
                path: 'roomPage',
                component: ()=>import('@/pages/admin/components/RoomPage'),
            },
            {
                path: 'commodityPage',
                component: ()=>import('@/pages/admin/components/CommodityPage'),
            },

            {
                path: 'userPage',
                component: ()=>import('@/pages/admin/components/UserPage'),
            },
            {
                path: 'operatePage',
                component: ()=>import('@/pages/admin/components/OperatePage'),
            },
            {
                path:'commodityRecord',
                component:()=>import('@/pages/admin/components/CommodityRecord'),
            }
        ],
        meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
    },
    {
        path:'/login',
        component:()=>import('@/pages/admin/views/LoginPage'),
        children: [
            {
                path: 'signIn',
                component:()=>import('@/pages/admin/components/login/SignIn')
            },
            {
                path: 'signUp',
                component:()=>import('@/pages/admin/components/login/SignUp')
            }

        ]
    }

]
const router = new VueRouter({
    routes,
    mode: 'history'
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限

        if (localStorage.getItem('token')!=undefined&&localStorage.getItem('token').length>0) {  // 获取当前的token是否存在
            next();
        }
        else {
            message.info("当前未登录即将跳转到登录界面")
            setTimeout(function (){
                next({
                    path: '/login',
                })
            },1000)

        }
    }
    else {
        next();
    }
})
export default router