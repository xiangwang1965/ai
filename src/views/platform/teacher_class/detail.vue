<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/platformClass' }">主讲班级</router-link>
        <el-breadcrumb-item>班级详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="baseInfo_content">
      <p>基本信息</p>
      <el-form
        size="mini"
        inline
        label-wodth="100"
        label-position="top">
        <el-form-item label="班级名称">
          <span>{{classDetail.class_name}}</span>
        </el-form-item>
        <el-form-item label="课程名称">
          <span>{{classDetail.base_class_name}}</span>
        </el-form-item>
        <el-form-item label="直播间名称">
          <span>{{classDetail.live_room.name}}</span>
        </el-form-item>
        <el-form-item label="课程类型">
          <span>{{classDetail.course_type == 1 ? '长期班' : classDetail.course_type == 2 ? '短期班' : '体验课'}}</span>
        </el-form-item>
        <el-form-item label="主讲老师">
          <span>{{classDetail.teacher_name}}</span>
        </el-form-item>
        <el-form-item label="主讲老师电话">
          <span>{{classDetail.telephone}}</span>
        </el-form-item>
        <el-form-item label="直播间详细地址">
          <span>{{classDetail.live_room.address}}</span>
        </el-form-item>
      </el-form>
      <!-- <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">班级名称：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.class_name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">课程类型：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div v-if="classDetail.course_type==1" class="grid-content bg-purple-light">长期班</div>
          <div v-if="classDetail.course_type==2" class="grid-content bg-purple-light">短期班</div>
          <div v-if="classDetail.course_type==3" class="grid-content bg-purple-light">体验课</div>
        </el-col>
      </el-row> -->
      <!--<el-row :gutter="10">-->
        <!--<el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">-->
          <!--<div class="grid-content bg-purple">教学产品：</div>-->
        <!--</el-col>-->
        <!--<el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">-->
          <!--<div class="grid-content bg-purple-light" v-html="classDetail.product_name"></div>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!-- <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">课程名称：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.base_class_name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">主讲老师：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.teacher_name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">直播间名称：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.live_room.name"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">直播间详细地址：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.live_room.address"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="classDetail.number>=0">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">期数：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.number"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="classDetail.pre_class_name">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="grid-content bg-purple">原班级：</div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="grid-content bg-purple-light" v-html="classDetail.pre_class_name"></div>
        </el-col>
      </el-row> -->
    </div>
    <div class="baseInfo_content">
      <p>讲次信息</p>
      <el-table :data="course_list" style="width: 100%;text-align: center;">
        <el-table-column align="left" prop="index" label="讲次" width="170" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>第{{scope.$index + 1}}讲</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lesson_name" label="讲次名称" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column align="center" prop="date" label="上课日期" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column align="center" prop="index" label="上课时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="block">
              <span>{{scope.row.date}}</span> <span>{{scope.row.time_span}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import teacherClassApi from '@/services/platform/teacher_class'

  export default {
    data () {
      return {
        id: this.$route.query.class_id,
        classDetail: {
          class_name: '',
          live_room: {}
        },
        course_list: []
      }
    },
    components: {},
    created () {
      this.getData()
    },
    beforeRouteLeave (to, from, next) {
      this.$destroy()
      next()
    },
    methods: {
      getData () {
        let params = {
          class_id: this.id
        }
        teacherClassApi.classDetail(params).then(res => {
          if (res.ok) {
            this.classDetail = res.data
            this.course_list = res.data.lessons
          }
        })
      }
    }
  }
</script>
<style lang="less">
.classroomView {

  .baseInfo_content {
    &>p {
      display: block;
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
    .el-form {
      width: 880px;
      .el-form-item {
        width: 180px;
        margin-right: 30px;
        .el-form-item__label {
          color: #7A808D;
        }
        .el-form-item__content {
          width: 100%;
          line-height: 16px;
        }
      }
    }
  }
  /* 基本信息 */
  .baseInfo_content {
    height: auto;
  }

  .field:first-child {
    margin-top: 0px;
  }

  .baseInfo_content .field td,
  .baseInfo_content .field th {
    width: 25%;
  }

  .baseInfo_content .field td {
    padding-bottom: 0;
  }

  .info h4 {
    float: left;
    font-size: 18px;
  }

  .info .el-table .cell {
    text-align: center;
  }

  .studentInfo .el-input {
    width: 200px;
  }
}

</style>
