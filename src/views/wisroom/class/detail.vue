<template>
  <div class="wisroomClassDetail" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/wisroomClass' }">班级管理</router-link>
        <el-breadcrumb-item>班级详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="classDetailContent">
      <p>基本信息</p>
      <el-button type="primary" class="clearfix cac-button-two aaddStudentButton" style="marngin-top:0;" size="mini" :disabled="classDetail.scene_class_status===3 || classDetail.scene_class_status===4" round @click="addStudent">添加学生</el-button>
      <div class="detailInfo">
        <div>
          <span>课程名称</span>
          <span :title="classDetail.course_name">{{classDetail.course_name}}</span>
        </div>
        <div>
          <span>年级</span>
          <span v-for="grade in gradeList" :key="grade.id" v-if="grade.id === classDetail.grade_id" :title="grade.name">{{grade.name}}</span>
        </div>
        <div>
          <span>学期</span>
          <span v-for="term in termList" :key="term.id" v-if="term.id === classDetail.term_id" :title="term.name">{{term.name}}</span>
        </div>
        <div>
          <span>班级名称</span>
          <span>{{classDetail.class_name}}</span>
        </div>
        <div>
          <span>预招人数</span>
          <span>{{classDetail.advance_student_num}}</span>
        </div>
        <div>
          <span>老师</span>
          <span>{{classDetail.teacher_name}}</span>
        </div>
        <div>
          <span>校区</span>
          <span>{{classDetail.campus_name}}</span>
        </div>
        <!-- <div>
          <span>适用校区</span>
          <span>{{classDetail.apply_campus_name}}</span>
        </div> -->
        <div>
          <span>教室</span>
          <span>{{classDetail.room_name}}</span>
        </div>
        <div v-if="isCharge >= 0 && classDetail.charge_info && classDetail.charge_info.amount >= 0 && false">
          <span>收费标准</span>
          <span>{{classDetail.charge_info.amount}}元/人/期</span>
        </div>
      </div>
      <p>讲次信息</p>
      <div class="lessonInfo">
        <el-table :data="classDetail.lessons" max-height="390">
          <el-table-column align="left" label="讲次" width="150">
            <template slot-scope="scope">
              <span>第{{scope.$index + 1}}讲</span>
            </template>
          </el-table-column>
          <el-table-column label="讲次名称" prop="lesson_name" show-overflow-tooltip>

          </el-table-column>
          <el-table-column label="课件" prop="" align="center">
            <template slot-scope="scope">
              <!--<div class="courseware-status">-->
              <!--<el-button plain size="mini" class="status-exist" v-if="scope.row.coursewareStatus==2">已下载</el-button>-->
              <!--<el-button plain size="mini" class="status-noexist" v-if="scope.row.coursewareStatus==1">未下载</el-button>-->
              <!--<el-button plain size="mini" class="status-undetected" v-if="scope.row.coursewareStatus==0">未检测</el-button>-->
              <!--</div>-->
              <div class="courseware-status" v-if="scope.row.coursewareStatus==0">未检测<span class="go-down" @click="goDown(scope.row.class_id)">去下载</span></div>
              <div class="courseware-status" v-if="scope.row.coursewareStatus==1">不存在<span class="go-down" @click="goDown(scope.row.class_id)">去下载</span></div>
              <div class="courseware-status" v-if="scope.row.coursewareStatus==2">不完整<span class="go-down" @click="goDown(scope.row.class_id)">去下载</span></div>
              <div class="courseware-status" v-if="scope.row.coursewareStatus==3">已存在</div>
            </template>
          </el-table-column>
          <el-table-column label="上课时间" prop="lesson_date" width="300" align="center">

          </el-table-column>
          <el-table-column label="讲次学生数" prop="" width="300" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.students_count || 0}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p>在班学生</p>
      <el-input class="seaarchStudentInput" size="mini" placeholder="请输入学生姓名、手机号" @keyup.enter.native="searchStudent" v-model="classStudentKey">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchStudent"></i>
      </el-input>
      <div class="classStudent">
        <el-table :data="classDetail.students" max-height="390" v-loading="studentLoading">
          <el-table-column label="学生ID" align="left" prop="id" width="150"></el-table-column>
          <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="手机号" align="center" prop="telephone"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="primary" class="clearfix cac-button-two manage-button" size="mini" :disabled="classDetail.scene_class_status===3 || classDetail.scene_class_status===4" round @click="transferClass(scope.row)">转班</el-button>
              <el-button type="primary" class="clearfix cac-button-two manage-button" size="mini" :disabled="classDetail.scene_class_status===3 || classDetail.scene_class_status===4" round @click="quitClass(scope.row)">{{isCharge >= 0 ? '退费/班':'退班'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <addSingleStudentDialog v-if="isCharge >= 0 && false" ref="addStudentDialog" :config="addStudentConfig" :classId="$route.query.class_id" @select="addSingleStudentDone"></addSingleStudentDialog>
    <addStudentDialog v-else ref="addStudentDialog" :config="addStudentConfig" @close="addStudentDone" :class_name="classDetail.class_name" :class_id="classDetail.id"></addStudentDialog>
    <el-dialog class="changeClassDialog" title="班级选择" append-to-body :visible.sync="changeConfig.visible" @open="openInClassList(true)" width="1050px">
      <div>
        <!-- <el-select v-model="searchConfig.teach_type" clearable placeholder="授课方式">
          <el-option v-for="teachType in teachTypeList" :key="teachType.key" :value="teachType.key" :label="teachType.value"></el-option>
        </el-select> -->
        <el-select v-model="searchConfig.course_type_id" clearable placeholder="课程类型">
          <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.grade_id" clearable placeholder="年级">
          <el-option v-for="grade in gradeList" :key="grade.id" :value="grade.id" :label="grade.name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.class_type_id" clearable placeholder="班型">
          <el-option v-for="level in levelList" :key="level.id" :value="level.id" :label="level.name"></el-option>
        </el-select>
        <el-button type="primary" class="cac-button-one spc_filter" size="mini" round @click="openInClassList">筛选</el-button>
        <el-input class="searchInput" v-model="searchConfig.key" @keyup.enter.native="openInClassList" placeholder="课程、授课老师">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="openInClassList"></i>
        </el-input>
      </div>
      <el-table ref="classTable" :data="inClassList" @row-click="selectClass" :highlight-current-row="true">
        <el-table-column prop="class_name" label="班级名称" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="course_name" label="课程名称" show-overflow-tooltip>

        </el-table-column>
        <el-table-column label="人数">
          <template slot-scope="scope">
            <span>{{scope.row.students_count}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="course_type_name" label="课程类型" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="" label="年级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.grade && scope.row.grade !== 0">
              <span v-for="grade in gradeList" :key="grade.id" v-if="grade.id == scope.row.grade">{{grade.name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="班型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.class_type">
              <span v-for="level in levelList" :key="level.id" v-if="level.id == scope.row.class_type">{{level.name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher_name" label="授课老师" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="" label="授课方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>双师</span>
          </template>
        </el-table-column>
        <el-table-column prop="campus_name" label="校区" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="start_time" label="开课时间" width="220" align="center" show-overflow-tooltip>

        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="openInClassList"></pagination>
      <div slot="footer" class="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="changeClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import classroomApi from '@/services/classroom'
import receptionApi from '@/services/reception'
import authUtils from '@/services/auth/utils'
import addStudentDialog from '@/components/reception/addStudentDialog'
import addSingleStudentDialog from '@/components/reception/addSingleStudentDialog'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      loading: false,
      classDetail: {},
      classStudentKey: '',
      studentLoading: false,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      addStudentConfig: {
        visible: false
      },
      changeConfig: {
        visible: false
      },
      searchConfig: {
        // teach_type: '',
        course_type_id: '',
        grade_id: '',
        class_type_id: '',
        key: ''
      },
      inClassList: [],
      gradeList: [],
      levelList: [],
      termList: [],
      teachTypeList: [
        {
          key: 1,
          value: '双师'
        }, {
          key: 2,
          value: '面授'
        }
      ],
      courseTypeList: [],
      class_type: 2,
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      transferStudent: {
        src_class_id: '',
        tar_class_id: '',
        remark: ''
      },
      student: {},
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      canSubmit: true
    }
  },
  components: {
    addStudentDialog,
    addSingleStudentDialog,
    pagination
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getOptionsList()
      this.getClassDetail()
    },
    // 获取课件状态
    getCoursewareStatusDetail () {
      // 获取课件状态
      let params = {
        // 课程ID   教室ID  班级ID
        base_class_id: this.classDetail.scene_base_class_id,
        live_room_id: this.classDetail.wisroom_room_id,
        class_id: this.$route.query.class_id
      }
      classroomApi.getCoursewareStatus(params).then(res => {
        if (res.status_code === 200) {
          if (res.data.coursewareStatusList.length === 0) {
            this.classDetail.lessons.map((v, i) => {
              this.$set(v, 'coursewareStatus', 0)
            })
          } else {
            res.data.coursewareStatusList.map((item, i) => {
              this.$set(this.classDetail.lessons[i], 'coursewareStatus', item.status)
            })
          }
          // this.isShowCourseware = true
        }
      })
    },
    getOptionsList () {
      receptionApi.getOptionsByType({type: 4}).then(res => {
        this.courseTypeList = res.data.course_types
        this.termList = res.data.term
        this.gradeList = res.data.grade
        this.levelList = res.data.class_type
      })
    },
    getClassDetail () {
      this.loading = true
      this.studentLoading = true
      classroomApi.faceClassDetail({ class_id: this.$route.query.class_id }).then(res => {
        this.studentLoading = false
        this.loading = false
        if (res.status_code === 200) {
          res.data.apply_campus_name = res.data.apply_campus_name.split(' ').join('、')
          if (res.data.apply_campus_name[res.data.apply_campus_name.length - 1] === '、') {
            res.data.apply_campus_name = res.data.apply_campus_name.substring(0, res.data.apply_campus_name.length - 1)
          }
          this.classDetail = res.data
          // 获取课件状态
          this.getCoursewareStatusDetail()
        }
      })
    },
    searchStudent () {
      this.studentLoading = true
      let params = {
        class_id: this.$route.query.class_id,
        key: this.classStudentKey
      }
      classroomApi.faceClassDetail(params).then(res => {
        this.studentLoading = false
        if (res.status_code === 200) {
          this.classDetail.students = res.data.students
        }
      })
    },
    addStudent () {
      this.addStudentConfig.visible = true
      if (this.isCharge < 0) {
        this.$nextTick(() => {
          this.$refs.addStudentDialog.refresh()
        })
      }
    },
    // 报名缴费添加学生
    addSingleStudentDone (val) {
      this.$router.push({name: 'wisroomAddStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.$route.query.class_id, from: 'class'}})
    },
    addStudentDone (status) {
      if (status === 'success') {
        this.getClassDetail()
      }
    },
    transferClass (data) {
      this.student = data
      if (this.isCharge >= 0) {
        this.$router.push({ name: 'wisroomChangeClass', query: {detail: true, class_id: this.classDetail.id, student_id: data.id, from: 'class'} })
      } else {
        this.changeConfig.visible = true
      }
    },
    selectClass (row) {
      this.$refs.classTable.setCurrentRow(row, true)
      setTimeout(() => {
        this.$refs.classTable.setCurrentRow(row)
      }, 10)
      this.class_id = row.id
    },
    cancelSelect () {
      this.changeConfig.visible = false
    },
    openInClassList (status) {
      if (status) {
        this.changeConfig.visible = true
        if (typeof status === 'number') {
          this.pageConfig.page = status
        }
        let params = {
          student_id: this.student.id,
          class_id: this.classDetail.id,
          page: this.pageConfig.page,
          per_page: this.pageConfig.per_page
        }
        if (this.searchConfig.course_type_id !== '') {
          params.course_type_id = this.searchConfig.course_type_id
        }
        if (this.searchConfig.grade_id !== '') {
          params.grade_id = this.searchConfig.grade_id
        }
        if (this.searchConfig.class_type_id !== '') {
          params.class_type_id = this.searchConfig.class_type_id
        }
        if (this.searchConfig.key !== '') {
          params.key = this.searchConfig.key
        }
        receptionApi.getInClassList(params).then(res => {
          res.data.list.map((v, index) => {
            {
              let num = 0
              this.gradeList.map((o, i) => {
                if (v.grade === o.id) {
                  num++
                  v.grade_name = o.name
                }
              })
              if (num === 0) {
                v.grade_name = '无'
                v.grade = 0
              }
            }
            this.teachTypeList.map((o, i) => {
              if (v.teach_type === o.key) {
                v.teach_type_name = o.value
              } else {
                v.teach_type_name = v.teach_type
              }
            })
            {
              let num = 0
              this.levelList.map((o, i) => {
                if (v.class_type * 1 === o.id) {
                  num++
                  v.class_type_name = o.name
                }
              })
              if (num === 0) {
                v.class_type_name = '无'
                v.class_type = 0
              }
            }
            {
              let num = 0
              this.courseTypeList.map((o, i) => {
                if (v.class_type === o.id) {
                  num++
                  v.course_type_name = o.name
                }
              })
              if (num === 0) {
                v.course_type_name = '无'
                v.course_type = 0
              }
            }
          })
          this.inClassList = res.data.list
          // this.inClassList.map((v, index) => {
          //   switch (v.course_type) {
          //     case 1:
          //       v.course_type_name = '长期班'
          //       break
          //     case 2:
          //       v.course_type_name = '短期班'
          //       break
          //     case 3:
          //       v.course_type_name = '体验班'
          //       break
          //     default:
          //       v.course_type_name = '未知'
          //   }
          // })
          this.pageConfig.total = res.data.list.length
        })
      }
    },
    changeClass () {
      if (this.canSubmit) {
        this.canSubmit = false
        this.transferStudent.tar_class_id = this.class_id
        let params = {
          student_id: this.student.id,
          vd_student_id: this.student.vd_student_id || 0,
          src_class_id: this.classDetail.id,
          tar_class_id: this.transferStudent.tar_class_id,
          remark: this.transferStudent.remark
        }
        this.loading = true
        receptionApi.transferClass(params).then(res => {
          this.loading = false
          this.canSubmit = true
          if (res.status_code === 200) {
            this.changeConfig.visible = false
            this.getClassDetail()
          }
        })
      }
    },
    doClose (data) {
      this.dialogTableVisible = false
      if (data === 'success') {
        this.searchStudent()
      }
    },
    quitClass (stu) {
      if (this.isCharge >= 0) {
        this.$router.push({ name: 'wisroomQuitClass', query: {detail: true, class_id: this.classDetail.id, student_id: stu.id, enroll_id: stu.enroll_id, from: 'class'} })
      } else {
        this.$confirm('确定退出班级“' + this.classDetail.class_name + '”吗？', '提示', {
          confirmButtonText: '确 定',
          confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
        }).then(() => {
          let params = {
            student_id: stu.id,
            class_id: this.classDetail.id,
            remark: '退班'
          }
          receptionApi.quitClass(params).then(res => {
            if (res.ok) {
              this.getClassDetail()
              this.$message({
                type: 'success',
                message: '退班成功',
                center: true
              })
            }
          })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退班',
              center: true
            })
          })
      }
    },
    goDown (id) {
      this.$router.push({ path: '/wisroomCoursewareDownload', query: { id } })
    }
  }
}
</script>
<style lang="less">
.wisroomClassDetail {
  text-align: left;
  .classDetailContent {
    & > p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin: 30px 0 20px;
    }
    .detailInfo {
      width: 1200px;
      & > div {
        display: inline-block;
        vertical-align: top;
        width: 240px;
        margin-bottom: 10px;
        margin-right: 10px;
        span {
          display: block;
          line-height: 20px;
          &:first-of-type {
            color: #7a808d;
          }
        }
      }
    }
    .seaarchStudentInput,
    .aaddStudentButton {
      float: right;
      margin-top: -48px;
    }
    .seaarchStudentInput {
      width: 220px;
      border-radius: 16px;
      input {
        border-radius: 16px;
      }
    }
  }
  .go-down {
    font-size: 13px;
    color: #3C75F6;
    margin-left: 10px;
    border-bottom: 1px solid #3C75F6;
    cursor: pointer;
  }
}
.courseware-status{
  color:#3E434C;
  font-size:13px;
}
</style>
