<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-17 16:45
-->
<template>
    <div>
        <a-card class="box">
            <a-form-model ref="ruleForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" :model="account" :rules="rules">
                <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">
                    <span>酒店客房管理系统</span>
                </a-form-model-item>
                <a-form-model-item label="账号" prop="name">
                    <a-input v-model="account.name" >
                        <a-icon slot="prefix" type="user" />
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="密码" prop="password">
                    <a-input-password  v-model="account.password" @keyup.enter="goToHome">
                        <a-icon slot="prefix" type="lock" />
                    </a-input-password>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">
                    <a-button style="width: 200px" @click="goToHome" type="primary" shape="round" >登录</a-button>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">
                    <a-button style="width: 200px;"  shape="round" @click="goToSignUp">注册</a-button>
                </a-form-model-item>
            </a-form-model>

        </a-card>
    </div>
</template>

<script>

import {signIn} from "@/api/admin/administrator";
export default {
    name: "SignIn",
    data(){
        return{
            account:{
                name:'',
                password:'',
            },
            rules:{
                name:[{required: true,message:'请输入用户名'}],
                password:[{required:true ,message:'请输入密码'}],
            },

        }
    },
    mounted() {

    },
    methods:{
        goToHome(){
            let me=this
            let params={
                username:me.account.name,
                password:me.account.password
            }
            //console.log(params)
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    signIn(params).then(r=>{
                        if(r.status===200){
                            //console.log(r.data)
                            me.$store.commit('setToken',r.data.token)
                            me.$store.commit('setAdministratorId',r.data.uid)
                            me.$message.success("登录成功,即将跳转到主页面")
                            setTimeout(function (){
                                window.location.href='/'
                            },1000)

                        }
                        if(r.status===203){
                            me.$message.error("密码错误或者用户不存在")
                        }

                    })
                }
                else {
                    return false;
                }
            })
        },
        goToSignUp(){
            this.$router.push('/login/signUp')
        },

    },
}
</script>

<style scoped>
.box{
    width: 600px;
    height: 394px;
    background-color: #FFFFFF;
    margin: auto;
    border-radius: 5px
}
</style>