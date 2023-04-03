import VueRouter from 'vue-router';
const routes = [
    {
        path: '/frontPage',
        component: () => import('@/pages/admin/components/FrontPage.vue'),
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