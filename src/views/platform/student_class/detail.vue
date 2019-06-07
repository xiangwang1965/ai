<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link v-if="fromGood" :to="{ path: '/myGood' }">商品</router-link>
        <router-link v-else :to="{ path: '/studentClassroom' }">学生班级</router-link>
        <el-breadcrumb-item>班级详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="basicInfo">
      <p>基本信息</p>
       <el-button size="mini" v-if="isCharge < 0" round class="addStu cac-button-two" icon="el-icon-plus" @click="handleAddStudent" :disabled="tableData.class_status===1 || tableData.status===3 || tableData.status===4 || tableData.course_type_id === 5">添加学生</el-button>
    </div>
    <div class="clearfix"></div>
    <div class="baseInfo_content">
      <div class="image_wrap" style="margin-bottom:10px;">
        <img :src="imgUrl" class="avatar">
      </div>
      <div>
        <el-tooltip class="item" effect="dark" :disabled="!isShowText" :content="tableData.class_name" placement="top">
          <span class="username">{{tableData.class_name}}</span>
        </el-tooltip>
        <!--'班级类型', '校区', '学期', '授课教师', '教师电话'],
      toFacesecondHead: ['课堂状态', '课程起止日期', '创建时间', '上课时间', ''],-->
        <div class="class_info">
          <div>
            <span>双师课程名称</span>
            <span>{{tableData.live_class_name || '无'}}</span>
          </div>
          <div>
            <span>班级类型</span>
            <span>{{tableData.level_name || '无'}}</span>
          </div>
          <div>
            <span>校区</span>
            <span>{{tableData.campus_name || '无'}}</span>
          </div>
          <div v-if="params.class_type === 1">
            <span>学期</span>
            <span>{{tableData.term_name}}</span>
          </div>
          <div>
            <span>辅导老师</span>
            <span>{{tableData.teacher_name || '无'}}</span>
          </div>
          <div>
            <span>辅导老师电话</span>
            <span>{{tableData.telephone || '无'}}</span>
          </div>
          <div>
            <span>班级状态</span>
            <span v-if="tableData.class_status === 1">已退课</span>
            <span v-else>{{tableData.status_name || '无'}}</span>
          </div>
          <div>
            <span>课程起止日期</span>
            <span>{{tableData.date || '无'}}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{tableData.created_at || '无'}}</span>
          </div>
          <div>
            <span>教室</span>
            <span>{{tableData.live_room_name || '无'}}</span>
          </div>
          <div v-if="params.class_type === 1">
            <span>上课时间</span>
            <span>{{tableData.classDate || '无'}}</span>
          </div>
          <div v-if="isCharge >= 0 && tableData.charge_info && tableData.charge_info.amount >= 0 && tableData.course_type_id !== 4 && tableData.course_type_id !== 5">
            <span>课程费</span>
            <span>{{tableData.charge_info.amount | twoFloatFormat}}元/人/期</span>
            <span v-if="tableData.withdraw_rulers_type === 1">根据未上讲次退费</span>
            <span v-if="tableData.withdraw_rulers_type === 4">前{{tableData.withdraw_rulers_amount}}讲退班，全额退费</span>
            <span v-if="tableData.withdraw_rulers_type === 5">后{{tableData.withdraw_rulers_amount}}讲退班，不退费用</span>
          </div>
          <div v-if="isCharge >= 0 && tableData.option_charge && tableData.option_charge[0].amount * 1 >= 0 && tableData.option_charge[0].charge_type * 1 === 1 && tableData.course_type_id !== 4 && tableData.course_type_id !== 5">
            <span>书本费</span>
            <span>{{tableData.option_charge[0].amount * 1 | twoFloatFormat}}元/人</span>
            <span v-if="tableData.option_charge[0].refund_type === 0">报名后不退</span>
            <span v-if="tableData.option_charge[0].refund_type === 1">开课后不退</span>
          </div>
        </div>
        <!--
        <table class="field">
          <thead>
            <th v-for="(item,i) in firstHead" :key="i" v-if="item">{{item}}</th>
          </thead>
          <tbody>
            <td :title="tableData.level_name">{{tableData.level_name || '无'}}</td>
            <td :title="tableData.campus_name">{{tableData.campus_name}}</td>
            <td :title="tableData.term_name" v-if="params.class_type === 1">{{tableData.term_name}}</td>
            <td :title="tableData.teacher_name">{{tableData.teacher_name}}</td>
            <td :title="tableData.telephone">{{tableData.telephone}}</td>
          </tbody>
        </table>
        <table class="field">
          <thead>
            <th v-for="(item,i) in secondHead" :key="i" v-if="item">{{item}}</th>
          </thead>
          <tbody>
            <td :title="tableData.status_name">{{tableData.status_name}}</td>
            <td :title="tableData.date">{{tableData.date}}</td>
            <td :title="tableData.created_at">{{tableData.created_at}}</td>
            <td :title="tableData.classDate" v-if="params.class_type === 1">{{tableData.classDate}}</td>
            <td :title="tableData.live_room_name" v-else>{{tableData.live_room_name}}</td>
          </tbody>
        </table>-->
      </div>
    </div>
    <div>
      <!-- 课程表格 -->
      <div class="studentInfo">
        <p>课程详情</p>
        <div>
          <el-table :data="tableData.lessons" size="mini" highlight-current-row max-height="390" :row-class-name="tableRowClassName">
            <el-table-column align="left" label="讲次" prop="lesson_name"></el-table-column>
            <el-table-column align="center" label="上课日期" prop="date"></el-table-column>
            <el-table-column align="center" label="讲次学生数" prop="student_count" width="100"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 学生表格 -->
      <div class="studentInfo">
        <p>在班学生</p>
        <el-input v-model="key" placeholder="请输入学生姓名、手机号" size="mini" @keyup.enter.native="getStudent" class="search__bar">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getStudent"></i>
        </el-input>
        <div>
          <el-table :data="tableData.students" max-height="390" size="mini">
            <el-table-column align="left" label="学生ID" width="170" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.student_id || scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="姓名" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.student_name || scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" width="220">
              <template slot-scope="scope">
                <el-button class="cac-button-two" @click="handleClick(scope.row)" size="mini" round :disabled="tableData.class_status === 1 || tableData.status===3 || tableData.status===4">转班</el-button>
                <el-button class="cac-button-two" size="mini" @click="doDelete(scope.row)" round :disabled="tableData.class_status === 1 || tableData.status===3 || tableData.status===4">{{isCharge >= 0 ? '退费/班':'退班'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 添加学生 -->
    <addSingleStudentDialog v-if="isCharge >= 0" ref="addStudentDialog" :config="addStudentConfig" :classId="$route.query.class_id" @select="addSingleStudentDone"></addSingleStudentDialog>
    <addStudentDialog v-else ref="addStudentDialog" :config="addStudentConfig" :class_name="this.tableData.class_name" :class_id="this.params.class_id" :class_type="this.tableData.class_type" :isOld="true" v-on:close="doClose"></addStudentDialog>
    <!-- <el-dialog title="添加学生" :visible.sync="dialogTableVisible" width="950px" top="5vh">
      <AddStudent :class_name="this.tableData.class_name" :class_id="this.params.class_id" :class_type="this.tableData.class_type" v-on:close="doClose"></AddStudent>
    </el-dialog> -->
    <el-dialog title="班级选择" :visible.sync="dialogTableVisible1" width="1050px" top="5vh">
      <RadioClass :update="update" v-on:transformParams="doSubmit" @cancel="cancel" :current_id="current_id" :class_type="this.tableData.class_type"></RadioClass>
    </el-dialog>
  </div>
</template>

<script>
  import classroomApi from '@/services/classroom'
  import receptionApi from '@/services/reception'
  import addStudentDialog from '@/components/reception/addStudentDialog'
  import addSingleStudentDialog from '@/components/reception/addSingleStudentDialog'
  import RadioClass from '@/components/radioClass'
  import EventHub from '@/utils/eventHub'
  import authUtils from '@/services/auth/utils'
  import { twoFloatFormat } from '@/utils'

  export default {
    data () {
      return {
        imgUrl: '../../../static/classlogo.png',
        resData: [],
        tableData: [],
        isShowText: false,
        resCourseData: [],
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
        loading: false,
        canSubmit: true,
        fromGood: this.$route.query.from_good
      }
    },
    filters: {
      twoFloatFormat
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
    methods: {
      refresh (params) {
        this.loading = true
        classroomApi.queryClassDetail(this.params).then(res => {
          this.loading = false
          if (res.ok) {
            this.tableData = res.data
            this.isShowText = this.tableData.class_name.length > 8
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
            message: '退班成功!',
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
        this.$router.push({name: 'addStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.$route.query.class_id}})
      },
      // 添加班级
      handleClick (item) {
        this.udpate = true
        this.activeStudent = item
        this.current_id = item.id
        if (this.isCharge >= 0) {
          this.$router.push({ name: 'studentClassroomChangeClass', query: {detail: true, class_id: this.params.class_id, student_id: item.student_id || item.id, from: 'class'} })
        } else {
          this.dialogTableVisible1 = true
        }
      },
      // 删除
      doDelete (item) {
        if (this.isCharge >= 0) {
          this.$router.push({ name: 'studentClassroomQuitClass', query: {detail: true, class_id: this.params.class_id, student_id: item.student_id || item.id, enroll_id: item.enroll_id, from: 'class'} })
        } else {
          this.$confirm('此操作后该学生将退出班级, 是否继续?', '提示', {
            confirmButtonText: '确 定',
            confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
            cancelButtonText: '取 消',
            cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
          }).then(() => {
            // let params = {
            //   'class_id': this.params.class_id,
            //   'student_id': item.student_id || item.id,
            //   'vd_student_id': item.vd_student_id || item.vd_id,
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
            // classroomApi.studentDelete(params).then(res => {
            //   if (res.ok) {
            //     vm.refresh(null)
            //     EventHub.$emit('updateStudent', true)
            //     this.$message({
            //       type: 'success',
            //       message: '退班成功!',
            //       center: true
            //     })
            //   }
            // })
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
          this.refresh()
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
      },
      cancel () {
        this.dialogTableVisible1 = false
      }
    }
  }
</script>
<style lang="less">
.classroomView {
  text-align: left;
  .username{
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .basicInfo {
    width: 100%;
    margin: 30px 0 20px;
    &>p {
      display: inline-block;
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
    }
  }
  .addStu {
    float: right;
  }
  /* 基本信息 */
  .baseInfo_content {
    height: auto;
    &>div {
      display: inline-block;
      vertical-align: top;
    }
    thead th {
      font-size: 12px;
      line-height: 22px;
    }
    thead td {
      font-size: 14px;
      line-height: 22px;
    }
    .image_wrap {
      width: 100px;
      height: 100px;
      margin-right: 20px;
      img {
        margin: 0;
        width: 100%;
        height: 100%;
      }
    }
    .class_info {
      width: 880px;
      & > div {
        display: inline-block;
        vertical-align: top;
        width: 200px;
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
    .field {
      th, td {
        width: 200px;
        max-width: 200px;
        line-height: 16px;
        padding: 0 5px;
      }
      th {
        margin-bottom: 5px;
      }
    }
  }
  .el-table {
    &::before {
      height: 0;
    }
    thead th, tbody td {
      width: 300px !important;
    }
  }
  .studentInfo>p {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    height: 28px;
    line-height: 28px;
    margin: 30px 0 20px;
  }
  .studentInfo .el-input {
    width: 200px;
  }
  .search__bar{
    float: right;
    width: 205px;
    margin: 30px 0 10px 5px;
    input {
      height: 30px;
      border-radius: 15px;
    }
    .el-input__suffix {
      line-height: 30px;
    }
  }
  .search-button {
    font-size: 18px;
    font-weight: 700;
    position: relative;
    left: -50%;
    margin-left: 165px;
    top: 10px;
    color: #ccc;
    cursor: pointer;
  }
  .el-dialog {
    .el-dialog__header {
      padding: 20px 20px 10px;
      .el-dialog__title {
        font-weight: bold;
      }
    }
    .el-dialog__body {
      height: 600px;
      padding: 0 20px;
    }
  }
}
</style>
