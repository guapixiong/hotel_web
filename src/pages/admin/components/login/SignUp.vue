<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-21 16:23
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
                    <a-input-password  v-model="account.password">
                        <a-icon slot="prefix" type="lock" />
                    </a-input-password>
                </a-form-model-item>
                <a-form-model-item label="确认密码" prop="password1">
                    <a-input-password  v-model="account.password1">
                        <a-icon slot="prefix" type="lock" />
                    </a-input-password>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">
                    <a-button style="width: 200px" @click="signUp" type="primary" shape="round">注册</a-button>
                </a-form-model-item>
            </a-form-model>

        </a-card>
    </div>
</template>

<script>
import {signUp} from "@/api/admin/administrator";

export default {
    name: "SignUp",
    data(){
        return{
            account:{
                name:'',
                password:'',
                password1:'',
            },
            rules:{
                name:[{required: true,message:'请输入用户名'}],
                password:[{required:true ,message:'请输入密码'}],
                password1:[{required:true ,message:'请确认密码'}],
            },
        }
    },
    mounted() {
    },
    methods:{
        signUp(){
            let me=this
            let params={
                name:me.account.name,
                password:me.account.password
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if(me.account.password!==me.account.password1){
                        me.$message.info("两次密码不一致")
                    }
                    else {
                        signUp(params).then(r=>{
                            if(r.data){
                                me.$message.success("注册成功,即将跳转到登录页面")
                                setTimeout(
                                    function (){
                                        me.$router.replace('/login/signIn')
                                    },2000
                                )
                            }
                            else
                                me.$message.error("注册失败,用户名已被注册")
                        })

                    }


                }
                else {
                    return false;
                }
            })
        }

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