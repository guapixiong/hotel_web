import VueRouter from 'vue-router';
const routes = [
    {
        path: '/frontPage',
        component: () => import('@/pages/admin/components/FrontPage.vue'),
    },
    {
      path:'/accommodation/register',
        component:()=>import('@/pages/admin/components/accommodation/AccommodationRegistration')
    },
    {
        path:'/accommodation/reserve',
        component:()=>import('@/pages/admin/components/accommodation/RoomReservation')
    },
    {
        path:'/accommodation/fastCheckIn',
        component:()=>import('@/pages/admin/components/accommodation/FastCheckIn')
    },
    {
        path: '/recordPage',
        component: () => import('@/pages/admin/components/RecordPage.vue'),
    },
    {
        path: '/roomPage',
        component: ()=>import('@/pages/admin/components/RoomPage'),
    },
    {
        path: '/commodityPage',
        component: ()=>import('@/pages/admin/components/CommodityPage'),
    },
    {
        path: '/userPage',
        component: ()=>import('@/pages/admin/components/UserPage'),
    },
    {
        path: '/operatePage',
        component: ()=>import('@/pages/admin/components/OperatePage'),
    },
]
const router = new VueRouter({
    routes,
    mode: 'history'
})
export default router