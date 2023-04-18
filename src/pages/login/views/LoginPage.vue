<!--
  @description :
  @author : Xiong Penghui
  @date : 2023-04-17 16:18
-->
<template>
        <div>
            <div :style="{ margin: '24px 16px', padding: '24px', background: '#fff' }">
                <router-view></router-view>
            </div>
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
        this.$router.push('/signIn')
    }
}
</script>

<style scoped>

</style>