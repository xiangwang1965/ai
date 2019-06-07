<template>
  <div class="studentEntry" v-loading.fullscreen.lock="loading">
    <div class="cac-bread-bar">
      <div style="display:flex;align-items:center;">
        <el-breadcrumb separator="/">
          <router-link :to="{ path: source === 'reception' ? '/reception' : '/student' }">{{source === 'reception' ? '业务办理' : '学生管理'}}</router-link>
          <el-breadcrumb-item v-if="type !== 'edit'" class="cac-bread">{{source === 'reception' ? (isCharge >= 0 ? '学生报名/缴费' : '学生报名') : createType === 'edit' ? '编辑学生' : '创建学生'}}</el-breadcrumb-item>
          <el-breadcrumb-item v-else class="cac-bread">修改学生</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button
        type="primary"
        class="clearfix cac-button-one"
        size="small"
        round
        v-if="source === 'reception' && createType !== 'edit'"
        @click="selectStudentConfig.visible = true">{{student.id > 0 ? '重新选择' : '选择学生'}}</el-button>
    </div>
    <div class="import-data" v-if="(type !== 'edit') && magicFlag">
      <el-button @click="handleImport" type="primary" class="cac-button-one import-data-button" size="small" round>
        <i class="icon-cac-import"></i>
        <span>从咨询本导入</span>
      </el-button>
    </div>
    <div class="studentInfo">
      <p>学生信息</p>
      <el-form label-position="top" size="mini" inline ref="entryForm" :rules="entryRules" :model="studentInfo">
        <el-form-item style="width:340px;" label="学生姓名" prop="name">
          <el-input :disabled="student.id > 0" size="medium" placeholder="请输入学生姓名" :maxlength="8" v-model="studentInfo.name"></el-input>
        </el-form-item>
        <el-form-item style="width:340px;" label="家长姓名" prop="parent_name">
          <el-input :disabled="student.id > 0" size="medium" placeholder="请输入家长姓名" :maxlength="8" v-model="studentInfo.parent_name"></el-input>
        </el-form-item>
        <br>
        <el-form-item style="width:340px;" label="学生手机号" prop="telephone">
          <el-input :disabled="student.id > 0" size="medium" :maxlength="11" placeholder="请输入学生手机号" v-model="studentInfo.telephone"></el-input>
        </el-form-item>
        <el-form-item style="width:340px;" label="关系" prop="parent_relation">
          <el-input :disabled="student.id > 0" size="medium" placeholder="请输入家长与学生关系" v-model="studentInfo.parent_relation"></el-input>
        </el-form-item>
        <br>
        <el-form-item style="width:340px;" label="校区" prop="campus_id">
          <el-select :disabled="student.id > 0" size="medium" placeholder="请选择校区" v-model="studentInfo.campus_id">
            <el-option v-for="campus in allCampusList" :key="campus.id" :label="campus.name" :value="campus.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:340px;" label="家长电话" prop="parent_telephone">
          <el-input :disabled="student.id > 0" size="medium" :maxlength="11" placeholder="请输入家长电话" v-model="studentInfo.parent_telephone"></el-input>
        </el-form-item>
        <br>
        <el-form-item style="width:340px;" label="学生生日" prop="birthday">
          <!-- <el-input size="medium" placeholder="请选择学生生日" v-model="studentInfo.birthday"></el-input> -->
          <el-date-picker
            popper-class="form_date_picker"
            v-model="studentInfo.birthday"
            type="date"
            size="large"
            :picker-options="disabledDate"
            :disabled="student.id > 0"
            placeholder="请选择学生生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="isAI" style="width:340px;" label="学生英文名" prop="english_name">
          <el-input :disabled="student.id > 0" size="medium" :maxlength="20" placeholder="请输入学生英文名" v-model="studentInfo.english_name"></el-input>
        </el-form-item>
        <br v-if="isAI">
        <el-form-item style="width:340px;" label="学生年级" prop="grade">
          <el-select :disabled="student.id > 0" v-if="createType === 'edit'" size="medium" clearable placeholder="请选择学生年级" v-model="studentInfo.grade" @visible-change="getGradeList">
            <el-option v-for="grade in gradeList" :key="grade.grade_id" :label="grade.grade_name" :value="grade.grade_name">{{grade.grade_name}}</el-option>
          </el-select>
          <el-select :disabled="student.id > 0" v-else size="medium" clearable placeholder="请选择学生年级" v-model="studentInfo.grade">
            <el-option v-for="grade in gradeList" :key="grade.grade_id" :label="grade.grade_name" :value="grade.grade_id">{{grade.grade_name}}</el-option>
          </el-select>
        </el-form-item>
        <br v-if="!isAI">
        <el-form-item style="width:340px;" label="性别" prop="gender">
          <el-radio-group :disabled="student.id > 0" v-model="studentInfo.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="enteryInfo" v-if="createType !== 'edit'">
          <p>报名信息</p>
          <div class="enteryBtnWraper" v-if="entryData.totalNum !== 0">
            <el-button class="clearfix cac-button-two" size="small" round @click="entryCourseOpen">报名课程</el-button>
            <el-button class="clearfix cac-button-two" size="small" round @click="entryClassOpen">报名班级</el-button>
          </div>
          <div class="unEntery" v-if="entryData.totalNum === 0">
            <div @click="entryCourseOpen">
              <p>选择报名课程</p>
              <span>适用于先报课程后分班级的学员报名</span>
            </div>
            <div @click="entryClassOpen">
              <p>选择报名班级</p>
              <span>适用于已建班，直接报入班级的学员报名</span>
            </div>
          </div>
          <div v-else>
            <div v-if="isCharge >= 0" v-for="data in entryData.list">
              <el-table :data="data">
                <el-table-column prop="class_name" label="班级名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.class_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="课程名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.course_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="data[0].type === 1 ? '双师主讲':'面授主讲'" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.teacher_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="授课方式" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="isWisroom !== 'wisroom'">{{scope.row.teach_type_name || '无'}}</span>
                    <span v-else>双师</span>
                  </template>
                </el-table-column>
                <el-table-column label="开课时间" align="center" width="220" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.start_time || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button class="clearfix cac-button-two entryClassDelBtn" size="mini" round @click="deleteEntryData(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <paymentType :config="data[0].payConfig" :payTitle="data[0].withdraw_text" :showWarning="data[0].showWarning" :startedData="data[0].startedData" @setMoney="setMoney" @change="paymentChange"></paymentType>
              <div v-if="data[0].otherPay && data[0].otherPay.payList.length > 0" style="margin-top: -10px;">
                <p style="height: 50px;line-height: 50px;background-color: #f9fbfc;padding-left: 20px;">书本费
                  <!--<span style="color: #ABB9C6;font-size: 13px;">（退费说明：{{data[0].otherPay.refund_type === 1 ? '开课后不退' : '报名后不退'}}）</span>-->
                </p>
                <paymentType :config="data[0].otherPay" :payTitle="data[0].option_withdraw_text" :showWarning="data[0].showOtherWarning" @setMoney="setOtherMoney" @change="otherPaymentChange"></paymentType>
              </div>
            </div>
            <div v-if="isCharge < 0">
              <el-table :data="entryData.list">
                <el-table-column prop="class_name" label="班级名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row[0].class_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="课程名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row[0].course_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="主讲老师" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row[0].teacher_name || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="授课方式" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="isWisroom !== 'wisroom'">{{scope.row[0].teach_type_name || '无'}}</span>
                    <span v-else>双师</span>
                  </template>
                </el-table-column>
                <el-table-column label="开课时间" align="center" width="220" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row[0].start_time || '无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button class="clearfix cac-button-two entryClassDelBtn" size="mini" round @click="deleteEntryData(scope.row[0])">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <paymentInfo v-if="isCharge >= 0" :config="{receivableAmount:allAmount,receivedAmount:allReceived,arrearsAmount:allArrears}"></paymentInfo>
            <!--<pagination :config="entryPageConfig" @change="changeEntryPage"></pagination>-->
          </div>
          <div class="manageInfo" v-if="isCharge >= 0">
            <p>经办信息</p>
            <el-form-item label="经办校区" prop="campus">
              <el-select size="medium" placeholder="请选择经办校区" v-model="studentInfo.campus" @change="selectManageCampus">
                <el-option v-for="campus in campusList" :key="campus.id + ''" :label="campus.name" :value="campus.id + ''">{{campus.name}}</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="manageWraper">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="entryClass">{{type ==='edit' ? '确 定':'创 建'}}</el-button>
    </div>
    <classEntry :config="entryClassConfig" v-if="entryClassConfig.visible" :selectedList="entryData.list" @done="selectEntryData"></classEntry>
    <courseEntry :config="entryCourseConfig" v-if="entryCourseConfig.visible"  :selectedList="entryData.list" @done="selectEntryData"></courseEntry>
    <selectStudentDialog :config="selectStudentConfig" @select="selectStudentDone"></selectStudentDialog>
    <consultDialog :config="dialogConsultConfig" @selectConsultDone="handleSelectConsult" />
  </div>
</template>
<script>
import selectStudentDialog from '@/components/reception/selectStudentDialog'
import selectItem from '@/components/live/selectitem'
import classEntry from '@/components/reception/classEntry'
import courseEntry from '@/components/reception/courseEntry'
import paymentType from '@/components/paymentType'
import selectInputCampus from '@/components/selectInputCampus'
import { formatDate, formatDay, formatTime } from '@/utils'
import receptionApi from '@/services/reception'
import staffApi from '@/services/internal/staff'
import pagination from '@/components/pagination'
import paymentInfo from '@/components/paymentInfo'
import authUtils from '@/services/auth/utils'
import consultDialog from '@/components/reception/consultDialog'
export default {
  props: ['source'],
  data () {
    return {
      selectStudentConfig: {
        visible: false
      },
      dialogConsultConfig: {
        visible: false
      },
      student: {},
      loading: false,
      dialogConsultVisible: false,
      type: this.$route.query.type || this.$route.query.create,
      createType: this.$route.query.create || this.$route.query.type,
      campusList: [],
      allCampusList: [],
      gradeList: [],
      pickerOptions: {},
      studentInfo: {
        name: '',
        telephone: '',
        birthday: '',
        parent_name: '',
        parent_relation: '',
        parent_telephone: '',
        campus_id: '',
        grade: '',
        english_name: '',
        campus: '',
        gender: ''
      },
      entryRules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { pattern: /[\u4e00-\u9fa5]/, message: '学生姓名中必须包含中文，请修改', trigger: 'blur' }
        ],
        parent_name: [
          { required: false, message: '请输入家长姓名', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入学生手机号', trigger: 'blur' },
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        parent_relation: [
          { required: false, message: '请输入家长与学生关系', trigger: 'blur' }
        ],
        campus_id: [
          { required: true, message: '请选择校区', trigger: 'change' }
        ],
        parent_telephone: [
          { required: false, message: '请输入家长手机号', trigger: 'blur' },
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        birthday: [
          { required: false, message: '请输入学生生日', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择学生性别', trigger: 'blur' }
        ],
        english_name: [
          { required: true, message: '请输入20个字符以内的英文名', trigger: 'blur' },
          { pattern: /^[A-Za-z]+$|^[A-Za-z][A-Za-z0-9]+$/, message: '英文名格式不正确', trigger: 'blur' }
        ],
        grade: [
          { required: false, message: '请选择年级', trigger: 'blur' }
        ],
        campus: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请选择经办校区', trigger: 'change' }
        ]
      },
      entryData: {
        totalNum: 0,
        list: []
      },
      entryPageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      entryClassConfig: {
        visible: false
      },
      entryCourseConfig: {
        visible: false
      },
      allAmount: 0,
      allReceived: 0,
      allArrears: 0,
      showCampusWarning: false,
      isWisroom: authUtils.getUser().third_part === 'wisroom' ? 'wisroom' : -1,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      canSubmit: true
    }
  },
  filters: {
    formatDate,
    formatDay,
    formatTime
  },
  components: {
    selectItem: selectItem,
    classEntry: classEntry,
    courseEntry: courseEntry,
    paymentType: paymentType,
    selectInputCampus: selectInputCampus,
    pagination: pagination,
    selectStudentDialog: selectStudentDialog,
    paymentInfo: paymentInfo,
    consultDialog
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/reception' || to.path === '/student') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  watch: {
    entryData: {
      handler (val, oldval) {

      },
      immediate: true
    }
  },
  computed: {
    entryDataViewList () {
      this.entryPageConfig.total = this.entryData.totalNum
      if (this.entryData.list.length > 8) {
        let page = (this.entryPageConfig.page - 1) * 8
        return this.entryData.list.slice(page, page + 8)
      } else {
        console.log(this.entryData.list)
        return this.entryData.list
      }
    },
    disabledDate () {
      return {
        disabledDate (time) {
          return time.getTime() > new Date().getTime()
        }
      }
    },
    magicFlag () {
      if (authUtils.getUser().brands && authUtils.getUser().brands.indexOf('MS') >= 0) {
        return true
      }
      return false
    },
    isAI () {
      let cooperationsName = []
      let cooperationsIds = []
      let brandList = JSON.parse(authUtils.getUser().brandList)
      brandList.map((v, i) => {
        v.cooperations.map((o, j) => {
          cooperationsName.push(o.cooperation_name)
          cooperationsIds.push(o.cooperation_id * 1)
        })
      })
      if (this.isWisroom === 'wisroom' && cooperationsName.indexOf('AI') >= 0 && cooperationsIds.indexOf(7) >= 0) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.getAllCampusList()
    if (this.isCharge >= 0) {
      this.getCampusList()
    }
    if (this.createType === 'edit') {
      this.loading = true
      receptionApi.getStudentDetail({student_id: this.$route.query.id}).then(res => {
        this.loading = false
        if (res.status_code === 200) {
          this.studentInfo = res.data
          if (this.studentInfo.gender === 3 || this.studentInfo.gender === 0) {
            this.studentInfo.gender = ''
          }
        }
      })
    }
    this.getOptionsList()
  },
  methods: {
    setMoney (index, val) {
      console.log(index, val)
    },
    setOtherMoney (index, val) {
      console.log(index, val)
    },
    paymentChange () {
      this.getPaymentInfo()
    },
    otherPaymentChange () {
      this.getPaymentInfo()
    },
    getPaymentInfo () {
      let amount1 = 0
      let amount2 = 0
      let amount3 = 0
      this.entryData.list.map((v) => {
        let amount = 0
        if ((v[0].payConfig.amount + '').indexOf('待定') >= 0) {
          v[0].payConfig.amount = 0
        }
        v[0].payConfig.payList.map((o) => {
          amount += o.amount * 1
        })
        if (v[0].otherPay) {
          if ((v[0].otherPay.amount + '').indexOf('待定') >= 0) {
            v[0].otherPay.amount = 0
          }
          v[0].otherPay.payList.map((o) => {
            amount += o.amount * 1
          })
        }
        if (v[0].otherPay) {
          amount1 = amount1 + v[0].payConfig.amount + v[0].otherPay.amount
          amount2 += amount
          amount3 = amount3 + v[0].payConfig.amount + v[0].otherPay.amount - amount
        } else {
          amount1 += v[0].payConfig.amount
          amount2 += amount
          amount3 = amount3 + v[0].payConfig.amount - amount
        }
      })
      this.allReceived = amount2
      this.allAmount = amount1
      this.allArrears = amount3
    },
    selectStudentDone (data) {
      this.student = data
      this.studentInfo.name = data.name
      this.studentInfo.telephone = data.telephone
      this.studentInfo.birthday = data.birthday
      this.studentInfo.parent_name = data.parent_name
      this.studentInfo.parent_relation = data.parent_relation
      this.studentInfo.parent_telephone = data.parent_telephone
      this.studentInfo.campus_id = data.campus_id
      this.studentInfo.english_name = data.english_name
      this.studentInfo.grade = data.grade
      this.studentInfo.gender = data.gender
      this.studentInfo.campus = ''
      this.studentInfo.id = data.id
      if (!this.studentInfo.parent_name) {
        this.entryRules.parent_name[0].message = '无'
      }
      if (!this.studentInfo.parent_relation) {
        this.entryRules.parent_relation[0].message = '无'
      }
      if (!this.studentInfo.parent_telephone) {
        this.entryRules.parent_telephone[0].message = '无'
      }
      if (!this.studentInfo.birthday) {
        this.entryRules.birthday[0].message = '无'
      }
      if (!this.studentInfo.grade) {
        this.entryRules.grade[0].message = '无'
      }
      this.entryData.list = []
      this.entryData.totalNum = 0
    },
    getCampusList () {
      staffApi.getCampusList({status: 1}).then(res => {
        this.campusList = res
      })
      if (this.$route.query.type === 'edit') {
        this.studentInfo = JSON.parse(window.localStorage.getItem('editConfig'))
      }
    },
    getAllCampusList () {
      staffApi.getCampusList({status: 1, all: 1}).then(res => {
        this.allCampusList = res
      })
      if (this.$route.query.type === 'edit') {
        this.studentInfo = JSON.parse(window.localStorage.getItem('editConfig'))
      }
    },
    getOptionsList () {
      receptionApi.getOptionsList().then(res => {
        this.gradeList = res.data.grade
      })
    },
    entryClassOpen () {
      this.entryClassConfig.visible = true
    },
    entryCourseOpen () {
      this.entryCourseConfig.visible = true
    },
    selectManageCampus (campusId) {
      this.studentInfo.campus = campusId + ''
      console.log(this.studentInfo)
    },
    selectEntryData (data, deleteList, type) {
      if (this.entryData.totalNum > 0) {
        if (data.length > 0) {
          data.map((v, index) => {
            let num = 0
            this.entryData.list.map((o, i) => {
              if (v[0].id === o[0].id) {
                num += 1
              }
            })
            if (num === 0) {
              let money = (v[0].charge_info.amount + '').indexOf('待定') >= 0 ? (v[0].charge_info.amount + '').split('/')[0] : (v[0].charge_info.amount + '').split('元')[0] * 1
              if (v[0].finish_lessons > 0) {
                if (!v[0].class_name && v[0].type === 1) {
                  v[0].startedData = {
                    allFee: -1,
                    startedLesssons: v[0].finish_lessons
                  }
                } else {
                  v[0].startedData = {
                    allFee: money,
                    startedLesssons: v[0].finish_lessons
                  }
                }
              }
              if (v[0].classOrCourse === 'class' && v[0].type === 1) {
                if (v[0].option_charge.length > 0) {
                  v[0].option_charge.map((o, j) => {
                    if (o.charge_type === 1) {
                      v[0].otherPay = {
                        amount: o.amount * 1,
                        refund_type: o.refund_type,
                        payList: [{
                          type: '4',
                          name: '现金',
                          amount: o.amount > 0 ? '' : 0,
                          surplusMoney: v[0].amount * 1
                        }]
                      }
                    }
                  })
                }
              }
              v[0].payConfig = {
                amount: v[0].remain_fee * 1,
                // amount: 2000,
                payList: [{
                  type: '4',
                  name: '现金',
                  amount: v[0].remain_fee > 0 ? '' : 0,
                  surplusMoney: v[0].remain_fee * 1
                }]
              }
              v[0].showWarning = false
              v[0].showOtherWarning = false
              this.entryData.list.push(v)
            }
          })
        }
      } else {
        this.entryData.list = this.entryData.list.concat(JSON.parse(JSON.stringify(data)))
        this.entryData.list.map((v) => {
          let money = (v[0].charge_info.amount + '').indexOf('待定') >= 0 ? (v[0].charge_info.amount + '').split('/')[0] : (v[0].charge_info.amount + '').split('元')[0] * 1
          if (v[0].finish_lessons > 0) {
            if (!v[0].class_name && v[0].type === 1) {
              v[0].startedData = {
                allFee: -1,
                startedLesssons: v[0].finish_lessons
              }
            } else {
              v[0].startedData = {
                allFee: money,
                startedLesssons: v[0].finish_lessons
              }
            }
          }
          if (v[0].classOrCourse === 'class' && v[0].type === 1) {
            if (v[0].option_charge.length > 0) {
              v[0].option_charge.map((o, j) => {
                if (o.charge_type === 1) {
                  v[0].otherPay = {
                    amount: o.amount * 1,
                    refund_type: o.refund_type,
                    payList: [{
                      type: '4',
                      name: '现金',
                      amount: o.amount * 1 > 0 ? '' : 0,
                      surplusMoney: v[0].amount * 1
                    }]
                  }
                }
              })
            }
          }
          v[0].payConfig = {
            amount: v[0].remain_fee * 1,
            // amount: 2000,
            payList: [{
              type: '4',
              name: '现金',
              amount: v[0].remain_fee > 0 ? '' : 0,
              surplusMoney: v[0].remain_fee * 1
            }]
          }
          v[0].showWarning = false
          v[0].showOtherWarning = false
        })
        this.getPaymentInfo()
        this.entryData.totalNum = this.entryData.list.length
      }
      let list = []
      if (this.entryData.list.length > 0 && deleteList.length > 0) {
        this.entryData.list.map((v, i) => {
          deleteList.map((o, j) => {
            if (v.id === o) {
              list.push(i)
            }
          })
        })
      }
      list.map((v, i) => {
        this.entryData.list.splice(v - i, 1)
      })
      this.entryData.totalNum = this.entryData.list.length
    },
    deleteEntryData (data) {
      this.entryData.list.map((v, i) => {
        if (data.id === v[0].id) {
          this.entryData.list.splice(i + ((this.entryPageConfig.page - 1) * 8), 1)
          if (this.isCharge >= 0) {
            this.getPaymentInfo()
          }
        }
      })
      this.entryData.totalNum -= 1
    },
    changeEntryPage (index) {
      this.entryPageConfig.page = index
    },
    entryClass () {
      if (this.canSubmit) {
        this.canSubmit = false
        this.loading = true
        this.$refs.entryForm.validate((valid) => {
          if (valid) {
            let params = {}
            params = this.studentInfo
            if (this.isCharge >= 0) {
              params.handle = {
                campus: this.studentInfo.campus
              }
            }
            if (this.createType === 'edit') {
              params.student_id = params.id
              if (typeof params.birthday === 'object') {
                params.birthday = formatDate(params.birthday)
              }
              receptionApi.editStudent(params).then(res => {
                this.loading = false
                this.canSubmit = true
                if (res.status_code === 200) {
                  this.$router.back()
                }
              })
            } else {
              if (this.isCharge >= 0) {
                let list = []
                if (this.student.id) {
                  params.student_id = this.student.id
                }
                let canEnter = true
                this.entryData.list.map((v, index) => {
                  // 判断是否填写了学费
                  let num = 0
                  v[0].payConfig.payList.map((o) => {
                    if (!o.amount && o.amount !== 0) {
                      num += 1
                    }
                  })
                  if (num >= 1) {
                    canEnter = false
                    console.log(this.entryData.list[index][0])
                    this.$set(this.entryData.list[index][0], 'showWarning', true)
                    this.$forceUpdate()
                  } else {
                    this.$set(this.entryData.list[index][0], 'showWarning', false)
                    this.$forceUpdate()
                  }
                  let obj = {}
                  if (v[0].classOrCourse === 'course') {
                    obj.course_type = v[0].type
                  } else {
                    // 班级判断是否填写了书本费
                    if (v[0].otherPay) {
                      let num1 = 0
                      v[0].otherPay.payList.map((o) => {
                        if (!o.amount && o.amount !== 0) {
                          num1 += 1
                        }
                      })
                      if (num1 >= 1) {
                        canEnter = false
                        console.log(this.entryData.list[index][0])
                        this.$set(this.entryData.list[index][0], 'showOtherWarning', true)
                        this.$forceUpdate()
                      } else {
                        this.$set(this.entryData.list[index][0], 'showOtherWarning', false)
                        this.$forceUpdate()
                      }
                    }
                  }
                  obj.type = v[0].classOrCourse
                  obj.value = v[0].id
                  if (v[0].classOrCourse === 'class') {
                    obj.pay = v[0].payConfig.payList
                    if (v[0].otherPay) {
                      obj.pay_others = v[0].otherPay.payList
                    }
                  }
                  list.push(obj)
                })
                if (!canEnter) {
                  this.loading = false
                  this.canSubmit = true
                  return
                }
                params.enroll = list
              } else {
                let list = []
                if (this.student.id) {
                  params.student_id = this.student.id
                }
                this.entryData.list.map((v, index) => {
                  let obj = {}
                  if (v[0].classOrCourse === 'course') {
                    obj.course_type = v[0].type
                  }
                  obj.type = v[0].classOrCourse
                  obj.value = v[0].id
                  list.push(obj)
                })
                params.enroll = list
              }
              receptionApi.entryClass(params).then(res => {
                this.loading = false
                this.canSubmit = true
                if (res.status_code === 200) {
                  if (res.key === '密码发送失败') {
                    this.$message({
                      message: res.message,
                      type: 'warning',
                      center: true
                    })
                  }
                  this.$router.back()
                }
              })
            }
          } else {
            this.loading = false
            this.canSubmit = true
            return false
          }
        })
      }
    },
    cancel () {
      this.$router.back()
    },
    handleImport () {
      this.$confirm('确定从咨询本导入吗?', '', {
        confirmButtonText: '确定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round',
        center: true
      }).then(() => {
        setTimeout(() => {
          this.dialogConsultConfig.visible = true
        }, 500)
      }).catch(() => {

      })
    },
    handleSelectConsult (data) {
      this.$refs['entryForm'].resetFields()
      this.studentInfo.name = data.student_name
      this.studentInfo.telephone = data.tel
      if (data.brith_date) {
        this.studentInfo.birthday = data.brith_date
      }
      if (data.grade_id) {
        this.studentInfo.grade = data.grade_id
      }
      if (data.sex) {
        this.studentInfo.gender = data.sex
      }
      this.studentInfo.id = ''
      this.student = {}
    }
  }
}
</script>
<style lang="less">
.studentEntry{
  text-align: left;
  .cac-bread-bar {
    .el-button {
      float: right;
    }
  }
  .studentInfo {
    &>p{
      margin: 15px 0 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .mustLabel::before {
      content: '*';
      color: red;
    }
    .el-form-item {
      .el-select, input, .el-date-editor, .el-input {
        width: 100%;
        height: 50px;
      }
      .el-radio-group {
        height: 50px;
        line-height: 50px;
      }
    }
  }
  .enteryInfo {
    position: relative;
    &>p{
      margin: 15px 0 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .enteryBtnWraper {
      position: absolute;
      top: 0;
      right: 0;
      .el-button {
        width: 106px;
        border-color: #EEE;
      }
    }
    .payment_type {
      margin-bottom: 30px;
      padding: 0 30px 10px 30px;
      background: rgba(249, 251, 252, 1);
    }
    .paymentInfo {
      .paymentInfo_title {
        padding: 0 15px;
      }
      .pay_receivable, .pay_received, .pay_arrears {
        padding: 0 30px 10px 30px;
      }
    }
    .el-table {
      margin-top: 30px;
    }
    .unEntery {
      div {
        display: inline-block;
        width: 300px;
        height: 120px;
        line-height: 36px;
        padding-left: 30px;
        padding-top: 25px;
        margin-right: 10px;
        font-size: 13px;
        border-radius:6px;
        color: #FFF;
        cursor: pointer;
        background:linear-gradient(315deg,rgba(124,197,247,1) 0%,rgba(94,144,255,1) 100%);
        &:last-of-type {
          background:linear-gradient(315deg,rgba(152,222,217,1) 0%,rgba(100,197,201,1) 100%);
        }
        p {
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
    .entryClassDelBtn{
      height: 26px;
    }
  }
  .manageInfo {
    &>p {
      margin: 15px 0 20px;
      font-size: 20px;
      font-weight: bold;
    }
    &>div {
      &>span {
        display: block;
        height: 30px;
        line-height: 30px;
        &::before {
          content: '*';
          color: #F56C6B;
          margin-right: 5px;
        }
      }
    }
    .showWarning {
      visibility: visible !important;
    }
    .el-form-item {
      width: 340px;
    }
  }
  .manageWraper {
    margin-top: 20px;
    .el-button {
      width: 110px;
      height: 40px;
    }
  }
  .import-data {
    padding-bottom: 15px;

    .import-data-button {
      box-sizing: border-box;
      width: 128px;
      min-width: 128px;
      height: 32px;
      > span {
        display: inline-flex;
      }
    }
    span {
      vertical-align: middle;
    }
  }
}
</style>
