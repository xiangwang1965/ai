<template>
  <div class="wisroomStudentDetail" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/wisroomStudent' }">学生</router-link>
        <el-breadcrumb-item class="cac-bread">学生详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="studentDetailContent" v-if="student.info">
      <p>学生信息</p>
      <div class="studentInfo" v-loading="loading1">
        <div>
          <span class="infoLabel">学生姓名</span>
          <span>{{student.info.name}}</span>
        </div>
        <div>
          <span class="infoLabel">学生手机号</span>
          <span>{{student.info.telephone}}</span>
        </div>
        <div>
          <span class="infoLabel">所属校区</span>
          <span :title="student.info.campus_name">{{student.info.campus_name || '无'}}</span>
        </div>
        <div>
          <span class="infoLabel">学生性别</span>
          <span>{{student.info.gender === 3 ? '未知' : student.info.gender === 1 ? '男' : '女'}}</span>
        </div>
        <div>
          <span class="infoLabel">学生年级</span>
          <span>
            {{student.info.grade || '无'}}
          </span>
        </div>
        <br>
        <div>
          <span class="infoLabel">学生生日</span>
          <span>{{student.info.birthday || '无'}}</span>
        </div>
        <div>
          <span class="infoLabel">家长姓名</span>
          <span>{{student.info.parent_name || '无'}}</span>
        </div>
        <div>
          <span class="infoLabel">关系</span>
          <span>{{student.info.parent_relation || '无'}}</span>
        </div>
        <div>
          <span class="infoLabel">家长电话</span>
          <span>{{student.info.parent_telephone || '无'}}</span>
        </div>
        <div>
          <span class="infoLabel">学生英文姓名</span>
          <span>{{student.info.english_name}}</span>
        </div>
      </div>
      <p style="margin-top:30px;">报名信息</p>
      <div class="entryInfo" v-loading="loading2">
        <div v-if="student.entryList.length === 0">无</div>
        <div v-for="(entry,index) in student.entryList" :key="index">
          <div style="height:30px;line-height:30px;margin-bottom:10px;">
            <p style="float:left;">
              <span style="margin-right:20px;">
                <span class="infoLabel">课程类型：</span>
                <span v-for="(courseType, i) in courseTypeList" :key="i" v-if="courseType.id * 1 === entry.course_type * 1">{{courseType.course_type_name}}</span>
                <span v-if="entry.course_type === 0">无</span>
              </span>
              <span style="margin-right:20px;">
                <span class="infoLabel">报名日期：</span>
                <span>{{entry.created_at}}</span>
              </span>
              <span v-if="isCharge >= 0">
                <span class="infoLabel">{{entry.remain_fee < 0 ? '欠费':'余额'}}：</span>
                <span>{{entry.remain_fee < 0 ? (entry.remain_fee * -1 | twoFloatFormat) : entry.remain_fee}}元</span>
              </span>
            </p>
            <div class="buttonGroup">
              <el-button v-if="button.type === 'divide'" v-for="button in entry.button" :icon="'icon-cac-' + (button.type === 'addFee' ? 'addfee' : button.type)" :key="button.type" :disabled="button.gray * 1 === 1" class="cac-button-two" size="mini" round @click="doneNext(button.type, entry)">{{button.name || '分班'}}</el-button>
              <el-button v-if="button.type === 'transfer'" v-for="button in entry.button" :icon="'icon-cac-' + (button.type === 'addFee' ? 'addfee' : button.type)" :key="button.type" :disabled="button.gray * 1 === 1" class="cac-button-two" size="mini" round @click="doneNext(button.type, entry)">{{button.name || '转班'}}</el-button>
              <el-button v-if="button.type === 'addFee' || button.type === 'addfee'" v-for="button in entry.button" :icon="'icon-cac-' + (button.type === 'addFee' ? 'addfee' : button.type)" :key="button.type" :disabled="button.gray * 1 === 1" class="cac-button-two" size="mini" round @click="doneNext(button.type, entry)">{{button.name || '补费'}}</el-button>
              <el-button v-if="button.type === 'quit'" v-for="button in entry.button" :icon="'icon-cac-' + (button.type === 'addFee' ? 'addfee' : button.type)" :key="button.type" :disabled="button.gray * 1 === 1" class="cac-button-two" size="mini" round @click="doneNext(button.type, entry)">{{button.name || '退班'}}</el-button>
              <el-button v-if="button.type === 'refund'" v-for="button in entry.button" :icon="'icon-cac-' + (button.type === 'addFee' ? 'addfee' : button.type)" :key="button.type" :disabled="button.gray * 1 === 1" class="cac-button-two" size="mini" round @click="doneNext(button.type, entry)">{{button.name || '退费/班'}}</el-button>
            </div>
          </div>
          <el-table :data="entry.data">
            <el-table-column label="班级名称" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.class_name || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程名称" prop="course_name" show-overflow-tooltip>

            </el-table-column>
            <el-table-column label="辅导老师" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.teacher_name || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="class_type" show-overflow-tooltip>

            </el-table-column>
            <el-table-column label="创建时间" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.created_at.split(' ')[0] || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">在读</span>
                <span v-if="scope.row.status == 2">待分班</span>
                <span v-if="scope.row.status == 3">转出</span>
                <span v-if="scope.row.status == 4">退班</span>
                <span v-if="scope.row.status == 5">结课</span>
                <span v-if="scope.row.status == 6">已分班</span>
                <span v-if="scope.row.status == 7">未在读</span>
                <span v-if="scope.row.status == 9">已关班</span>
              </template>
            </el-table-column>
            <el-table-column label="操作人" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.operator_name || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.remark || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开课时间" prop="" width="230" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.course_open_time || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" v-if="isCharge >= 0" label="经办校区" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.handle_campus || '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" v-if="isCharge >= 0" label="应收学费" prop="" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.payable || '0:00'}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" v-if="isCharge >= 0" label="实收学费" prop="" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.pay || '0:00'}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" v-if="isCharge >= 0" label="" prop="" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="cac-button-two" size="mini" round @click="checkPayDetail(scope.row)">明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog class="divideDialog" title="班级选择" :visible.sync="divideConfig.visible" @open="getClassList()" width="1050px">
      <div>
        <el-select v-model="searchConfig.course_type_id" clearable placeholder="课程类型">
          <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.course_type_name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.grade_id" clearable placeholder="年级">
          <el-option v-for="grade in outGradeList" :key="grade.grade_id" :value="grade.grade_id" :label="grade.grade_name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.class_type_id" clearable placeholder="班型">
          <el-option v-for="level in outLevelList" :key="level.class_level_id" :value="level.class_level_id" :label="level.class_level_name"></el-option>
        </el-select>
        <el-button type="primary" class="cac-button-one spc_filter" size="mini" round @click="getClassList()">筛选</el-button>
        <el-input class="searchInput" v-model="searchConfig.key" @keyup.enter.native="getClassList()" placeholder="课程、授课老师">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getClassList()"></i>
        </el-input>
      </div>
      <el-table
        ref="classTable"
        :data="classList"
        @row-click="selectClass"
        :highlight-current-row="true">
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
        <el-table-column prop="grade_name" label="年级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.grade">
              <span v-for="grade in outGradeList" :key="grade.grade_id" v-if="grade.grade_id == scope.row.grade">{{grade.grade_name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="class_type_name" label="班型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.class_type">
              <span v-for="grade in outLevelList" :key="grade.class_level_id" v-if="grade.class_level_id == scope.row.class_type">{{grade.class_level_name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>outLevelList
        <el-table-column prop="teacher_name" label="授课老师" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="teach_type_name" label="授课方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>双师</span>
          </template>
        </el-table-column>
        <el-table-column prop="campus_name" label="校区" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="start_time" label="开课时间" width="183" align="center" show-overflow-tooltip>

        </el-table-column>
        <el-table-column label="收费标准" min-width="100" v-if="isCharge >= 0" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.charge_info.amount}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="goPage"></pagination>
      <div slot="footer" class="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="doneSelectClass">确 定</el-button>
      </div>
    </el-dialog>
    <payDetailDialog :config="payDetailConfig"></payDetailDialog>
  </div>
  </div>
</template>
<script>
  import studentApi from '@/services/student'
  import receptionApi from '@/services/reception'
  import courseApi from '@/services/platform/course'
  import authUtils from '@/services/auth/utils'
  import pagination from '@/components/pagination'
  import payDetailDialog from '@/components/reception/payDetailDialog'
  import { twoFloatFormat } from '@/utils'
  export default {
    props: ['source'],
    data () {
      return {
        loading: false,
        loading1: false,
        loading2: false,
        student: {
          info: {},
          entryList: []
        },
        student_id: this.$route.query.id,
        optionsList: [],
        divideConfig: {
          visible: false
        },
        teachTypeList: [
          {
            key: 1,
            value: '双师'
          }, {
            key: 2,
            value: '面授'
          }
        ],
        levelList: [],
        gradeList: [],
        outLevelList: [],
        outGradeList: [],
        courseTypeList: [],
        searchConfig: {
          teach_type: '',
          course_type_id: '',
          grade_id: '',
          class_type_id: '',
          key: ''
        },
        classList: [],
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        class_id: '',
        enroll_id: '',
        payDetailConfig: {
          visible: false
        },
        isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
        canSubmit: true
      }
    },
    filters: {
      twoFloatFormat
    },
    components: {
      pagination,
      payDetailDialog
    },
    beforeRouteLeave (to, from, next) {
      this.$destroy()
      next()
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.loading = true
        this.getStudentInfo()
        this.getEntryInfo()
        this.getOptionsList()
        this.getClassLevelList()
        this.getGradeList()
      },
      getStudentInfo () {
        this.loading1 = true
        let params = {
          'student_id': this.student_id
        }
        studentApi.queryDetail(params).then(res => {
          this.loading = false
          if (res.ok) {
            this.loading1 = false
            this.student.info = res.data
          }
        })
      },
      getOptionsList () {
        receptionApi.getOptionsList().then(res => {
          this.courseTypeList = res.data.course_types
          this.outLevelList = res.data.class_type
          this.outGradeList = res.data.grade
        })
      },
      getClassLevelList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getClassLevelList(params).then(res => {
          this.levelList = res
        })
      },
      getGradeList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getGradeList(params).then(res => {
          this.gradeList = res
        })
      },
      getEntryInfo () {
        this.loading2 = true
        let params = {
          'student_id': this.student_id
        }
        receptionApi.getEntryList(params).then(res => {
          if (res.status_code === 200) {
            this.loading2 = false
            res.data.map((v, i) => {
              this.$nextTick(() => {
                // switch (v.course_type * 1) {
                //   case 1:
                //     v.course_type_name = '长期班'
                //     break
                //   case 2:
                //     v.course_type_name = '短期班'
                //     break
                //   case 3:
                //     v.course_type_name = '体验课'
                //     break
                //   default:
                //     v.course_type_name = '未知'
                // }
                {
                  let num = 0
                  this.courseTypeList.map((o, i) => {
                    if (v.course_type === o.id) {
                      num++
                      v.course_type_name = o.course_type_name
                    }
                  })
                  if (num === 0) {
                    v.course_type_name = '无'
                    v.course_type = 0
                  }
                }
                v.data.map((o, j) => {
                  switch (o.status * 1) {
                    case 1:
                      o.status_name = '在读'
                      break
                    case 2:
                      o.status_name = '待分班'
                      break
                    case 3:
                      o.status_name = '转出'
                      break
                    case 4:
                      o.status_name = '退班'
                      break
                    case 5:
                      o.status_name = '结班'
                      break
                  }
                })
                v.button.map((p, k) => {
                  switch (p.type) {
                    case 'divide':
                      p.name = '分班'
                      break
                    case 'addFee':
                      p.type = 'addfee'
                      p.name = '补费'
                      break
                    case 'quit':
                      p.name = '退班'
                      break
                    case 'transfer':
                      p.name = '转班'
                      break
                    case 'refund':
                      p.name = '退费/班'
                      break
                  }
                })
              })
            })
          }
          this.student.entryList = res.data
        })
      },
      doneNext (type, data) {
        if (type === 'transfer') {
          this.$router.push({ name: this.source === 'wisroom' ? 'wisroomStudentChangeClass' : 'changeClass', query: {detail: true, class_id: data.class_id, student_id: this.student.info.id, from: 'class'} })
        }
        if (type === 'quit') {
          this.$router.push({ name: this.source === 'wisroom' ? 'wisroomStudentQuitClass' : 'quitClass', query: {detail: true, class_id: data.class_id, student_id: this.student.info.id, enroll_id: data.data[0].id, from: 'class'} })
        }
        if (type === 'addfee') {
          this.$router.push({ name: 'wisroomStudentAddFee', query: {detail: true, class_id: data.class_id, student_id: this.student.info.id, from: 'class'} })
        }
        if (type === 'addFee') {
          this.$router.push({ name: 'wisroomStudentAddFee', query: {detail: true, class_id: data.class_id, student_id: this.student.info.id, from: 'class'} })
        }
        if (type === 'refund') {
          this.$router.push({ name: this.source === 'wisroom' ? 'wisroomStudentQuitClass' : 'quitClass', query: {detail: true, class_id: data.class_id, student_id: this.student.info.id, enroll_id: data.data[0].id, from: 'class'} })
        }
        if (type === 'divide') {
          this.divideConfig.visible = true
          this.enroll_id = data.data[0].id
        }
      },
      getClassList (flag) {
        let params = {
          page: flag ? this.pageConfig.page : 1,
          page_size: this.pageConfig.per_page
        }
        if (this.searchConfig.teach_type) {
          params.teach_type = this.searchConfig.teach_type
        }
        if (this.searchConfig.course_type_id) {
          params.course_type_id = this.searchConfig.course_type_id
        }
        if (this.searchConfig.grade_id) {
          params.grade_id = this.searchConfig.grade_id
        }
        if (this.searchConfig.class_type_id) {
          params.class_type_id = this.searchConfig.class_type_id
        }
        if (this.searchConfig.key) {
          params.key = this.searchConfig.key
        }
        params.enroll_id = this.enroll_id
        receptionApi.getAllClassList(params).then(res => {
          res.data.list.map((v, index) => {
            this.gradeList.map((o, i) => {
              if (v.grade === o.key) {
                v.grade_name = o.value
              } else {
                v.grade_name = v.grade
              }
            })
            this.teachTypeList.map((o, i) => {
              if (v.teach_type === o.key) {
                v.teach_type_name = o.value
              } else {
                v.teach_type_name = v.teach_type
              }
            })
            this.levelList.map((o, i) => {
              if (v.class_type === o.class_level_id) {
                v.class_type_name = o.class_level_name
              }
            })
            {
              let num = 0
              this.courseTypeList.map((o, i) => {
                if (v.course_type === o.id) {
                  num++
                  v.course_type_name = o.course_type_name
                }
              })
              if (num === 0) {
                v.course_type_name = '无'
                v.course_type = 0
              }
            }
          })
          this.classList = res.data.list
          this.pageConfig.total = res.data.list.length
        })
      },
      selectClass (row) {
        this.$refs.classTable.setCurrentRow(row, true)
        setTimeout(() => {
          this.$refs.classTable.setCurrentRow(row)
        }, 10)
        this.class_id = row.id
      },
      cancelSelect () {
        this.divideConfig.visible = false
      },
      doneSelectClass () {
        if (this.canSubmit) {
          this.canSubmit = false
          let params = {
            student_id: this.student_id,
            class_ids: this.class_id,
            vd_student_id: this.student.info.vd_id,
            live_org_class_students_id: this.enroll_id
          }
          receptionApi.insertStudent(params).then(res => {
            this.canSubmit = true
            if (res.status_code === 200) {
              this.getEntryInfo()
              this.divideConfig.visible = false
            }
          })
        }
      },
      checkPayDetail (val) {
        receptionApi.getPayDetail({id: val.id}).then((res) => {
          if (res.ok) {
            this.payDetailConfig.list = []
            res.data.map((v) => {
              let obj = {
                created_at: v.created_at,
                amount: v.amount
              }
              switch (v.use) {
                case 1:
                  obj.use_name = '补费'
                  break
                case 2:
                  obj.use_name = '退费'
                  break
                case 3:
                  obj.use_name = '抵扣转入'
                  break
                case 4:
                  obj.use_name = '抵扣转出'
                  break
                case 5:
                  obj.use_name = '第一次缴费'
                  break
              }
              switch (v.type) {
                case 1:
                  obj.type_name = '银联'
                  break
                case 2:
                  obj.type_name = '支付宝'
                  break
                case 3:
                  obj.type_name = '微信'
                  break
                case 4:
                  obj.type_name = '现金'
                  break
                case 5:
                  obj.type_name = '自动支付'
                  break
              }
              this.payDetailConfig.list.push(obj)
            })
          }
          this.payDetailConfig.visible = true
        })
      },
      goPage (val) {
        this.pageConfig.page = val
        this.getClassList(true)
      }
    }
  }
</script>
<style lang="less">
.wisroomStudentDetail {
  text-align: left;
  .studentDetailContent {
    .infoLabel {
      color: #7A808D;
    }
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-bottom: 30px;
    }
    .studentInfo {
      &>div {
        display: inline-block;
        vertical-align: top;
        width: 150px;
        font-size: 13px;
        color: #3E434C;
        line-height: 20px;
        margin-bottom: 10px;
        span {
          display: block;
        }
      }
    }
    .entryInfo {
      &>div {
        margin-bottom: 20px;
      }
      .el-table {
        .el-table__fixed-right {
          background-color: white;
        }
        th {
          background: #F9FBFC !important;
        }
        .el-table__fixed-right {
          height: 100% !important;
        }
      }
      .buttonGroup {
        float: right;
        .el-button {
          min-width: 84px;
        }
      }
    }
  }
  .divideDialog {
    .el-dialog__header {
      padding: 20px 20px 10px;
      .el-dialog__title {
        font-weight: bold;
      }
    }
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }
    .el-select {
      width: 110px;
    }
    .searchInput {
      float: right;
      width: 220px;
    }
    .el-input__icon {
      line-height: 1;
    }
    .el-table {
      margin-top: 10px;
      font-size: 12px;
      height: 400px;
    }
    .footer {
      text-align: center;
    }
  }
}
</style>
