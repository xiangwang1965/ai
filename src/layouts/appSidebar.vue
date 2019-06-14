<template>
  <div class="appSideWrap">
    <div class="userInfo">
      <div class="photo"></div>
      <p class="userName">某某某机构</p>
      <p class="userID">ID：00001</p>
    </div>
    <el-aside class="menu">
      <el-menu
        ref="sideBar"
        mode="vertical"
        :default-active="defaultActive"
        text-color="#FFFFFF"
        text-align="left"
        :router="true"
        unique-opened
      >
        <el-menu-item
          v-for="item in liveList"
          style="background-color:transparent;"
          @click.stop.native="go(item)"
          :key="item.path"
          :index="item.path"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}{{item.hidden}}</span>
          </template>
        </el-menu-item>
      </el-menu>
      <!-- 侧栏下部纹理 -->
    </el-aside>
    <div class="contact">
      <p>联系客服</p>
    </div>
    <div class="btn_124 out_login">退出登录</div>
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
      logoImg: require("../../static/img/logo-white.png"),
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
  width: 3.62rem;
  height: 100%;
  background-image: url("../../static/image/contentLeftBg.png");
  background-size: 100%;
  position: relative;
  .userInfo {
    margin: 0.83rem 0 0 0.64rem;
    text-align: left;
    padding-left: 0.5rem;
    .photo {
      width: 0.68rem;
      height: 0.68rem;
      border-radius: 100%;
      border: 2px solid #fff;
    }
    .userName {
      padding-top: 0.11rem;
      font-size: 0.2rem;
      color: #ffffff;
    }
    .userID {
      font-size: 0.16rem;
      color: #ffffff;
      opacity: 0.8;
    }
  }
  .menu {
    margin: 0.4rem 0 0 0.53rem;
    padding-bottom: 0.16rem;
    background-color: transparent;
    .el-menu {
      width: 100%;
      border-right: none;
      height: 100%;
      background-color: transparent !important;
      box-shadow: none;
      .el-menu-item {
        font-size: 0.18rem;
        color: #ffffff;
        cursor: pointer;
        background-color: transparent !important;
        border-left: 1px solid transparent;
        padding-left: 0px;
        border-radius: 25px 0 0 25px;
        text-align: left;
      }
      .el-menu-item.is-active {
        border-left: 1px solid #fff;
        color: #fff !important;
        opacity: 1;
        border-radius: 25px 0 0 25px;
      }
      li {
        border-bottom: none;
      }
    }
  }
  .contact {
    margin: 0 0 0 0.53rem;
    border-top: 0.005rem solid #fff;
    width: 2.5rem;
    text-align: center;
    p {
    //   padding-left: 0.1rem;
      color: #fff;
      font-size: 0.18rem;
      padding-top: 0.14rem;
      cursor: pointer;
      margin-left:0.4rem;
    }
  }
    .out_login {
        position: absolute;
        border: 1px solid #fff;
        bottom: 0.42rem;
        left: 1.19rem;

    }
}
</style>
