<!-- 班级容器 -->
<template>
  <div id='courseWrapPage'>
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
#courseWrapPage {
    width:100%;
    height:100%;
}
</style>