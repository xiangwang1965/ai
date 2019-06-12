<template>
  <div class="appSideWrap">
    <div class="content_left">
      <div class="teacher_box">
        <img :src="logoImg" alt class="photo">
        <p class="name">李雷</p>
        <p class="id">ID:00001</p>
        <span class="grade">副教授级</span>
        <p class="phone">联系电话：13333333333</p>
        <div class="statistics">
          <div class="item">
            <p class="num">0</p>
            <p class="txt">培训学生总数</p>
          </div>
          <div class="item">
            <p class="num">0</p>
            <p class="txt">培训课程总数</p>
          </div>
          <div class="item">
            <p class="num">0</p>
            <p class="txt">上课总天数</p>
          </div>
        </div>
        <!-- <div class="lesson_lock">
          <div class="lock_row lock_row_y">
            <div class="name">SKETCH</div>
            <div class="lock_level">
              <div class="lock_item unlock_y">
                <img src="../img/lock_yellow.png" alt=""  class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_yellow.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
            </div>
          </div>
          <div class="lock_row lock_row_b">
            <div class="name">SKETCH</div>
            <div class="lock_level">
              <div class="lock_item unlock_blue">
               <img src="../img/lock_blue.png" alt=""  class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_blue.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_blue.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
            </div>
          </div>
          <div class="lock_row lock_row_r">
            <div class="name">SKETCH</div>
            <div class="lock_level">
              <div class="lock_item unlock_red">
                <img src="../img/lock_red.png" alt=""  class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_red.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_red.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
            </div>
          </div>
          <div class="lock_row lock_row_p">
            <div class="name">SKETCH</div>
            <div class="lock_level">
              <div class="lock_item unlock_purple">
                <img src="../img/lock_purple.png" alt=""  class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_purple.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_purple.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
              <div class="lock_item">
                <img src="./img/lock_purple.png" alt class="lock">
                <p>Leverl 1</p>
                <p>初级编程</p>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="btn_124 out_login">退出登录</div>
    </div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import eventHub from "@/utils/eventHub";
import { IMS_URL } from "@/config";
export default {
  data() {
    return {
      menuList: [],
      logoImg: "../../static/image/person_background.png",
      liveList: [
        {
          path: "/class",
          title: "班级管理",
          icon: "icon-cac-reception",
          child: [{ path: "/", title: "classroom" }]
        },
        {
          path: "/teacher",
          title: "教师档案",
          icon: "icon-cac-platform"
        },
        {
          path: "/buy",
          title: "购买激活码",
          icon: "icon-cac-magic"
        },
        {
          path: "/course",
          title: "课程订单",
          icon: "icon-cac-wisroom"
        }
      ],
      routes: ["/class", "/teacher", "/buy", "/course", "/classroom"],
      is_live: 1,
      temp: []
    };
  },
  computed: {
    defaultActive() {
      let index = this.routes.indexOf("/" + this.$route.path.split("/")[1]);
      if (index !== -1) {
        return this.routes[index];
      }
      return "";
    },
    hasFaceTeaching() {
      let num = 0;
      this.faceTeachingBrand.map(v => {
        if (authUtils.getUser().brands.indexOf(v) >= 0) {
          num++;
        }
      });
      if (num === 0) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.temp = this.menuList;
    // this.getUser()
    //this.handleSelect(this.$route.path)
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    getUser() {
      // this.is_live = authUtils.getUser() && authUtils.getUser().is_live
      // this.menuList = this.is_live ? this.liveList : this.tofaceList
      // 判断是否是平台双师1或魔法双师0
      this.is_self_live =
        authUtils.getUser() && authUtils.getUser().is_self_live;
      this.menuList = [];
      this.menuList = this.is_self_live ? this.platformList : this.liveList;
      // 如果third_part存在，使用对应的第三方侧栏
      if (authUtils.getUser().third_part) {
        this.menuList = this[authUtils.getUser().third_part + "List"];
      }
    },
    go(item) {}
  }
};
</script>

<style lang="less" scoped>
.appSideWrap {
    width:4.5rem;
    height: 100%;
    background: url("../../static/image/contentLeftBg.png");
    background-size: 100%;
    position: relative;
    .out_login{
        position: absolute;
        border:1px solid #fff;
        bottom: 0.42rem;
        left:1.19rem;
    }

}
</style>
