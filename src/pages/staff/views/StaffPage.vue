<template>
  <div>
    员工界面
    <p>
      <router-link to="/detail">Go to Detail</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "staff-page"
}
</script>

<style scoped>

</style>