<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: source === 'platform' ? '/platformCourse' : '/course' }">课程</router-link>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="baseInfo_content classInfo" style="width: 1280px;">
      <p>基本信息</p><!--
      <div>
        <table class="field" style="margin-top:0;">
          <thead>
          <th v-for="(item,i) in firstHead" :key="i">{{item}}</th>
          </thead>
          <tbody>
          <td :title="course_detail.base_class_name">{{course_detail.base_class_name}}</td>
          <td>{{course_detail.course_type_name}}</td>
          <td>{{course_detail.subject_name}}</td>
          <td>{{source === 'platform' ? course_detail.year : ''}}</td>
          </tbody>
        </table>
        <table class="field" style="margin-top:0;">
          <thead>
          <th v-for="(item,i) in secondHead" :key="i">{{item}}</th>
          </thead>
          <tbody>
          <td>{{course_detail.grade_name}}</td>
          <td>{{course_detail.term_name}}</td>
          <td>{{course_detail.class_level_name || course_detail.class_type_name}}</td>
          <td></td>
          </tbody>
        </table>
      </div>-->
      <div>
        <span>课程名称</span>
        <p>{{course_detail.base_class_name}}</p>
      </div>
      <div>
        <span>课程类型</span>
        <p :title="course_detail.course_name">{{course_detail.course_type_name}}</p>
      </div>
      <div>
        <span>学科</span>
        <p>{{course_detail.subject_name}}</p>
      </div>
      <div v-if="source === 'platform'">
        <span>年份</span>
        <p>{{course_detail.year}}</p>
      </div>
      <div>
        <span>年级</span>
        <p>{{course_detail.grade_name}}</p>
      </div>
      <div>
        <span>学期</span>
        <p>{{course_detail.term_name}}</p>
      </div>
      <div>
        <span>班型</span>
        <p>{{course_detail.class_level_name || course_detail.class_type_name || '无'}}</p>
      </div>
      <div v-if="isCharge >= 0 && source !== 'platform' && false">
        <span>收费标准</span>
        <p v-if="course_detail && course_detail.charge_info">{{course_detail.charge_info.amount}}元/人/期</p>
        <p v-else>无</p>
      </div>
    </div>
    <div class="baseInfo_content">
      <p>讲次信息</p>
      <el-button class="cac-button-two addLessonBtn" size="mini" round @click="showAddLesson()">添加讲次</el-button>
      <el-table :data="lessonList">
        <el-table-column align="left" type="index" width="170" label="讲次">
          <template slot-scope="scope">
            <span>第 {{scope.$index + 1}} 讲</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="讲次名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.lesson_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="cac-button-two" round  @click="showAddLesson(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" class="cac-button-two" round  @click="deleteLesson(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="讲次名称" class="lessonDialog tipDialog" :visible.sync="showLesson" width="560px" top="38vh" append-to-body @close="clearShowLesson">
      <el-form size="mini" @submit.native.prevent :model="form" :rules="formRules" ref="form">
        <el-form-item prop="lesson_name">
          <el-input class="lesson_name_input" v-model.trim="form.lesson_name" placeholder="输入30字以内" :maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="cancel" class="cac-button-two cancel-button dialog_cancel_button" round>取 消</el-button>
        <el-button type="primary" size="small" @click="createLesson" class="cac-button-one conform-button dialog_confirm_button" round>确 定</el-button>
      </span>
    </el-dialog>
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
      secondHead: ['年级', '学期', '班型'],
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
      lessonList: [],
      showLesson: false,
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
      isCharge: authUtil.getUser().permissions.indexOf('enroll_charge')
    }
  },
  computed: {
    firstHead () {
      if (this.source === 'platform') {
        return ['课程名称', '课程类型', '学科', '年份']
      } else {
        return ['课程名称', '课程类型', '学科']
      }
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
    showAddLesson (row) {
      if (row) {
        this.form.lesson_name = row.lesson_name
        this.isEdit = true
        this.lesson_id = row.id
      } else {
        this.isEdit = false
        this.form.lesson_name = ''
        this.lesson_id = ''
      }
      this.showLesson = true
      // this.isEdit = false
      // this.lesson_id = ''
      // this.form.lesson_name = ''
      // var vm = this
      // setTimeout(function () {
      //   vm.$refs['form'].resetFields()
      // }, 10)
    },
    getData () {
      this.loading = true
      let params = {
        base_class_id: this.id,
        school_id: authUtil.getUser().school_id
      }
      let methodHeader = this.source === 'platform' ? 'platformCourse' : 'course'
      courseApi[methodHeader + 'Detail'](params).then(res => {
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
      courseApi[methodHeader + 'LessonList'](params).then(res => {
        this.loading = false
        if (res.ok) {
          this.lessonList = res.data
        }
      })
    },
    cancel () {
      this.form.lesson_name = ''
      this.showLesson = false
    },
    createLesson () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let params = {}
          // 课程类型
          params.lesson_type = 'lesson'
          // 课程id
          params.base_class_id = this.id
          // 讲次名称
          params.lesson_name = this.form.lesson_name
          if (this.isEdit) {
            // 修改讲次
            params.lesson_id = this.lesson_id
            if (this.source === 'platform') {
              courseApi.editLesson(params).then(res => {
                if (res.ok) {
                  this.showLesson = false
                  this.getData()
                }
                loading.close()
              })
            } else {
              courseApi.editFaceLesson(params).then(res => {
                if (res.ok) {
                  this.showLesson = false
                  this.getData()
                }
                loading.close()
              })
            }
          } else {
            // 创建讲次
            if (this.source === 'platform') {
              courseApi.createLesson(params).then(res => {
                if (res.ok) {
                  this.showLesson = false
                  this.getData()
                }
                loading.close()
              })
            } else {
              courseApi.addFaceLesson(params).then(res => {
                if (res.ok) {
                  this.showLesson = false
                  this.getData()
                }
                loading.close()
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteLesson (row) {
      this.$confirm('此操作将永久删除该讲次, 是否继续?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        let params = {
          lesson_id: row.id
        }
        if (this.source === 'platform') {
          courseApi.deleteLesson(params).then(res => {
            if (res.ok) {
              this.getData()
              this.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
            }
          })
        } else {
          courseApi.deleteFaceLesson(params).then(res => {
            if (res.ok) {
              this.getData()
              this.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    clearShowLesson () {
      this.form.lesson_name = ''
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
  }
  .classInfo {
    &>div {
      display: inline-block;
      width: 280px;
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
