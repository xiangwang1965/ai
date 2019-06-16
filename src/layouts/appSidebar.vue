<template>
  <div class="appSideWrap">
    <div class="content_left">
      <div class="teacher_box">
        <img :src="logoImg" alt class="photo">
        <p class="name">{{tInfo.name}}</p>
        <p class="id">ID:{{tInfo.id}}</p>
        <span class="grade">Level{{tInfo.level}}</span>

        <ul class="entry_wrap">
          <router-link to="/class" tag="li">我的课程</router-link>
          <router-link to="/report" tag="li">学习报告</router-link>
          <router-link to="/overview" tag="li">课程总览</router-link>
          <router-link to="/order" tag="li">我的订单</router-link>
        </ul>
        
        <div class="btn_124 out_login" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import authApi from "@/services/auth";
import teacherApi from '@/services/teacher'
import eventHub from "@/utils/eventHub";
import { IMS_URL } from "@/config";
export default {
  data() {
    return {
      logoImg: require("../../static/image/person_background.png"),
      userInfo:{},
      tInfo:{}
    };
  },
  created() {
    this.getUser()
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    getUser() {
      this.userInfo = authUtils.getUser();
      if (this.userInfo.id) {
          this.queryTeacherInfo(this.userInfo.id);
      } else {
          this.$message({
              message:'该学生不存在，请确认用户身份',
              type:'error'
          })
      }
    },

    logout() {
        authApi.logout().then(res=>{
            this.$router.push({
                name:'auth'
            })
        });
    },

    queryTeacherInfo(id) {
      var p = {};
      p.teacherId = id || "1";
      teacherApi.queryTeacherInfo(p).then(res => {
        if (res.code === "001") {
          this.tInfo = res.data;
        }
      });
    }
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
    bottom: 0.84rem;
    left: 50%;
    width: 1.24rem;
    margin-left: -.62rem;

    border: 1px solid #fff;
  }

  .entry_wrap {
    width: 3.04rem;
    margin: .3rem auto 0;

    li {
      height: .58rem;
      margin-bottom: .13rem;

      line-height: .58rem;
      font-size: .18rem;
      color: #fff;
      letter-spacing: .02rem;
      text-align: center;

      border-radius: 29px;
    }

    li.router-link-active {
      background: rgba(255,255,255,0.30);
      border: 1px solid #fff;
      border-radius: 29px;
    }
  }
}
</style>
