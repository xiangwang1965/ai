<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/platformStudent' }">班级管理</router-link>
        <el-breadcrumb-item>班级详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <p class="basicInfo">基本信息</p>
    <el-button class="addStu cac-button-two" icon="el-icon-plus" size="small" round @click="handleAddStudent" :disabled="tableData.status===3 || tableData.status===4">添加学生</el-button>
    <div class="clearfix"></div>
    <div class="baseInfo_content">
      <img :src="imgUrl">
      <el-form label-position="top" inline size="mini">
        <p class="className">{{tableData.class_name}}</p>
        <el-form-item label="双师课程名称">{{tableData.live_class_name || '无'}}</el-form-item>
        <el-form-item label="班级类型">{{tableData.level_name || '无'}}</el-form-item>
        <el-form-item label="辅导老师">{{tableData.teacher_name}}</el-form-item>
        <el-form-item label="校区">{{tableData.campus_name}}</el-form-item>
        <el-form-item label="起止日期">{{tableData.date}}</el-form-item>
        <el-form-item label="班级状态">{{tableData.status_name}}</el-form-item>
        <el-form-item label="辅导老师电话">{{tableData.telephone}}</el-form-item>
        <el-form-item label="教室">{{tableData.live_room_name}}</el-form-item>
        <el-form-item label="创建时间">{{tableData.created_at}}</el-form-item>
        <el-form-item label="上课时间">{{tableData.classDate}}</el-form-item>
        <el-form-item v-if="isCharge >= 0 && tableData.charge_info && tableData.charge_info.amount >= 0 && false" label="收费标准">{{tableData.charge_info.amount | twoFloatFormat}}元/人/期</el-form-item>
      </el-form>
          <!-- <div>
            <table class="field">
              <thead>
                <th v-for="(item,i) in firstHead" :key="i">{{item}}</th>
              </thead>
              <tbody>
                <td>{{tableData.level_name}}</td>
                <td>{{tableData.campus_name}}</td>
                <td v-if="params.class_type === 1">{{tableData.term_name}}</td>
                <td>{{tableData.teacher_name}}</td>
                <td>{{tableData.telephone}}</td>
                <td v-if="params.class_type === 2"></td>
              </tbody>
            </table>
            <table class="field">
              <thead>
                <th v-for="(item,i) in secondHead" :key="i">{{item}}</th>
              </thead>
              <tbody>
                <td>{{tableData.status_name}}</td>
                <td>{{tableData.date}}</td>
                <td>{{tableData.created_at}}</td>
                <td v-if="params.class_type === 1">{{tableData.classDate}}</td>
                <td v-else>{{tableData.live_room_name}}</td>
                <td></td>
              </tbody>
            </table>
          </div> -->
    </div>
    <p>课程详情</p>
    <div class="bottom">
      <!-- 课程表格 -->
      <div class="info">
        <div class="clearfix"></div>
        <div class="tableWrapper">
          <el-table :data="tableData.lessons" size="mini" max-height="390" highlight-current-row :row-class-name="tableRowClassName">
            <el-table-column align="left" label="讲次名称" prop="lesson_name"></el-table-column>
            <el-table-column align="center" label="上课日期" prop="date"></el-table-column>
            <el-table-column align="center" label="讲次学生数" prop="student_count"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 学生表格 -->
    </div>
    <p>在班学生</p>
    <el-input v-model="key" size="small" placeholder="请输入学生姓名、手机号" @keyup.enter.native="getStudent" class="search__bar">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="getStudent"></i>
    </el-input>
    <div class="info studentInfo">
      <div class="clearfix"></div>
      <div class="tableWrapper">
        <el-table :data="tableData.students" size="mini" max-height="390" highlight-current-row>
          <el-table-column align="left" label="学生ID" width="170" prop="" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.student_id || scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="姓名" prop="" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.student_name || scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" size="mini" round class="cac-button-two" :disabled="tableData.status===3 || tableData.status===4">转班</el-button>
              <el-button @click="doDelete(scope.row)" size="mini" round class="cac-button-two" :disabled="tableData.status===3 || tableData.status===4">{{isCharge >= 0 ? '退费/班':'退班'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加学生 -->
    <!-- <el-dialog title="添加学生" :visible.sync="dialogTableVisible" width="950px" top="5vh"> -->
    <addSingleStudentDialog v-if="isCharge >= 0" ref="addStudentDialog" :config="addStudentConfig" :classId="$route.query.class_id" @select="addSingleStudentDone"></addSingleStudentDialog>
    <addStudentDialog v-else ref="addStudentDialog" :config="addStudentConfig" :class_name="this.tableData.class_name" :class_id="this.params.class_id" :class_type="this.tableData.class_type" isOld="true" v-on:close="doClose"></addStudentDialog>
    <!-- </el-dialog> -->
    <el-dialog title="班级选择" :visible.sync="dialogTableVisible1" width="1050px" top="5vh">
      <RadioClass :update="update" v-on:transformParams="doSubmit" v-on:cancel="dialogTableVisible1=false" :current_id="current_id" :class_type="this.tableData.class_type" ></RadioClass>
    </el-dialog>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import receptionApi from '@/services/reception'
import authUtils from '@/services/auth/utils'
import addStudentDialog from '@/components/reception/addStudentDialog'
import addSingleStudentDialog from '@/components/reception/addSingleStudentDialog'
import RadioClass from '@/components/radioClass'
import EventHub from '../../utils/eventHub'
import { twoFloatFormat } from '@/utils'

export default {
  data () {
    return {
      imgUrl: '../../../static/classlogo.png',
      resData: [],
      tableData: [],
      resCourseData: [],
      students: [],
      addStudentConfig: {
        visible: false
      },
      dialogTableVisible1: false,
      current_id: 0,
      // 面授对应的信息
      firstHead: [],
      secondHead: [],
      toFacefirstHead: ['班级类型', '校区', '学期', '授课教师', '教师电话'],
      toFacesecondHead: ['课堂状态', '课程起止日期', '创建时间', '上课时间', ''],
      // 双师班级对应信息
      LivefirstHead: ['班级类型', '校区', '辅导老师', '教师电话', ''],
      LivesecondHead: ['课堂状态', '课程起止日期', '创建时间', '教室', ''],
      lessonOption: ['每周日', '每周一', '每周二', '每周三', '每周四', '每周五', '每周六', '每天'],
      params: {
        'class_id': this.$route.query.class_id,
        'class_type': Number(this.$route.query.class_type)
      },
      key: '',
      activeStudent: {},
      update: false,
      optionStatus: ['未开课', '已开课', '已结课', '已关班'],
      editType: 1,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      canSubmit: true,
      loading: false
    }
  },
  components: { addStudentDialog, RadioClass, addSingleStudentDialog },
  created () {
    this.firstHead = this.params.class_type === 1 ? this.toFacefirstHead : this.LivefirstHead
    this.secondHead = this.params.class_type === 1 ? this.toFacesecondHead : this.LivesecondHead
    this.refresh(null)
    this.getStudent()
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    next()
  },
  filters: {
    twoFloatFormat
  },
  methods: {
    refresh (params) {
      this.loading = true
      classroomApi.queryClassDetail(this.params).then(res => {
        this.loading = false
        if (res.ok) {
          this.tableData = res.data
          this.tableData.date = this.tableData.start_time.split(' ')[0] + '至' + this.tableData.end_time.split(' ')[0]
          this.tableData.status_name = this.optionStatus[this.tableData.status - 1]
          this.tableData.lessons_name = this.lessonOption[this.tableData.lesson_date]
          // classDate前本来拼接了：res.data.lessons_name + ，但是和上课时间信息不符合，暂时去掉
          this.tableData.classDate = this.tableData.start_time.split(' ')[1].slice(0, 5) + '--' + this.tableData.end_time.split(' ')[1].slice(0, 5)
          if (this.params.class_type === 1) {
            this.tableData.lessons.forEach(item => {
              item.date = item.date.split(' ')[0] + ' ' + item.start_time + '-' + item.end_time
            })
          } else {
            this.tableData.lessons.forEach(item => {
              item.date = item.date + ' ' + item.time_span
            })
          }
        }
      })
    },
    getStudent () {
      let params = {
        'class_id': this.params.class_id,
        'class_type': this.params.class_type,
        'key': this.key
      }
      classroomApi.classStudent(params).then(res => {
        if (res.ok) {
          this.tableData.students = res.data
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm('是否确定该学生退班?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '退班成功',
          center: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退班',
          center: true
        })
      })
    },
    handleAddStudent () {
      this.addStudentConfig.visible = true
      if (this.isCharge < 0) {
        this.$nextTick(() => {
          this.$refs.addStudentDialog.refresh()
        })
      }
    },
    // 报名缴费添加学生
    addSingleStudentDone (val) {
      this.$router.push({name: 'platformAddStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.$route.query.class_id, from: 'class'}})
    },
    handleClick (item) {
      this.udpate = true
      this.activeStudent = item
      this.current_id = item.id
      if (this.isCharge >= 0) {
        this.$router.push({ name: 'platformChangeClass', query: {detail: true, class_id: this.params.class_id, student_id: item.student_id, from: 'class'} })
      } else {
        this.dialogTableVisible1 = true
      }
    },
    // 删除
    doDelete (item) {
      if (this.isCharge >= 0) {
        this.$router.push({ name: 'platformQuitClass', query: {detail: true, class_id: this.params.class_id, student_id: item.student_id, enroll_id: item.enroll_id, from: 'class'} })
      } else {
        this.$confirm('此操作后该学生将退出班级, 是否继续?', '提示', {
          confirmButtonText: '确 定',
          confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
        }).then(() => {
          // let params = {
          //   'class_id': this.params.class_id,
          //   'student_id': item.id,
          //   'vd_student_id': item.vd_id,
          //   'class_type': this.tableData.class_type
          // }
          let params = {
            student_id: item.student_id || item.id,
            class_id: this.params.class_id,
            remark: '退班'
          }
          receptionApi.quitClass(params).then(res => {
            if (res.ok) {
              this.refresh(null)
              EventHub.$emit('updateStudent', true)
              this.$message({
                type: 'success',
                message: '退班成功',
                center: true
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退班',
            center: true
          })
        })
      }
    },
    // 转班
    doSubmit (data) {
      if (this.canSubmit) {
        this.canSubmit = false
        let params = {
          'src_class_id': this.params.class_id,
          'student_id': this.activeStudent.student_id || this.activeStudent.id,
          'vd_student_id': this.activeStudent.vd_student_id ? this.activeStudent.vd_student_id : this.activeStudent.vd_id,
          'tar_class_id': data
        }
        let loadingInstance = this.$loading({
          text: '提交中...'
        })
        if (!params.vd_student_id) {
          params.vd_student_id = 0
        }
        receptionApi.transferClass(params).then(res => {
          setTimeout(() => {
            loadingInstance.close()
            this.canSubmit = true
          }, 500)
          if (res.ok) {
            this.update = !this.update
            EventHub.$emit('updateStudent', true)
            this.dialogTableVisible1 = false
            this.getStudent()
          }
        })
      }
    },
    // 关闭添加学生
    doClose (data) {
      if (data === 'success') {
        this.getStudent()
      }
    },
    // 课程样式
    tableRowClassName ({ row, rowIndex }) {
      if (row.is_special === 1) {
        return 'success-row'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="less">
.classroomView {
  text-align: left;
  &>P{
    font-size: 20px;
    font-weight: bold;
    height: 28px;
    line-height: 28px;
    margin: 30px 0 20px;
  }
  .addStu {
    float: right;
    margin-top: -40px;
  }
  .baseInfo_content {
    height: 150px;
    img {
      float: left;
      width: 100px;
      height: 99px;
      margin-right: 20px;
    }
    .className {
      font-size: 18px;
      height: 25px;
      line-height: 25px;
    }
    .el-form {
      display: inline-block;
      width: 900px;
      .el-form-item {
        width: 200px;
        margin-right: 20px;
        .el-form-item__label {
          height: 24px;
          font-size: 12px;
          color: #7A808D;
          padding-bottom: 0;
        }
      }
    }
  }
  .search__bar {
    float: right;
    margin-top: -50px;
    width: 200px;
    border-radius: 16px;
    input {
      border-radius: 16px;
    }
  }
  // .basicInfo {
  //   float: left;
  //   margin: 20px 0;
  //   font-size: 18px;
  //   color: #333;
  // }
  // .addStu {
  //   float: right;
  // }
  // /* 基本信息 */
  // .baseInfo_content thead th {
  //   font-size: 12px;
  // }
  // .baseInfo_content thead td {
  //   font-size: 14px;
  // }
  // .field:first-child {
  //   margin-top: 0;
  //   height: 60px;
  //   margin-top: 42px;
  // }
  // .baseInfo_content .field td,
  // .baseInfo_content .field th {
  //   width: 20%;
  // }
  // .baseInfo_content .field td {
  //   padding-bottom: 0;
  // }
  // .el-table::before {
  //   height: 0;
  // }
  // .bottom {
  //   display: flex;
  // }
  // .info {
  //   display: inline-block;
  //   width: 50%;
  //   flex: 1;
  //   padding: 25px 0;
  //   padding-right: 10px;
  // }
  // .studentInfo {
  //   padding-left: 10px;
  //   padding-right: 0;
  // }
  // .info h4 {
  //   float: left;
  //   font-size: 18px;
  // }
  // .info .el-table .cell {
  //   text-align: center;
  // }
  // .studentInfo .el-input {
  //   width: 200px;
  // }
  // .tableWrapper {
  //   margin-top: 20px;
  // }

  // .search__bar.el-input {
  //   float: left;
  //   width: 60%;
  //   margin: 5px 0 10px 5px;
  // }
  // .search-button {
  //   font-size: 18px;
  //   font-weight: 700;
  //   position: relative;
  //   left: -50%;
  //   margin-left: 165px;
  //   top: 10px;
  //   color: #ccc;
  //   cursor: pointer;
  // }
}
</style>
