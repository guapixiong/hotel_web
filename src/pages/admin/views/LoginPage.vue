<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-17 16:18
-->
<template>
        <div class="box">
            <router-view></router-view>
        </div>
</template>

<script>
export default {
    name: "LoginPage",
    data(){
        return{

        }
    },
    mounted() {
        //this.$router.push('/login/signIn')
    }
}
</script>

<style scoped>

.box{
    width: 1920px;
    height: 1080px;
    background-color: #8080FF;
    padding: 200px;
}

</style>