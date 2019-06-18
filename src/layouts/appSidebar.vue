<template>
  <div class="appSideWrap">
    <div class="content_left">
      <div class="teacher_box">
        <img :src="logoImg" alt class="photo">
        <p class="name">{{tInfo.name}}</p>
        <p class="id">ID:{{tInfo.id}}</p>
          <el-popover
              placement="right"
              trigger="hover"
              width="300">
              <div class="popover_box">
                  <p class="popover_title">
                      <img src="../../static/image/my_class_blue.png">
                      <span>学习进度</span>
                  </p>
                  <div class="clearfix"></div>
                  <div class="popover_content border">
                      <p class="title">我的学习等级</p>
                      <div class="user_level">
                          <div class="level_list">
                              <span v-for="n in 10" :key="n" :class="{ active: n <= processAndLevel.userLever }"></span>
                          </div>
                          <div class="level_btn">Level{{processAndLevel.userLever}}</div>
                      </div>
                      <div class="clearfix"></div>
                  </div>
                  <div class="popover_content">
                      <p class="title">我的学习进度百分比</p>
                      <div class="percent">
                          <div class="percent_item">
                              <el-progress type="circle" :width="114" :percentage="processAndLevel.nowLeverPercent"></el-progress>
                              <div class="percent_title">当前Levle进度百分比</div>
                          </div>
                          <div class="percent_item">
                              <el-progress type="circle" :width="114" :percentage="processAndLevel.beatLearnNumPercent"></el-progress>
                              <div class="percent_title">打败学习人数百分比</div>
                          </div>
                      </div>
                  </div>
              </div>
              <el-button class="grade" slot="reference">Level{{processAndLevel.userLever}}</el-button>
          </el-popover>

        <ul class="entry_wrap">
          <router-link to="/class" tag="li"><i class="icon_class"></i>我的课程</router-link>
          <router-link to="/report" tag="li"><i class="icon_report"></i>学习报告</router-link>
          <router-link to="/overview" tag="li"><i class="icon_overview"></i>课程总览</router-link>
          <router-link to="/order" tag="li"><i class="icon_order"></i>我的订单</router-link>
        </ul>
        <div class="btn_124 out_login" @click="logout">退出登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import authApi from "@/services/auth";
import studentApi from "@/services/student";
import reportApi from "@/services/report";
import eventHub from "@/utils/eventHub";
import { IMS_URL } from "@/config";
export default {
  data() {
    return {
      logoImg: require("../../static/image/person_background.png"),
      userInfo: {},
      tInfo: {},
      processAndLevel: {}
    };
  },
  created() {
    this.getUser();
    this.getProcessAndLevel();
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    getUser() {
      this.userInfo = authUtils.getUser();

      if (this.userInfo.id) {
        this.getUserInfo(this.userInfo.id);
      } else {
        this.$message({
          message: "该学生不存在，请确认用户身份",
          type: "error"
        });
      }
    },

    logout() {
      authApi.logout().then(res => {
        this.$router.push({
          name: "auth",
          query:{
              showLogin:true
          }
        });
      });
    },

    getUserInfo(id) {
      studentApi
        .getUserInfo({
          id: id
        })
        .then(res => {
          if (res.code === "001") {
            this.tInfo = res.data;
          }
        });
    },

      getProcessAndLevel() {
          reportApi.getProcessAndLevel()
              .then(res => {
                  if (res.code === "001") {
                      this.processAndLevel = res.data;
                      this.processAndLevel.beatLearnNumPercent = parseInt(this.processAndLevel.beatLearnNumPercent, 10);
                      this.processAndLevel.nowLeverPercent = parseInt(this.processAndLevel.nowLeverPercent, 10);
                  }
              });
      }
  }
};
</script>

<style lang="less" scoped>
.appSideWrap {
  width: 4.5rem;
  height: 100%;
  background: url("../../static/image/contentLeftBg.png");
  background-size: 100%;
  position: relative;
    .grade {
        margin: 0;
        padding: 0;
        cursor: pointer;
        border: none;
        height: .3rem;
        width: .76rem;
        line-height: .3rem;
        color: #fff;
        font-size: .16rem;
        &:hover{
            color: #fff;
        }
    }
  .out_login {
    position: absolute;
    bottom: 0.84rem;
    left: 50%;
    width: 1.24rem;
    margin-left: -0.62rem;

    border: 1px solid #fff;
  }

  .entry_wrap {
    width: 3.04rem;
    margin: 0.3rem auto 0;

    li {
        position: relative;
      cursor: pointer;
      height: 0.58rem;
      margin-bottom: 0.13rem;

      line-height: 0.58rem;
      font-size: 0.18rem;
      color: #fff;
      letter-spacing: 0.02rem;
      text-align: center;
        border: 1px solid #fff;
      border-radius: 29px;
        i {
            position: absolute;
            display: inline-block;
            top: 50%;
            left: .3rem;
            margin-top: -.18rem;
            width: .36rem;
            height: .36rem;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            &.icon_class {
                background-image: url("../../static/img/icon_class.png");
            }
            &.icon_report {
                background-image: url("../../static/img/icon_report.png");
            }
            &.icon_overview {
                background-image: url("../../static/img/icon_overview.png");
            }
            &.icon_order {
                background-image: url("../../static/img/icon_order.png");
            }
        }
    }

    li.router-link-active {
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      border-radius: 29px;
    }
  }
}
.popover_box {
    .popover_title {
        color: #4592fe;
        font-size: .16rem;
        line-height: .26rem;
        vertical-align: middle;
        img {
            float: left;
            margin-right: .1rem;
            width: .26rem;
            height: .26rem;
        }
    }
    .popover_content{
        margin: .2rem;
        &.border {
            border-bottom: 1px solid #979797;
        }
        .title {
            margin-bottom: .16rem;
            font-size: .14rem;
            color: #aba8a8;
            letter-spacing: .01rem;
        }
        .user_level {
            height: .46rem;
            line-height: .46rem;
            .level_list {
                display: inline-block;
                float: left;
                span{
                    margin-right: .1rem;
                    display: inline-block;
                    height: .46rem;
                    width: .08rem;
                    border-radius: .06rem;
                    background-color: #eaeaea;
                    &.active {
                        background-image: linear-gradient(-180deg, #FFE289 24%, #FFC151 100%);
                    }
                }
            }
            .level_btn {
                float: left;
                padding: 0 .2rem;
                display: inline-block;
                border-radius: .23rem;
                font-size: .14rem;
                color: #fff;
                background-image: linear-gradient(-180deg, #FFE289 0%, #FFC151 100%);
            }
        }
        .percent {
            display: flex;
            .percent_item {
                &:nth-child(1){
                    margin-right: .3rem;
                }
                .percent_title {
                    font-size: .12rem;
                    color: #5c5c5c;
                }
            }
        }
    }
}
</style>
