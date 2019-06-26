<!-- 底部 -->
<template>
  <div id='footerpage' class="footer">
    <!--<img src="../../static/img/logo-footer.png">-->
    <!--<div class="line"></div>-->
    ©2019 北京微思优教机器人科技有限公司. All Rights Reserved.
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
.footer{
  color:white;
  height: 50px;
  font-size: 16px;
  padding-top: 30px;
  /* position: fixed;
  bottom: 0; */
  width:100%;
  position: relative;
  /* margin-top: -90px; */
}
.footer img{
  vertical-align: middle;
}
.line{
  display: inline-block;
  width: 2px;
  height: 24px;
  background-color: #e0e3e7;
  margin: 0 20px;
  vertical-align: middle;
}
.copyright{
  color: #a2a5b0;
  display: inline-block;
}
</style>
