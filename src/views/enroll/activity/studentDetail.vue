<template>
  <div class="student-detail-wrap">
    <div class="cac-bread-bar">
      <span class="bread-bar" @click="handleBack">活动详情</span>
      <el-breadcrumb separator="/">

        <!-- <router-link :to="{ path: '/activityList/attendanceList' }">活动详情</router-link> -->
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-button type="primary">导出全部</el-button> -->
    </div>
    <div class="basic-info">
      <h5>基本信息</h5>
      <p class="basic-info-title">{{activity.activity_name}}</p>
      <div class="basic-info-option">
        <div class="basic-info-option-item">
          <div class="basic-info-option-item-first">学生</div>
          <div>{{activity.student_nickname || '无'}}</div>
        </div>
        <div class="basic-info-option-item">
          <div class="basic-info-option-item-first">活动时间</div>
          <div>{{activity.time || '无'}}</div>
        </div>
        <div class="basic-info-option-item">
          <div class="basic-info-option-item-first">手机号</div>
          <div>{{activity.student_tel || '无'}}</div>
        </div>
      </div>
    </div>
    <div class="correct-info">
      <h5>批改详情</h5>
      <div class="correct-info-list">
        <ul>
          <li class="list-item" v-for="item in studentDetailList" :key="item.index">
            <div class="list-item-avatar">
              <div>{{'DAY ' + item.index}}</div>
              <img v-if="item.is_checked" :src="item.pic_checked" alt="" style="z-index:10">
              <img v-else :src="item.pic" alt="" style="z-index:10">
            </div>
            <div style="padding:20px;">
              <p class="list-item-desc">批改评语</p>
              <div class="list-item-remark">
                {{item.remark}}
              </div>
              <div class="list-item-time">
                <p class="list-item-time-first"><span>{{item.submit_time}}</span> 提交</p>
                <!-- <p v-if="item.check_time"><span>{{item.check_time}}</span> 批改</p> -->
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="studentDetailList.length===0" class="empty-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
import activityApi from '@/services/enroll/activity'

export default {
  data () {
    return {
      breadcrumbTitle: '学生详情',
      activity: {},
      studentDetailList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getData()
    },
    // 获取学生详情数据
    getData () {
      let params = {}

      params.student_id = this.$route.query.sId
      params.activity_id = this.$route.query.aId
      activityApi.getAttendanceStudent(params).then((res) => {
        if (res.status_code === 200) {
          this.activity = res.data.activity
          this.studentDetailList = res.data.days
        }
      })
    },
    // 返回上一级
    handleBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less">
.student-detail-wrap {
  .searchBar {
    margin-top: 20px;
    text-align: left;
  }
  .el-input {
    width: 200px;
  }
  .searchBar__create {
    float: right;
    margin-top: -40px;
  }
  .consult-list-Table {
    margin-top: 20px;
  }
  .userTable__page {
    margin-top: 30px;
  }
  .userTable__edit i {
    font-size: 20px;
    transform: translateX(10px);
    cursor: pointer;
    margin: 0 5px;
  }
  .searchBar__button {
    float: right;
    margin-left: 15px;
  }
  .search__name {
    width: 204px;
    float: right;
    border-radius: 16px;
  }
  .basic-info {
    text-align: left;

    h5 {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 30px;
    }
    .basic-info-title {
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 20px;
    }
    .basic-info-option {
      display: flex;
      font-size: 12px;

      .basic-info-option-item {
        margin-right: 60px;

        .basic-info-option-item-first {
          color: #7A808D;
          padding-bottom: 6px;
        }
      }
    }
  }
  .correct-info {
    text-align: left;

    h5 {
      font-size: 20px;
      font-weight: bold;
      padding: 60px 0 20px 0;
    }
    .correct-info-list {
      ul {
        overflow: hidden;
        // column-count: 4;
        // display: flex;

        .list-item {
          width: 23.4%;
          margin-right: 20px;
          padding-bottom: 10px;
          border-radius: 2px;
          float: left;
          background:rgba(255,255,255,1);

          // break-inside: avoid;

          .list-item-avatar {
            width: 100%;
            height: 200px;
            background: lightgray;
            overflow: hidden;
            position: relative;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;

            img {
              height: 200px;
              width: 100%;
            }
            > div {
              position: absolute;
              width: 54px;
              height: 22px;
              top: 0;
              left: 0;
              background:rgba(60,117,246,1);
              border-radius: 0px 0px 14px 0px;
              opacity:0.8;
              color: #fff;
              font-size: 12px;
              line-height: 22px;
              text-align: center;
              font-weight: 600;
            }
          }
          .list-item-desc {
            font-weight: bold;
            padding-bottom: 10px;
          }
          .list-item-remark {
            color: #3E434C;
            word-wrap: break-word;
            height: 160px;
            overflow: auto;
          }
          .list-item-time {
            color: #7A808D;
            padding-top: 20px;
            font-size: 12px;

            p {
              span {
                display: inline-block;
                width: 100px;
              }
            }
            .list-item-time-first {
              padding-bottom: 8px;
            }
          }
        }
        li:nth-child(4n) {
          margin-right: 0;
        }
      }

    }
  }
  .bread-bar{
    color: #7e8c8d;
    cursor: pointer;
    padding-bottom: 20px;

    &:before {
      content: '';
      display: inline-block;
      height: 11px;
      width: 16px;
      background-image: url(../../../../static/img/back.png);
      background-size: 16px 11px;
      margin-right: 5px;
    }
  }
  .empty-data {
    height: 200px;
    text-align: center;
    line-height: 200px;
    color: #909399;
  }
}
</style>
