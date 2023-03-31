<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible style="width: 211px;height: 1080px">
            <div class="logo"/>
            <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
                <a-menu-item key="1">
                    <router-link to="/frontPage"><a-icon type="home"/><span>首页</span></router-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <router-link to="/recordPage"><a-icon type="carry-out"/><span>订单管理</span></router-link>
                </a-menu-item>
                <a-menu-item key="3">
                    <router-link to="/roomPage"><a-icon type="bank"/><span>房间管理</span></router-link>
                </a-menu-item>
                <a-menu-item key="4">
                    <router-link to="/commodityPage"><a-icon type="shopping"/><span>商品管理</span></router-link>
                </a-menu-item>
                <a-menu-item key="5">
                    <router-link to="/userPage"><a-icon type="user"/><span>用户管理</span></router-link>
                </a-menu-item>
                <a-menu-item key="6">
                    <router-link to="/operatePage"><a-icon type="control"/><span>操作日志</span></router-link>
                </a-menu-item>

            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff;">
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="collapsed=!collapsed"
                />
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff' }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
export default {
    name: "staff-page",
    data() {
        return {
            collapsed: false,
        };
    },
    mounted() {
        this.$router.push('/frontPage')
    }
}
</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #8080FF;
}

#components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

.ant-menu-item-selected {
    background-color: #8080FF !important;
    color: white !important;
}

.ant-menu-item-active {
    background-color: #8080FF !important;
}
</style>