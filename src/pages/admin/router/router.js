import VueRouter from 'vue-router';
const routes = [
    {
      path: '/',
      redirect:'/admin'
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
        ]
    },
    {
        path:'/login',
        component:()=>import('@/pages/admin/views/LoginPage'),
        children: [
            {
                path: 'signIn',
                component:()=>import('@/pages/admin/components/login/SignIn')
            }

        ]
    }

]
const router = new VueRouter({
    routes,
    mode: 'history'
})
// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//         if (store.state.token) {  // 通过vuex state获取当前的token是否存在
//             next();
//         }
//         else {
//             next({
//                 path: '/login',
//                 query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     }
//     else {
//         next();
//     }
// })
export default router