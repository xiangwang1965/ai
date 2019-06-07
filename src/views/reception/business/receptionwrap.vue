<!-- 前台业务容器 -->
<template>
  <div class='receptionPage'>
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
<style lang="less">

</style>