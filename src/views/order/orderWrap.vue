<!-- 订单容器 -->
<template>
  <div id='orderWrapPage'>
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
  }
}
</script>
<style scoped>
    #orderWrapPage {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
