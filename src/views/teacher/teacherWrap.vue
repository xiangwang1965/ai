<!-- 学生容器 -->
<template>
  <div id='studentPage'>
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = false
    to.meta.keepAlive = true
    this.$destroy()
    next()
  }
}
</script>
<style scoped>
 #studentPage {
     min-height:100%;
     min-width:100%;
     width:100vw;
     height:100vh;
 }
</style>