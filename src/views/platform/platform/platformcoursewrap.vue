<!-- 双师平台容器 -->
<template>
  <div id='platformCoursePage'>
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
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = false
    next()
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

</style>