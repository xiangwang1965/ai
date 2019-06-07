<template>
  <div class="classroomDetail">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/classroom' }">教室管理</router-link>
        <el-breadcrumb-item>教室详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="baseInfo_content">
      <p>基本信息</p>
      <div>
        <span>教室用途</span>
        <p>
          <span v-if="!$route.query.isAI">
            <span>{{!!LiveRoom_detail.normal_course ? '普通课程' : ''}}</span>
            <span v-if="!!LiveRoom_detail.normal_course && !!LiveRoom_detail.live_course">、</span>
            <span v-if="!!LiveRoom_detail.live_course">双师课程　威度ID: {{LiveRoom_detail.vd_id}}</span>
          </span>
          <span v-else>wisroom教室</span>
        </p>
      </div>
      <div>
        <span>教室名称</span>
        <p>
          {{LiveRoom_detail.name}}
        </p>
      </div>
      <div>
        <span>校区名称</span>
        <p>
          {{LiveRoom_detail.campus_name || '无'}}
        </p>
      </div>
      <div>
        <span>详细地址</span>
        <p>
          {{LiveRoom_detail.address}}
        </p>
      </div>
      <!-- <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">教室名称：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.name"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">省/市/区：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="LiveRoom_detail.province_name+'/'+LiveRoom_detail.city_name+'/'+LiveRoom_detail.area_name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">校区：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="LiveRoom_detail.campus_name"></div>
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
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">教室描述：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="LiveRoom_detail.describe?LiveRoom_detail.describe:'无'"></div></el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'
import classroomApi from '@/services/internal/classroom'
import wisroomApi from '@/services/wisroom'

export default {
  props: [ 'source' ],
  data () {
    return {
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
  beforeRouteLeave (to, from, next) {
    if (to.path === '/classroom') {
      to.meta.keepAlive = true
      this.$destroy()
    } else {
      to.meta.keepAlive = false
      this.$destroy()
    }
    next()
  },
  methods: {
    getData () {
      let params = {
        room_id: this.$route.query.room_id
      }
      if (this.$route.query.isAI) {
        wisroomApi.getClassroomList().then(res => {
          if (res.ok) {
            res.data.data.map((v, i) => {
              if (v.id === this.$route.query.room_id) {
                this.LiveRoom_detail = v
              }
            })
          }
        })
      } else {
        if (this.source === 'classroom') {
          classroomApi.getClassroomDetail(params).then(res => {
            if (res.ok) {
              this.LiveRoom_detail = res.data
            }
          })
        } else {
          teacherClassApi.LiveRoomDetail(params).then(res => {
            if (res.ok) {
              this.LiveRoom_detail = res.data
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="less">
.classroomDetail {
  text-align: left;
  .baseInfo_content {
    height: auto;
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-bottom: 30px;
    }
    &>div {
      display: inline-block;
      width: 300px;
      margin-bottom: 10px;
      vertical-align: top;
      &>span {
        font-size: 12px;
        color: #7A808D;
        line-height: 20px;
        margin-bottom: 10px;
      }
      &>p {
        color: #3E434C;
        line-height: 20px;
      }
    }
  }
  .baseInfo_content .el-row{
    height: auto;
  }
  .avatar{
    display: flex;
    width: 150px;
    height: 150px;
  }
  .el-row{
    font-size: 18px;
    margin-top: 10px;
  }
  .grid-content{
  }
  .bg-purple{
    text-align: right;
  }
  .bg-purple-light{
    text-align: left;
  }
  .grade_row{
    display: flex;
    margin-bottom: 5px;
  }
  .grade_row>:first-child{
    margin-right: 10px;
    font-weight: bold;
  }
  .grade_row>:last-child>span{
    margin-right: 10px;
    font-size: 18px;
  }
  .base_class_row{
    display: inline-block;
    margin-right: 15px;
    cursor: pointer;
    margin-bottom: 10px;
    width: 45%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
