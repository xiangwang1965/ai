<template>
  <div class="changeClass" v-loading.fullscreen.lock="fullLoading">
    <div class="cac-bread-bar changeClassHeader">
      <el-breadcrumb separator="/">
        <router-link v-if="source === 'student'" :to="{ path: '/student' }">学生管理</router-link>
        <a v-else @click="goback">{{source === 'reception' && !$route.query.from ? '业务办理' : '班级管理'}}</a>
          <el-breadcrumb-item class="cac-bread">学生转班</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="changeClassWraper">
      <div class="studentInfo">
        <div class="selectStudentInfo" v-if="student.id">
          <span class="left">{{student.name}}</span>
          <span class="center">
            <span>
              <span style="padding-right: 20px;border-right: 2px solid rgba(229,236,243,1);">{{student.telephone}}</span>
              <span style="padding-left: 20px;">{{student.current_class_count}}个已在班级</span>
            </span>
            <span>{{student.campus_name}}</span>
          </span>
          <el-button v-if="!$route.query.detail" class="clearfix cac-button-two"
            size="mini"
            round
            @click="selectStudentConfig.visible = true">重新选择</el-button>
        </div>
        <el-button
          v-else
          type="primary"
          class="clearfix cac-button-one"
          size="small"
          round
          @click="selectStudentConfig.visible = true">选择学生</el-button>
      </div>
      <el-form ref="transferForm" :class="{'chargeChange': isCharge > 0}" size="mini" label-position="top" label-width="80px" :rules="rules" :model="transferStudent">
        <div class="left">
          <p>转出信息</p>
          <el-form-item label="选择班级" prop="src_class_id">
            <el-select placeholder="请选择转出班级" :disabled="!!$route.query.detail" v-model="transferStudent.src_class_id" clearable @visible-change="openClassList" @change="selectOutClass">
              <el-option v-for="outClass in outClassList" :key="outClass.id" :value="outClass.id" :label="outClass.class_name">
                <template>
                  <div>
                    <span :title="outClass.class_name">{{outClass.class_name}}</span>
                    <span :title="outClass.course_name">{{outClass.course_name}}</span>
                  </div>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </div><div class="middle">
          <i class="icon-cac-transfer-class"></i>
        </div><div class="right">
          <p>转入信息</p>
          <el-form-item label="选择班级" prop="tar_class_id">
            <el-select popper-class="visibilityDown" placeholder="请选择转入班级" v-model="transferStudent.tar_class_id" clearable @visible-change="openInClassList" @change="selectInClass">
              <el-option v-for="inClass in inClassList" :key="inClass.id" :label="inClass.class_name" :value="inClass.id">
                <div>
                  <span>{{inClass.class_name}}</span>
                  <span>{{inClass.course_name}}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="payContent" v-if="isCharge > 0 && showOutPay">
          <div>
            <div class="title">
              <span style="font-weight: 500;">学费剩余</span><span style="color: #FF6968;" v-if="outPayInfo.lesson_left_counts < 0">（欠费不可转班，需补费后再进行转班）</span>
            </div>
            <div>
              <p><span>总学费</span><span>{{outPayInfo.fee}}<span>元（共{{outPayInfo.lesson_counts}}讲次，剩余{{outPayInfo.lesson_left_counts}}讲次）</span></span></p>
              <p><span>已收学费</span><span>{{outPayInfo.payed}}<span>元（已上{{outPayInfo.lesson_finish_counts}}讲次）</span></span></p>
              <p><span>剩余学费</span><span>{{outPayInfo.left_fee}}<span>元</span></span></p>
            </div>
          </div>
          <div v-if="showInPay">
            <div class="title">
              <span style="font-weight: 500;">应收</span>
            </div>
            <div>
              <p><span>总学费</span><span>{{inPayInfo.fee}}<span>元（共{{inPayInfo.lesson_counts}}讲次，剩余{{inPayInfo.lesson_left_counts}}讲次）</span></span></p>
              <p><span>应收学费</span><span>{{inPayInfo.left_fee}}<span>元</span></span></p>
            </div>
          </div>
        </div>
        <paymentType v-if="isCharge >= 0 && showInPay" :payTitle="withdraw_text" :showWarning="showWarning" :config="pay" :selfStyle="payStyle" :transferAmount="outPayInfo.left_fee"></paymentType>
        <div v-if="isCharge >= 0 && showInPay && otherPay && otherPay.payList.length > 0" style="margin-top: 20px;width: 750px;">
          <p style="height: 50px;line-height: 50px;padding-left: 15px;background: #f9fbfc;">书本费
            <!--<span style="color: #ABB9C6;font-size: 13px;">（退费说明：{{bookRefundType === 1 ? '开课后不退' : '报名后不退'}}）</span>-->
          </p>
          <paymentType :config="otherPay" :payTitle="option_withdraw_text" :showWarning="showOtherWarning" :selfStyle="payStyle"></paymentType>
        </div>
        <paymentInfo v-if="isCharge >= 0 && showInPay" :config="{receivableAmount:allAmount,receivedAmount:allReceived}" :selfStyle="payStyle"></paymentInfo>
        <br>
        <div class="manageInfo" v-if="isCharge > 0">
          <p>经办信息</p>
          <el-form-item label="经办校区" prop="campus">
            <selectInputCampus @change="selectManageCampus"></selectInputCampus>
          </el-form-item>
        </div>
        <div style="display:block;">
          <el-form-item class="remarkItem" label="备注" prop="remark">
            <el-input
              class="remarkText"
              type="textarea"
              :maxlength="50"
              v-model.trim="transferStudent.remark"
              placeholder="请输入50字以内备注内容（必填）">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="manageWraper">
        <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="changeClass">确 定</el-button>
      </div>
    </div>
    <el-dialog class="changeClassDialog" title="班级选择" append-to-body :visible.sync="changeConfig.visible" @open="openInClassList" width="1200px">
      <div>
        <!-- <el-select v-model="searchConfig.teach_type" clearable placeholder="授课方式">
          <el-option v-for="teachType in teachTypeList" :key="teachType.key" :value="teachType.key" :label="teachType.value"></el-option>
        </el-select> -->
        <el-select v-model="searchConfig.course_type_id" clearable placeholder="课程类型">
          <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.course_type_name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.grade_id" clearable placeholder="年级">
          <el-option v-for="grade in gradeList" :key="grade.grade_id" :value="grade.grade_id" :label="grade.grade_name"></el-option>
        </el-select>
        <el-select v-model="searchConfig.class_type_id" clearable placeholder="班型">
          <el-option v-for="level in levelList" :key="level.class_level_id" :value="level.class_level_id" :label="level.class_level_name"></el-option>
        </el-select>
        <el-button type="primary" class="cac-button-one spc_filter" size="mini" round @click="openInClassList">筛选</el-button>
        <el-input class="searchInput" v-model="searchConfig.key" @keyup.enter.native="openInClassList" placeholder="课程、主讲老师">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="openInClassList"></i>
        </el-input>
      </div>
      <el-table
        ref="classTable"
        :data="inClassList"
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
        <el-table-column prop="" label="年级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.grade">
              <span v-for="grade in gradeList" :key="grade.grade_id" v-if="grade.grade_id == scope.row.grade">{{grade.grade_name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="class_type_name" label="班型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.class_type">
              <span v-for="grade in levelList" :key="grade.class_level_id" v-if="grade.class_level_id == scope.row.class_type">{{grade.class_level_name}}</span>
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="teacher_name" label="主讲老师" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="teach_type_name" label="授课方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">双师</span>
            <span v-if="scope.row.type === 2">双师</span>
            <span v-if="scope.row.type === 3">面授</span>
            <span v-if="scope.row.type === 4">AI</span>
          </template>
        </el-table-column>
        <el-table-column prop="campus_name" label="校区" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="start_time" label="开课时间" width="220" align="center" show-overflow-tooltip>

        </el-table-column>
        <el-table-column v-if="isCharge >= 0" prop="lesson_counts" width="100" align="center" :label="isCharge >= 0 ? '已开/总讲次':'讲次'" show-overflow-tooltip>

        </el-table-column>
        <el-table-column v-if="isCharge >= 0" prop="start_time" label="收费" width="130" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.charge_amount}} 元</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="openInClassList"></pagination>
      <div slot="footer" class="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button " round @click="doneSelectClass">确 定</el-button>
      </div>
    </el-dialog>
    <selectStudentDialog :config="selectStudentConfig" @select="selectStudentDone"></selectStudentDialog>
  </div>
</template>
<script>
import selectStudentDialog from '@/components/reception/selectStudentDialog'
import pagination from '@/components/pagination'
import paymentType from '@/components/paymentType'
import paymentInfo from '@/components/paymentInfo'
import selectInputCampus from '@/components/selectInputCampus'
import studentApi from '@/services/student'
import receptionApi from '@/services/reception'
import authUtils from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'
export default {
  props: ['source'],
  data () {
    return {
      selectStudentConfig: {
        visible: false
      },
      fullLoading: false,
      student: {},
      transferStudent: {
        src_class_id: '',
        tar_class_id: '',
        remark: '',
        campus: ''
      },
      rules: {
        src_class_id: [
          { required: true, message: '请选择转出班级', trigger: 'change' }
        ],
        tar_class_id: [
          { required: true, message: '请选择转入班级', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ],
        campus: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请选择经办校区', trigger: 'change' }
        ]
      },
      outClassList: [],
      inClassList: [],
      changeConfig: {
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
      courseTypeList: [{
        id: 1,
        course_type_name: '长期班'
      }, {
        id: 2,
        course_type_name: '短期班'
      }, {
        id: 3,
        course_type_name: '体验班'
      }],
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      searchConfig: {
        // teach_type: '',
        course_type_id: '',
        grade_id: '',
        class_type_id: '',
        key: ''
      },
      class_id: '',
      outPayInfo: {
        lesson_counts: 0,
        lesson_left_counts: 0,
        lesson_finish_counts: 0,
        fee: 0,
        left_fee: 0,
        payed: 0
      },
      inPayInfo: {
        lesson_counts: 0,
        lesson_left_counts: 0,
        lesson_finish_counts: 0,
        fee: 0,
        left_fee: 0,
        payed: 0
      },
      withdraw_text: '',
      option_withdraw_text: '',
      pay: {
        amount: 0,
        payList: []
      },
      otherPay: {
        amount: 0,
        payList: []
      },
      showOutPay: false,
      showInPay: false,
      isWisroom: authUtils.getUser().third_part === 'wisroom' ? 'wisroom' : -1,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      canSubmit: true,
      bookRefundType: '',
      showWarning: false,
      showOtherWarning: false
    }
  },
  components: {
    selectStudentDialog: selectStudentDialog,
    pagination: pagination,
    paymentType: paymentType,
    paymentInfo: paymentInfo,
    selectInputCampus: selectInputCampus
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/student' || to.path === '/reception') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  computed: {
    payStyle () {
      return {
        'width': '750px',
        'padding': '5px 15px'
      }
    },
    allAmount () {
      let money = 0
      if (this.showInPay) {
        money = this.inPayInfo.left_fee_others * 1 + this.inPayInfo.left_fee * 1
      }
      return money >= 0 ? money : 0
    },
    allClassAmount () {
      let money = 0
      if (this.showInPay) {
        money = this.inPayInfo.left_fee * 1 - this.outPayInfo.left_fee * 1
      }
      return money >= 0 ? money : 0
    },
    allReceived () {
      let amount = 0
      if (this.outPayInfo.left_fee * 1 >= 0) {
        if (this.showInPay) {
          this.pay.payList.map((v) => {
            amount += v.amount * 1
          })
          this.otherPay.payList.map((v) => {
            amount += v.amount * 1
          })
          amount += this.outPayInfo.left_fee * 1
        }
      } else {
        if (this.showInPay) {
          this.pay.payList.map((v) => {
            amount += v.amount * 1
          })
          this.otherPay.payList.map((v) => {
            amount += v.amount * 1
          })
        }
      }
      return amount
    },
    allArrears () {
      let money = 0
      if (this.showInPay) {
        if (this.inPayInfo.left_fee * 1 - this.outPayInfo.left_fee * 1 >= 0) {
          money = this.allAmount - this.allReceived
        } else {
         /* let money1 = 0
          this.otherPay.payList.map((v) => {
            money1 += v.amount * 1
          }) */
          money = this.inPayInfo.left_fee * 1 + this.inPayInfo.left_fee_others * 1 - this.allReceived
        }
      }
      return money
    },
    allBalance () {
      let money = 0
      if (this.showInPay) {
        if (this.inPayInfo.left_fee * 1 - this.outPayInfo.left_fee * 1 >= 0) {
          money = this.allReceived - this.allAmount
        } else {
          /* let money1 = 0
          this.otherPay.payList.map((v) => {
            money1 += v.amount * 1
          }) */
          money = this.allReceived - this.inPayInfo.left_fee * 1 - this.inPayInfo.left_fee_others * 1
        }
      }
      return money
    }
  },
  created () {
    if (this.$route.query.detail) {
      this.transferStudent.src_class_id = this.$route.query.class_id * 1
      this.getStudentDetail()
    }
    this.getOptionsList()
  },
  methods: {
    goback () {
      this.$router.back()
    },
    getOptionsList () {
      receptionApi.getOptionsList().then(res => {
        this.courseTypeList = res.data.course_types
        this.gradeList = res.data.grade
        this.levelList = res.data.class_type
      })
    },
    /* getClassLevelList () {
      let params = {
        school_id: this.schoolId
      }
      receptionApi.getOptionsList(params).then(res => {
        this.levelList = res.data.class_type
      })
    }, */
    /* getGradeList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getGradeList(params).then(res => {
        this.gradeList = res
      })
    }, */
    getStudentDetail () {
      let params = {
        student_id: this.$route.query.student_id
      }
      studentApi.queryDetail(params).then(res => {
        this.loading = false
        if (res.ok) {
          this.loading1 = false
          this.student = res.data
          this.openClassList(true)
          this.selectOutClass(this.$route.query.class_id)
        }
      })
    },
    selectOutClass (val) {
      this.transferStudent.tar_class_id = ''
      this.showInPay = false
      if (!val) {
        this.showOutPay = false
        this.showInPay = false
        return
      }
      let params = {
        student_id: this.student.id,
        id: val,
        type: 2,
        student_type: 0
      }
      receptionApi.getClassAmount(params).then((res) => {
        if (res.ok) {
          this.showOutPay = true
          this.outPayInfo = res.data
        }
      })
    },
    selectInClass (val) {
      if (!val) {
        this.showInPay = false
        this.transferStudent.tar_class_id = ''
      }
    },
    selectClass (row) {
      this.$refs.classTable.setCurrentRow(row, true)
      setTimeout(() => {
        this.$refs.classTable.setCurrentRow(row)
      }, 10)
      this.class_id = row.id
      this.withdraw_text = row.withdraw_text
      this.option_withdraw_text = row.option_withdraw_text
      if (row.option_charge) {
        row.option_charge.map((v, i) => {
          if (v.charge_type === 1) {
            this.bookRefundType = v.refund_type
          }
        })
      }
    },
    selectStudentDone (data) {
      this.transferStudent.src_class_id = ''
      this.transferStudent.tar_class_id = ''
      this.student = data
      this.showOutPay = false
      this.showInPay = false
    },
    cancelSelect () {
      this.changeConfig.visible = false
    },
    openClassList (status) {
      if (status) {
        if (!this.student.id) {
          this.$message({
            message: '请先选择学生',
            type: 'warning',
            center: true
          })
          return
        }
        let params = {
          student_id: this.student.id
        }
        receptionApi.getClassList(params).then(res => {
          this.outClassList = res.data.list
        })
      }
    },
    openInClassList (status) {
      if (status) {
        if (!this.transferStudent.src_class_id) {
          this.$message({
            message: '请先选择转出班级',
            type: 'warning',
            center: true
          })
          return
        }
        if (this.outPayInfo.left_fee < 0) {
          this.$message({
            message: '欠费班级不可转出',
            type: 'warning',
            center: true
          })
          return
        }
        this.changeConfig.visible = true
        if (typeof status === 'number') {
          this.pageConfig.page = status
        }
        let params = {
          student_id: this.student.id,
          class_id: this.transferStudent.src_class_id,
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
            this.gradeList.map((o, i) => {
              if (v.grade === o.grade_id) {
                v.grade_name = o.grade_name
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
            this.courseTypeList.map((o, i) => {
              if (v.course_type === o.id) {
                v.course_type_name = o.course_type_name
              }
            })
            {
              let num = 0
              this.courseTypeList.map((o, i) => {
                if (v.class_type === o.id) {
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
          this.inClassList = res.data.list
          this.pageConfig.total = res.data.total_count
          console.log(1234, requireAgainPage(this.pageConfig))
          if (requireAgainPage(this.pageConfig) > 0) {
            this.openInClassList(requireAgainPage(this.pageConfig))
          }
        })
      }
    },
    doneSelectClass () {
      if (!this.class_id) {
        return
      }
      this.pay = {
        amount: 0,
        payList: []
      }
      this.otherPay = {
        amount: 0,
        payList: []
      }
      this.inPayInfo = {
        lesson_counts: 0,
        lesson_left_counts: 0,
        lesson_finish_counts: 0,
        fee: 0,
        left_fee: 0,
        payed: 0
      }
      this.transferStudent.tar_class_id = this.class_id
      this.changeConfig.visible = false
      let params = {
        id: this.transferStudent.tar_class_id,
        type: 2
      }
      receptionApi.getClassAmount(params).then((res) => {
        if (res.ok) {
          this.showInPay = true
          this.inPayInfo = res.data
          this.pay = {
            amount: this.allClassAmount,
            payList: [{
              type: '4',
              name: '现金',
              amount: '',
              surplusMoney: this.allClassAmount
            }]
          }
          if (res.data.fee_others * 1 >= 0) {
            var otherFee = res.data.fee_others * 1 > 0 ? res.data.fee_others * 1 : 0
            this.otherPay = {
              amount: otherFee,
              payList: [{
                type: '4',
                name: '现金',
                amount: '',
                surplusMoney: otherFee
              }]
            }
          }
        }
      })
    },
    selectManageCampus (campusId) {
      this.transferStudent.campus = campusId
    },
    changeClass () {
      if (this.canSubmit) {
        this.canSubmit = false
        this.fullLoading = true
        this.$refs.transferForm.validate((valid) => {
          if (valid) {
            if (this.isCharge >= 0) {
              let num = 0
              this.pay.payList.map((o) => {
                if (o.amount === '' && this.pay.amount !== 0 && this.inPayInfo.left_fee * 1 >= 0) {
                  num += 1
                }
              })
              if (num >= 1) {
                this.$set(this, 'showWarning', true)
                this.$forceUpdate()
              } else {
                this.$set(this, 'showWarning', false)
                this.$forceUpdate()
              }
              if (num >= 1) {
                this.canSubmit = true
                this.fullLoading = false
              }
              if (this.otherPay) {
                let num1 = 0
                this.otherPay.payList.map((o) => {
                  if (o.amount === '' && this.otherPay.amount !== 0 && this.inPayInfo.fee_others * 1 >= 0) {
                    num1 += 1
                  }
                })
                if (num1 >= 1) {
                  this.$set(this, 'showOtherWarning', true)
                  this.$forceUpdate()
                } else {
                  this.$set(this, 'showOtherWarning', false)
                  this.$forceUpdate()
                }
                if (num1 >= 1) {
                  this.canSubmit = true
                  this.fullLoading = false
                }
              }
              if (this.canSubmit) {
                return
              }
            }
            let params = {
              student_id: this.student.id,
              vd_student_id: this.student.vd_id,
              src_class_id: this.transferStudent.src_class_id,
              tar_class_id: this.transferStudent.tar_class_id,
              remark: this.transferStudent.remark,
              pay: this.pay.payList,
              pay_others: this.otherPay.payList,
              handle: {
                campus: this.transferStudent.campus
              }
            }
            if (this.isCharge >= 0 && this.outPayInfo.option_withdraw_ruler_type === 1 && this.outPayInfo.lesson_finish_counts === 0 && this.outPayInfo.payed_others > 0) {
              this.$msgbox({
                title: '提示',
                message: '转出班级有可退的书本费用，进行退班可退出，进行转班则不退出，请谨慎操作',
                confirmButtonText: '确定',
                confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
                cancelButtonText: '取 消',
                cancelButtonClass: 'cac-button-two dialog_cancel_button is-round',
                showCancelButton: true
              }).then(() => {
                receptionApi.transferClass(params).then(res => {
                  this.fullLoading = false
                  this.canSubmit = true
                  if (res.ok) {
                    this.$router.back()
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                })
                this.fullLoading = false
                this.canSubmit = true
              })
            } else {
              receptionApi.transferClass(params).then(res => {
                this.fullLoading = false
                this.canSubmit = true
                if (res.ok) {
                  this.$router.back()
                }
              })
            }
          } else {
            this.fullLoading = false
            this.canSubmit = true
            return false
          }
        })
      }
    },
    cancel () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less">
.changeClass{
  text-align: left;
  .changeClassHeader{
    a {
      line-height: 30px;
    }
  }
  .changeClassWraper {
    .studentInfo {
      width: 100%;
      margin-bottom: 20px;
      .selectStudentInfo {
        width: 750px;
        height: 80px;
        padding: 10px;
        line-height: 30px;
        background-color: #FAFCFD;
        .left {
          display: inline-block;
          width: 150px;
          vertical-align: top;
          font-size: 20px;
          font-weight: 500;
        }
        .center {
          display: inline-block;
          width: 400px;
          & > span {
            display: block;
          }
        }
        &>span {
          display: inline-block;
          width: 130px;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-button {
          float: right;
          margin-top: 15px;
        }
      }
    }
    &>.el-button {
      margin-bottom: 20px;
    }
    .el-select-dropdown .el-select-dropdown__item > div.class_list span:first-child{
      font-weight: blod;
    }
    .el-form {
      margin-bottom: 20px;
      .left, .right, .manageInfo {
        display: inline-block;
        width: 340px;
        vertical-align: top;
        min-height: 120px;
        margin-bottom: 30px;
        &>p {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      }
      .middle {
        display: inline-block;
        vertical-align: middle;
        width: 70px;
        height: 120px;
        i {
          margin-top: 84px;
          margin-left: 25px;
          margin-left: 15px;
        }
      }
      .manageInfo {
        margin-bottom: 0;
        .el-form-item {
          width: 340px;
        }
      }
      .remarkItem {
        .el-form-item__label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50 !important;
          &::before {
            content: '';
            margin-right: 0;
          }
        }
      }
      .payContent {
        display: none;
        width: 750px;
        background: #FAFCFD;
        p, .title {
          line-height: 20px;
          display: flex;
          justify-content: space-between;
        }
        .title {
          line-height: 50px;
        }
        p {
          &>span {
            color: #7A808D;
            &:last-of-type {
              color: #3C75F6;
              span {
                color: #7A808D;
              }
            }
          }
        }
      }
      .el-form-item {
        margin-bottom: 25px;
        .el-form-item__label {
          height: 40px !important;
          color: #7A808D;
        }
        .el-select {
          width: 340px;
        }
        input {
          height: 50px;
          font-size: 13px;
        }
        textarea {
          font-size: 13px;
          padding: 15px;
        }
      }
    }
    .chargeChange {
      .left, .right {
        margin-bottom: 0;
      }
      .payContent {
        display: flex;
        justify-content: space-between;
        &>div {
          width: 340px;
          padding-left: 15px;
        }
      }
    }
    .mustTitle {
      font-size: 13px;
      color: #7A808D;
      margin-bottom: 10px;
      &::before {
        content: '*';
        color: #FF6968;
      }
    }
    .changeOutClass,.changeInClass {
      display: inline-block;
      width: 340px;
      margin-right: 80px;
      margin-bottom: 30px;
      .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 25px;
      }
      .el-select {
        width: 340px;
      }
    }
    .changeInClass {
      margin-right: 0;
    }
    .remarkText {
      width: 770px;
    }
    .manageWraper {
      .el-button {
        margin-top: 30px;
        width: 110px;
        height: 40px;
      }
    }
  }
}
</style>
