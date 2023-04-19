<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-17 16:45
-->
<template>
    <div>
        <a-button @click="goToHome">登录</a-button>
        <a-button @click="goToSignUp">注册</a-button>
    </div>
</template>

<script>
export default {
    name: "SignIn",
    data(){
        return{

        }
    },
    methods:{
        goToHome(){
            window.location.href='/admin'

        },
        goToSignUp(){
            this.$router.push('/signIn')
        }

    },
}
</script>

<style scoped>

</style>