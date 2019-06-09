<!-- 应用首页 -->
<template>
  <div class="wrap">
    <appHeader></appHeader>
    <!-- <el-container class="mainContainer">
      <appSidebar class="appSidebarWrap"></appSidebar>
      <el-main class="appMain" v-scrollBar>
        <appHeader class="appHeader"></appHeader>
        <div class="addBody">
            <router-view></router-view>
        </div>
      </el-main>
    </el-container> -->
  </div>
</template>

<script>
import appHeader from '@/layouts/appHeader'
import appSidebar from '@/layouts/appSidebar'
import appFooter from '@/layouts/appFooter'
export default {
  data () {
    return {
    }
  },
  components: {
    appHeader,
    appSidebar,
    appFooter
  }
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
    height: 100%;
    min-height: 10.8rem;
    background: url('../../static/image/wrapBackground.png') no-repeat;
    background-size:cover;
    position:absolute;
}
.homeView .mainContainer {
  min-width: 1280px;
}
.appHeader{
  margin-top: 20px;
}
.appSidebarWrap {
  padding-top: 0px;
  height: 100vh;
}
.el-container {
  height: 100%;
}
.appMain {
  position: relative;
  padding-top: 96px;
  min-width: 1050px;
  /* background-image: url(../../static/img/logo-footer.png);
  background-repeat: no-repeat;
  background-position: 45% 95%; */
  background-color: #f9fafc;
}
.addBody{
  min-height: 100%;
  padding-bottom: 90px;
}
.el-main {
  width: calc(100% - 230px);
  transition: 0.3s linear;
  padding-left: 30px;
  padding-top: 27px;
}
/* @media (max-width: 1200px) {
  .el-main {
    min-width: 1200px;
    margin-left: 0;
    overflow: hidden;
  }
} */
</style>
