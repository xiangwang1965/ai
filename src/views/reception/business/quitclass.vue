<template>
  <div class="quitClass" v-loading.fullscreen.lock="fullLoading">
    <div class="cac-bread-bar quitClassHeader">
      <el-breadcrumb separator="/">
        <router-link v-if="source === 'student'" :to="{ path: '/student' }">学生管理</router-link>
        <a v-else @click="goback">{{source === 'reception' && !$route.query.from ? '业务办理' : '班级管理'}}</a>
          <el-breadcrumb-item class="cac-bread">{{isCharge >= 0 ? '学生退费/班':'学生退班'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="quitClassWraper">
      <div class="studentInfo">
        <div class="selectStudentInfo" v-if="student.id">
          <span class="left">{{student.name}}</span>
          <span class="center">
            <span>
              <span style="padding-right: 20px;border-right: 2px solid rgba(229,236,243,1);">{{student.telephone}}</span>
              <span v-if="isCharge >= 0" style="padding-left: 20px;">{{student.canQuitFee}}个可退费课程/班级</span>
              <span v-else style="padding-left: 20px;">{{student.current_class_count}}个已在班级</span>
            </span>
            <span>{{student.campus_name}}</span>
          </span>
          <el-button v-if="!$route.query.detail" class="clearfix cac-button-two"
            size="mini"
            round
            @click="reChooseStudent">重新选择</el-button>
        </div>
        <el-button
          v-else
          type="primary"
          class="clearfix cac-button-one"
          size="small"
          round
          @click="selectStudentConfig.visible = true">{{student.name || '选择学生'}}</el-button>
      </div>
      <el-form ref="quitForm" size="mini" label-position="top" label-width="80px" :rules="rules" :model="quitStudent">
        <div>
          <el-form-item prop="src_student_id" label="选择课程/班级" v-if="isCharge > 0">
            <el-select placeholder="请选择课程/班级" :disabled="!!$route.query.detail" v-model="quitStudent.src_student_id" @visible-change="openQuitFeeList" @change="selectQuitFee">
              <el-option v-for="item in quitFeeList" :key="item.id" :label="item.course_name" :value="item.id">
                <div>
                  <span>{{item.course_name}}</span>
                  <span>{{item.class_name || '未分班'}}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="src_student_id" label="选择班级" v-else>
            <el-select  placeholder="请选择班级" :disabled="!!$route.query.detail" v-model="quitStudent.src_student_id" @visible-change="openClassList">
              <el-option v-for="outClass in outClassList" :key="outClass.id" :label="outClass.class_name" :value="outClass.id">
                <div>
                  <span>{{outClass.course_name}}</span>
                  <span>{{outClass.class_name || '未分班'}}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="payment_info" v-if="showPayment">
          <div class="title">
            <span>学费剩余</span><span style="color: #FF6968;"><span v-if="quitPayInfo.lesson_left_counts < 0">（欠费不可退班，需补费后再进行转班）</span></span>
          </div>
          <div style="margin-bottom: 10px;display: flex;justify-content: space-between;">
            <p><span>总学费</span><span>{{quitPayInfo.payable | twoFloatFormat}}<span>元（共{{quitPayInfo.lesson_counts}}讲次，剩余{{quitPayInfo.lesson_left_counts}}讲次）</span></span></p>
            <p><span>已收学费</span><span>{{quitPayInfo.payed | twoFloatFormat}}<span>元（已上{{quitPayInfo.lesson_finish_counts}}讲次）</span></span></p>
            <p><span>{{quitPayInfo.left_fee < 0 ? '欠费':'剩余学费'}}</span><span>{{(quitPayInfo.left_fee < 0 ? quitPayInfo.left_fee * -1 : quitPayInfo.left_fee) | twoFloatFormat}}<span>元</span></span></p>
          </div>
          <el-form-item prop="quitType" label="" v-if="isCharge > 0" style="margin-bottom: 20px;padding-bottom: 20px;">
            <span slot="label">
              <span>办理类型</span>
              <span style="color:#ABB9C6;">
                (
              <span>退费说明：</span>
              <span v-if="quitRule === 1">根据未上讲次进行退费</span>
              <span v-if="quitRule === 4">前{{quitRuleCount}}讲退班，全额退费</span>
              <span v-if="quitRule === 5">后{{quitRuleCount}}讲退班，不退费用</span>
                )
              </span>
            </span>
            <el-radio-group v-model="quitStudent.quitType">
              <el-radio :label="'fee'" :disabled="quitPayInfo.left_fee <= 0 && quitPayInfo.left_fee_others <= 0">仅退费</el-radio>
              <el-radio :label="'class'" :disabled="quitPayInfo.can_quit === 0">退费并退课/退班</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="showPayment">
          <quitPayment :showWarning="showWarning" :config="pay" :style="payStyle"></quitPayment>
        </div>
        <div v-if="otherPay && otherPay.payList.length > 0" class="other_pay">
          <p style="height: 50px;line-height: 50px;background: #f9fbfc;">书本费
            <span style="color: #ABB9C6;font-size: 13px;" v-if="bookRefundType !== ''">（退费说明：{{bookRefundType * 1 === 1 ? '开课后不退' : '报名后不退'}}）</span>
          </p>
          <quitPayment :showWarning="showOtherWarning" :config="otherPay"></quitPayment>
        </div>
        <paymentInfo v-if="showPayment" :config="{receivableAmount:allAmount,receivedAmount:allReceived,arrearsAmount:allArrears,allBalance:allBalance}" :style="payStyle" :from="'quit'"></paymentInfo>
        <div class="manageInfo" v-if="isCharge >= 0">
          <p>经办信息</p>
          <el-form-item label="经办校区" prop="campus">
            <selectInputCampus @change="selectManageCampus"></selectInputCampus>
          </el-form-item>
        </div>
        <el-form-item class="remarkItem" prop="remark" label="备注">
          <el-input
            style="width:750px;"
            :rows="2"
            :maxlength="50"
            v-model.trim="quitStudent.remark"
            placeholder="请输入50字以内备注内容（必填）"
            type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="manageWraper">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="quitClass">确 定</el-button>
    </div>
    <selectStudentDialog :config="selectStudentConfig" @select="selectStudentDone" :from="isCharge >= 0 ? 'quit' : ''" :class_type="isCharge >= 0 ? 1 : ''"></selectStudentDialog>
  </div>
</template>
<script>
import selectStudentDialog from '@/components/reception/selectStudentDialog'
import receptionApi from '@/services/reception'
import studentApi from '@/services/student'
import authUtils from '@/services/auth/utils'
import quitPayment from '@/components/quitPayment'
import paymentInfo from '@/components/paymentInfo'
import selectInputCampus from '@/components/selectInputCampus'
import { twoFloatFormat } from '@/utils'
export default {
  props: ['source'],
  data () {
    return {
      selectStudentConfig: {
        visible: false
      },
      fullLoading: false,
      student: {},
      student_id: '',
      quitStudent: {
        src_student_id: '',
        remark: '',
        quitType: 'fee',
        campus: ''
      },
      rules: {
        src_student_id: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        quitType: [
          { required: (this.isCharge > 0 ? 'true' : 'false'), message: '请选择办理类型', trigger: 'blur' }
        ],
        campus: [
          { required: (this.isCharge > 0 ? 'true' : 'false'), message: '请选择经办校区', trigger: 'change' }
        ]
      },
      outClassList: '',
      quitFeeList: '',
      quitPayInfo: {
        lesson_counts: 0,
        lesson_left_counts: 0,
        lesson_finish_counts: 0,
        fee: 0,
        left_fee: 0,
        payed: 0,
        fee_others: 0,
        left_fee_others: 0,
        payed_others: 0
      },
      selectEnrollId: '',
      showPayment: false,
      pay: {
        amount: 0,
        payList: []
      },
      otherPay: {
        amount: 0,
        payList: []
      },
      showWarning: false,
      showOtherWarning: false,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      canSubmit: true,
      quitRule: 1,
      quitRuleCount: 1,
      bookRefundType: ''
    }
  },
  filters: {
    twoFloatFormat
  },
  components: {
    quitPayment: quitPayment,
    paymentInfo: paymentInfo,
    selectStudentDialog: selectStudentDialog,
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
  created () {
    if (this.$route.query.detail) {
      if (this.isCharge >= 0) {
        this.$nextTick(() => {
          this.quitStudent.src_student_id = this.$route.query.enroll_id * 1
        })
      } else {
        this.$nextTick(() => {
          this.quitStudent.src_student_id = this.$route.query.class_id * 1
        })
      }
      this.getStudentDetail()
    }
    if (this.isCharge >= 0) {
      this.rules.src_student_id[0].message = '请选择课程/班级'
    }
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
      if (this.showPayment) {
        if (this.bookRefundType === 1 && this.quitPayInfo.lesson_finish_counts === 0) {
          let leftFee = this.quitPayInfo.left_fee > 0 ? this.quitPayInfo.left_fee : 0
          let leftFeeOthers = this.quitPayInfo.left_fee_others > 0 ? this.quitPayInfo.left_fee_others : 0
          money = leftFee + leftFeeOthers
        } else {
          money = this.quitPayInfo.left_fee > 0 ? this.quitPayInfo.left_fee : 0
        }
      }
      return money
    },
    allReceived () {
      let amount = 0
      if (this.showPayment) {
        this.pay.payList.map((v) => {
          amount += v.amount * 1
        })
        if (this.otherPay) {
          this.otherPay.payList.map((v) => {
            amount += v.amount * 1
          })
        }
      }
      return amount
    },
    allArrears () {
      if (this.allAmount > 0) {
        return this.allReceived - this.allAmount
      } else {
        if (this.quitPayInfo.left_fee_others) {
          return this.quitPayInfo.left_fee + this.quitPayInfo.left_fee_others
        }
        return this.quitPayInfo.left_fee
      }
    },
    allBalance () {
      if (this.allAmount > 0) {
        return this.allAmount - this.allReceived
      } else {
        if (this.quitPayInfo.left_fee_others) {
          return this.quitPayInfo.left_fee + this.quitPayInfo.left_fee_others
        }
        return this.quitPayInfo.left_fee
      }
    }
  },
  methods: {
    goback () {
      this.$router.back()
    },
    selectStudentDone (data) {
      this.quitStudent.src_student_id = ''
      this.quitStudent.src_class_id = ''
      this.student = data
      this.student_id = data.id
      this.quitStudent.vd_student_id = data.vd_id
      if (this.isCharge >= 0) {
        this.showPayment = false
      }
    },
    getStudentDetail () {
      let params = {
        student_id: this.$route.query.student_id
      }
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.student = res.data
          if (this.isCharge >= 0) {
            this.openQuitFeeList(true)
          } else {
            this.openClassList(true)
          }
        }
      })
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
    openQuitFeeList (status) {
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
          student_id: this.student.id,
          type: 1
        }
        receptionApi.addQuitFeeList(params).then(res => {
          this.quitFeeList = res.data
          if (this.$route.query.detail) {
            this.selectQuitFee(this.$route.query.enroll_id)
          }
        })
      }
    },
    selectQuitFee (val) {
      this.quitStudent.quitType = 'fee'
      let params = {
        student_id: this.student.id,
        student_type: 1
      }
      if (!val) {
        params.id = this.$route.query.enroll_id
      } else {
        params.id = val
      }
      // 判断退费/班扣费类型
      if (this.quitFeeList) {
        this.quitFeeList.map((v, i) => {
          if (v.id * 1 === val * 1) {
            this.quitRule = v.goods_withdraw_ruler_type
            this.quitRuleCount = v.goods_withdraw_ruler_amount
            this.bookRefundType = v.option_withdraw_ruler_type
          }
        })
      }
     /* if (row.option_charge) {
        row.option_charge.map((v, i) => {
          if (v.charge_type === 1) {
            this.bookRefundType = v.refund_type
          }
        })
      } */
      receptionApi.getClassAmount(params).then((res) => {
        if (res.ok) {
          this.showPayment = true
          this.quitPayInfo = res.data
          this.quitPayInfo.fee *= 1
          this.quitPayInfo.fee_others *= 1
          this.quitPayInfo.left_fee *= 1
          this.quitPayInfo.left_fee_others *= 1
          this.quitPayInfo.payable *= 1
          this.quitPayInfo.payable_others *= 1
          this.quitPayInfo.payed *= 1
          this.quitPayInfo.payed_others *= 1
          if (this.quitPayInfo.left_fee <= 0 && this.quitPayInfo.left_fee_others <= 0) {
            this.quitStudent.quitType = 'class'
            if (this.quitPayInfo.can_quit === 0) {
              this.quitStudent.quitType = ''
            }
          }
          this.showWarning = false
          this.showOtherWarning = false
          this.pay = {
            amount: this.quitPayInfo.left_fee > 0 ? this.quitPayInfo.left_fee : 0,
            payList: [{
              type: '4',
              name: '现金',
              amount: '',
              surplusMoney: this.quitPayInfo.left_fee > 0 ? this.quitPayInfo.left_fee : 0
            }]
          }
          if (this.quitPayInfo.fee_others >= 0) {
            var otherFee = this.quitPayInfo.payed_others > 0 ? this.quitPayInfo.payed_others : 0
            if (this.quitPayInfo.left_fee_others <= 0) {
              otherFee = 0
            }
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
    reChooseStudent () {
      this.selectStudentConfig.visible = true
    },
    selectManageCampus (campusId) {
      this.quitStudent.campus = campusId
    },
    quitClass () {
      if (this.canSubmit) {
        this.canSubmit = false
        this.fullLoading = true
        console.log(this.quitStudent)
        this.$refs.quitForm.validate((valid) => {
          console.log(valid)
          if (valid) {
            let params = {
              student_id: this.student.id,
              remark: this.quitStudent.remark
            }
            if (this.isCharge < 0) {
              params.class_id = this.quitStudent.src_student_id
            } else {
              this.quitFeeList.map((v, i) => {
                if (v.id === this.quitStudent.src_student_id) {
                  params.class_id = v.class_id
                }
              })
            }
            if (this.isCharge >= 0) {
              let num = 0
              this.pay.payList.map((o) => {
                if (o.amount === '' && this.pay.amount !== 0 && this.quitPayInfo.left_fee * 1 >= 0) {
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
                  if (o.amount === '' && this.otherPay.amount !== 0 && this.quitPayInfo.payed_others >= 0) {
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
            }
            if (this.canSubmit) {
              return
            }
            if (this.isCharge >= 0 && this.quitStudent.quitType === 'fee') {
              params.pay = this.pay.payList
              if (this.otherPay && this.otherPay.amount) {
                params.pay_others = this.otherPay.payList
              }
              params.handle = {
                campus: this.quitStudent.campus
              }
              params.id = this.quitStudent.src_student_id
              params.class_id = this.$route.query.class_id
              receptionApi.refund(params).then(res => {
                this.canSubmit = true
                this.fullLoading = false
                if (res.status_code === 200) {
                  this.$router.back()
                }
              })
            } else {
              if (this.isCharge >= 0) {
                params.pay = this.pay.payList
                if (this.otherPay && this.otherPay.amount) {
                  params.pay_others = this.otherPay.payList
                }
                params.handle = {
                  campus: this.quitStudent.campus
                }
              }
              receptionApi.quitClass(params).then(res => {
                this.canSubmit = true
                this.fullLoading = false
                if (res.status_code === 200) {
                  this.$router.back()
                }
              })
            }
          } else {
            this.canSubmit = true
            this.fullLoading = false
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
.quitClass {
  text-align: left;
  .quitClassHeader{
    a {
      line-height: 30px;
    }
  }
  .quitClassWraper {
    .studentInfo {
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
    .el-form {
      .el-form-item {
        margin-bottom: 25px;
        .el-form-item__label {
          color: #7A808D;
        }
        .el-select {
          width: 340px;
          .el-input, input {
            height: 50px;
          }
        }
        input {
          height: 50px;
        }
        textarea {
          font-size: 13px;
          padding: 15px;
        }
      }
      .payment_info {
        width: 750px;
        background-color: #F9FBFC;
        padding: 0 15px;
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
      .paymentInfo {
        margin-bottom: 20px;
        .paymentInfo_title {
          margin-top: -5px;
        }
      }
      .manageInfo {
        &>p {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .el-form-item {
          width: 340px;
        }
      }
      .remarkItem {
        .el-form-item__label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
          &::before {
            content: '';
            margin-right: 0;
          }
        }
      }
      .other_pay {
        width: 750px;
        background: #f9fbfc;
        margin-top: 20px;
        padding: 0 15px;
      }
    }
    .el-button {
      margin-bottom: 20px;
    }
  }
  .manageWraper {
    .el-button {
      margin-top: 20px;
      width: 110px;
      height: 40px;
    }
  }
}
</style>
