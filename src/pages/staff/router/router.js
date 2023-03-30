import VueRouter from 'vue-router';
const routes = [
    {
        path: '/frontPage',
        component: () => import('@/pages/staff/components/FrontPage.vue'),
    },
    {
        path: '/recordPage',
        component: () => import('@/pages/staff/components/RecordPage.vue'),
    },
    {
        path: '/roomPage',
        component: ()=>import('@/pages/staff/components/RoomPage'),
    },
    {
        path: '/commodityPage',
        component: ()=>import('@/pages/staff/components/CommodityPage'),
    },
    {
        path: '/UserPage',
        component: ()=>import('@/pages/staff/components/UserPage'),
    },
    {
        path: '/OperatePage',
        component: ()=>import('@/pages/staff/components/OperatePage'),
    },
]
const router = new VueRouter({
    routes,
    mode: 'history'
})
export default router