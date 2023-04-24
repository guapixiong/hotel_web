<template>
    <a-locale-provider :locale="zh_CN">
        <a-layout id="components-layout-demo-custom-trigger">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible style="width: 211px;height: 1080px">
                <div class="logo"/>
                <a-menu theme="dark" mode="inline" :default-selected-keys="['1']" :default-open-keys="['sub1']">
                    <a-menu-item key="1">
                        <router-link to="/admin/frontPage"><a-icon type="home"/><span>首页</span></router-link>
                    </a-menu-item>
                    <a-sub-menu key="sub1">
                        <span slot="title"><a-icon type="mail" /><span>住宿管理</span></span>
                        <a-menu-item key="7">
                            <router-link to="/admin/accommodation/reserve"><a-icon type="carry-out"/><span>客房预定</span></router-link>
                        </a-menu-item>
                        <a-menu-item key="9">
                            <router-link to="/admin/accommodation/fastCheckIn"><a-icon type="carry-out"/><span>快速入住</span></router-link>
                        </a-menu-item>
                        <a-menu-item key="8">
                            <router-link to="/admin/accommodation/register"><a-icon type="carry-out"/><span>住宿操作</span></router-link>
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="2">
                        <router-link to="/admin/recordPage"><a-icon type="carry-out"/><span>订单管理</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="11">
                        <router-link to="/admin/occupant"><a-icon type="carry-out"/><span>入住信息</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="10">
                        <router-link to="/admin/commodityRecord"><a-icon type="carry-out"/><span>商品记录</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="3">
                        <router-link to="/admin/roomPage"><a-icon type="bank"/><span>房间管理</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="4">
                        <router-link to="/admin/commodityPage"><a-icon type="shopping"/><span>商品管理</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="5">
                        <router-link to="/admin/userPage"><a-icon type="user"/><span>用户管理</span></router-link>
                    </a-menu-item>
<!--                    <a-menu-item key="6">-->
<!--                        <router-link to="/operatePage"><a-icon type="control"/><span>操作日志</span></router-link>-->
<!--                    </a-menu-item>-->
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-header style="background: #fff;">
                    <a-icon
                        class="trigger"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="collapsed=!collapsed"
                    />
                    <a-dropdown style="margin-left: 1400px;width: 200px">
                        <a class="ant-dropdown-link"  @click="e => e.preventDefault()"><a-icon type="user" /><a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a @click="openPasswordModal">更改密码</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a  @click="signOut">退出登录</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                    <a-modal :visible="passwordModal.visible" @cancel="cancelPasswordModal" @ok="okUpdatePassword">
                        <a-form-model>
                            <a-form-model-item label="原密码">
                                <a-input-password v-model="passwordModal.oldPassword"></a-input-password>
                            </a-form-model-item>
                            <a-form-model-item label="新密码">
                                <a-input-password v-model="passwordModal.newPassword"></a-input-password>
                            </a-form-model-item>
                        </a-form-model>
                    </a-modal>

                </a-layout-header>
                <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#ffff' }">
<!--                    <a @click="goBack"><a-icon type="double-left" />返回</a>-->
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {updatePassword} from "@/api/admin/administrator";
moment.locale('zh-cn');
export default {
    name: "admin-page",
    data() {
        return {
            collapsed: false,
            zh_CN,
            passwordModal:{
                visible:false,
                oldPassword:'',
                newPassword:'',
            }
        };
    },
    mounted() {
        //this.$router.push('/admin/frontPage')
    },
    methods:{
        goBack(){
            this.$router.go(-1)
        },
        signOut(){
            this.$store.commit('delToken')
            this.$store.commit('delAdministratorId')
            this.$router.replace('/login/signUp')
        },
        openPasswordModal(){
          this.passwordModal.visible=true
        },
        cancelPasswordModal(){
            this.passwordModal.visible=false
        },

        okUpdatePassword(){
            let me=this
            let params={
                id:me.$store.state.administrator_id,
                oldPassword: me.passwordModal.oldPassword,
                newPassword: me.passwordModal.newPassword
            }
            //console.log(params)
            updatePassword(params).then(r=>{
                if(r.data){
                    me.$message.success("修改成功")
                    me.passwordModal.visible=false
                }
                else {
                    me.$message.error("修改失败,原密码错误")
                }
            })

        },

    },
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