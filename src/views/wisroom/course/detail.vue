<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/wisroomCourse' }">课程</router-link>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="baseInfo_content">
      <p>基本信息</p>
      <div>
        <table class="field" style="margin-top:0;">
          <thead>
          <th v-for="(item,i) in firstHead" :key="i">{{item}}</th>
          </thead>
          <tbody>
          <td :title="course_detail.base_class_name">{{course_detail.base_class_name}}</td>
          <td>{{course_detail.wisroom_courseware_name}}</td>
          <td>{{course_detail.subject_name}}</td>
          <td>{{course_detail.term_name}}</td>
          </tbody>
        </table>
        <table class="field" style="margin-top:0;">
          <thead>
          <th v-for="(item,i) in secondHead" :key="i">{{item}}</th>
          </thead>
          <tbody>
          <td>{{course_detail.course_type_name}}</td>
          <td>{{course_detail.grade_name}}</td>
          <td>{{course_detail.class_level_name || course_detail.class_type_name || '无'}}</td>
          <td>
            <span v-if="isCharge >= 0 && course_detail.charge_info">{{course_detail.charge_info.amount + '元/人/期'}}</span>
            <span v-else></span>
          </td>
          </tbody>
        </table>
      </div>
    </div>
    <div class="baseInfo_content">
      <p>讲次信息</p>
      <el-table :data="lessons" v-loading="lessonLoading">
        <el-table-column align="left" type="index" width="150" label="讲次">
          <template slot-scope="scope">
            <span>第 {{scope.$index + 1}} 讲</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="讲次名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.lesson_name}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import courseApi from '@/services/platform/course'
import authUtil from '@/services/auth/utils'
import receptionApi from '@/services/reception'
export default {
  props: ['source'],
  data () {
    return {
      loading: false,
      lessonLoading: false,
      firstHead: ['课程名称', '课件名称', '学科', '学期'],
      id: this.$route.query.base_class_id,
      course_detail: {
        base_class_name: '',
        product_name: '',
        course_type_name: '',
        year: '',
        subject_name: '',
        grade_name: '',
        term_name: '',
        class_level_name: '',
        edition_name: ''
      },
      form: {
        lesson_name: ''
      },
      formRules: {
        lesson_name: [
          {required: true, message: '请输入讲次名称', trigger: 'blur'}
        ]
      },
      isEdit: false,
      lesson_id: '',
      classTypeList: [],
      lessons: [],
      isCharge: authUtil.getUser().permissions.indexOf('enroll_charge')
    }
  },
  computed: {
    secondHead () {
      if (this.isCharge >= 0) {
        return ['课程类型', '年级', '班型', '收费标准']
      }
      return ['课程类型', '年级', '班型', '']
    }
  },
  components: {},
  created () {
    receptionApi.getOptionsList().then(res => {
      this.classTypeList = res.data.class_type
      this.getData()
    })
    this.$nextTick(() => {
    })
  },
  methods: {
    getData () {
      this.loading = true
      this.lessonsLoading = true
      let params = {
        base_class_id: this.id,
        school_id: authUtil.getUser().school_id
      }
      courseApi.courseDetail(params).then(res => {
        this.loading = false
        if (res.ok) {
          res.data.map((v, i) => {
            this.classTypeList.map((o, j) => {
              if (v.class_type_id === o.class_level_id) {
                v.class_level_name = o.class_level_name
              }
            })
          })
          this.course_detail = res.data[0]
        }
      })
      receptionApi.getLessonList({base_class_id: this.id}).then(res => {
        if (res.ok) {
          this.lessonLoading = false
          this.lessons = res.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.classroomView {
  .basicInfo {
    float: left;
    margin: 20px 0;
    font-size: 18px;
    color: #333;
  }
  .addStu {
    float: right;
  }
  /* 基本信息 */
  .baseInfo_content {
    margin-top: 0;
    height: auto;
    &>p {
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
    .addLessonBtn {
      float: right;
      margin-top: -50px;
    }
    thead {
      td,th {
        width: 200px;
      }
      th {
        font-size: 12px;
      }
      td {
        font-size: 14px;
      }
      .field{
        &:first-child{
          margin-top: 0px;
        }
        td {
          padding-bottom: 0;
        }
      }
    }
  }
  .info h4 {
    float: left;
    font-size: 18px;
  }
  .studentInfo .el-input {
    width: 200px;
  }
  .title_table{
    padding-bottom: 16px;
    display: flex;
    justify-content:space-between;
    align-items: center;
  }
  .title_table_text{
    text-align: left;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
}
</style>
