<template>
  <div class="platformTeacherView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/platformTeacher' }">主讲管理</router-link>
        <el-breadcrumb-item>主讲详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="teacherInfo_content">
      <p>基本信息</p>
      <div class="teacherInfo">
        <img :src="teacher_detail.avatar || defaultAvatar" alt="">
        <el-form label-position="top" inline size="mini">
          <el-form-item label="姓名">
            <span>{{teacher_detail.name}}</span>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{teacher_detail.gender === 3 ? '无' : teacher_detail.gender === 1 ? '男' : '女'}}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{teacher_detail.telephone}}</span>
          </el-form-item>
          <el-form-item label="所属校区">
            <span>{{teacher_detail.campus_name}}</span>
          </el-form-item>
        </el-form>
      </div>
      <p>角色管理</p>
      <div class="roleContent">
        <span>管辖校区</span>
        <div>
          {{teacher_detail.role_campus_name}}
        </div>
      </div>
      <!-- <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">主讲头像：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <img class="avatar" :src="teacher_detail.avatar"/>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">主讲姓名：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.name"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">性别：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.gender==1?'男':'女'"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">学历：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.education"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">手机号：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.telephone"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">毕业院校：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.university"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">状态：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.is_active==0?'已禁用':'已启用'"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">创建日期：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.created_at"></div></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"><div class="grid-content bg-purple">备注：</div></el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"><div class="grid-content bg-purple-light" v-html="teacher_detail.comment?teacher_detail.comment:'无'"></div></el-col>
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
      teacher_detail: {
        name: '',
        avatar: '',
        telephone: '',
        is_active: '',
        created_at: '',
        comment: ''
      },
      defaultAvatar: '../../static/img/default_avatar.png'
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
        live_teacher_id: this.$route.query.live_teacher_id
      }
      teacherClassApi.LiveTeacherDetail(params).then(res => {
        this.loading = false
        if (res.ok) {
          let name = res.data.role_campus_name.trim().split(' ').join('、')
          res.data.role_campus_name = name
          this.teacher_detail = res.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.platformTeacherView {
  text-align: left;
  .teacherInfo_content {
    &>p {
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      font-weight: bold;
      margin: 30px 0 20px;
    }
    .teacherInfo {
      img {
        float: left;
        width: 100px;
        height: 99px;
        margin-right: 20px;
      }
      .el-form {
        display: inline-block;
        width: 600px;
        .el-form-item {
          width: 275px;
          margin-right: 20px;
          margin-bottom: 10px;
          .el-form-item__label {
            height: 20px;
            font-size: 12px;
            color: #7A808D;
            padding-bottom: 0;
          }
        }
      }
    }
    .roleContent {
      &>span {
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: #7A808D;
      }
    }
  }
  //  .baseInfo_content.el-row{
  //   height: auto;
  // }
  //  .avatar{
  //   display: flex;
  //   width: 150px;
  //   height: 150px;
  // }
  // .el-row{
  //   font-size: 18px;
  //   margin-top: 10px;
  // }
  // .grid-content{
  // }
  // .bg-purple{
  //   text-align: right;
  // }
  // .bg-purple-light{
  //   text-align: left;
  // }
  // .grade_row{
  //   display: flex;
  //   margin-bottom: 5px;
  // }
  // .grade_row>:first-child{
  //   margin-right: 10px;
  //   font-weight: bold;
  // }
  // .grade_row>:last-child>span{
  //   margin-right: 10px;
  //   font-size: 18px;
  // }
  // .base_class_row{
  //   display: inline-block;
  //   margin-right: 15px;
  //   cursor: pointer;
  //   margin-bottom: 10px;
  //   width: 45%;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }
  // /* 基本信息 */
  // .baseInfo_content{
  //   height: auto;
  // }
}
</style>
