<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-19 09:25
-->
<template>
    <div>
        <a style="color: #C081FF" @click="goBack"><a-icon type="double-left" />返回</a>
        结账页面
    </div>
</template>

<script>
export default {
    name: "CheckoutPage",
    data(){
        return{

        }
    },
    mounted() {
    },
    methods:{
        /**
         * 返回
         */
        goBack(){
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>

</style>