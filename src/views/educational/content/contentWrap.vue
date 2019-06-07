<!-- 课程(内容)包容器 -->
<template>
  <div id='content-wrap'>
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

</style>
