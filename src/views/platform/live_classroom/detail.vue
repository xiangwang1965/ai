<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/liveClassroom' }">直播间管理</router-link>
        <el-breadcrumb-item>直播间详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="liveClassroomContent">
      <p>基本信息</p>
      <div class="liveClassroomInfo">
        <div>
          <span class="title">直播间名称</span>
          <span>{{LiveRoom_detail.name}}</span>
        </div>
        <div>
          <span class="title">状态</span>
          <span>{{LiveRoom_detail.is_active==0?'已禁用':'已启用'}}</span>
        </div>
        <div>
          <span class="title">省/市/区</span>
          <span>{{LiveRoom_detail.province_name+'/'+LiveRoom_detail.city_name+'/'+LiveRoom_detail.area_name}}</span>
        </div>
        <br>
        <div>
          <span class="title">直播间描述</span>
          <span>{{LiveRoom_detail.describe?LiveRoom_detail.describe:'无'}}</span>
        </div>
        <div>
          <span class="title">详细地址</span>
          <span>{{LiveRoom_detail.address}}</span>
        </div>
      </div>
      <!-- <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">直播间名称：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.name"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">省/市/区：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="LiveRoom_detail.province_name+'/'+LiveRoom_detail.city_name+'/'+LiveRoom_detail.area_name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">状态：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.is_active==0?'已禁用':'已启用'"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">详细地址：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.address"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">直播间描述：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.describe?LiveRoom_detail.describe:'无'"></div></el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'

export default {
  data () {
    return {
      loading: false,
      id: this.$route.query.id,
      LiveRoom_detail: {
        room_id: '',
        name: '',
        province_name: '',
        city_name: '',
        area_name: '',
        is_active: '',
        address: '',
        describe: ''
      }
    }
  },
  components: {},
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      let params = {
        room_id: this.$route.query.room_id
      }
      teacherClassApi.LiveRoomDetail(params).then(res => {
        this.loading = false
        if (res.ok) {
          this.LiveRoom_detail = res.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.classroomView {
  text-align: left;
  .liveClassroomContent {
    height: auto;
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-bottom: 30px;
      margin-top: 30px;
    }
    .liveClassroomInfo {
      &>div {
        display: inline-block;
        vertical-align: top;
        width: 300px;
        margin-right: 10px;
        margin-bottom: 20px;
        span {
          display: block;
          font-size: 13px;
          line-height: 20px;
        }
        .title {
          font-size: 12px;
          color: #7A808D;
        }
      }
    }
  }
}
</style>
