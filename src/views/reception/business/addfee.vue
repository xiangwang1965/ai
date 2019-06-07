<template>
  <div class="addFee" v-loading.fullscreen.lock="fullLoading">
    <div class="cac-bread-bar changeClassHeader">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/reception' }">{{'业务办理'}}</router-link>
        <el-breadcrumb-item class="cac-bread">学生补费</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="addFeeWrapper">
      <div class="studentInfo">
        <div class="selectStudentInfo" v-if="student.id">
          <span class="left">{{student.name}}</span>
          <span class="center">
            <span>
              <span style="padding-right: 20px;border-right: 2px solid rgba(229,236,243,1);">{{student.telephone}}</span>
              <span style="padding-left: 20px;">{{student.canAddFee}}个可补费课程/班级</span>
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
      <el-form ref="form" label-position="top" label-width="80px" :rules="rules" :model="addFeeForm">
        <el-form-item label="选择课程/班级" prop="class_id" style="margin-bottom: 20px;">
          <el-select :disabled="!!$route.query.detail" placeholder="请选择补费课程/班级" v-model="addFeeForm.class_id" clearable @visible-change="openAddList" @change="selectAddFee">
            <el-option v-for="item in addFeeList" :key="item.class_id" :label="item.course_name" :value="item.class_id">
              <div>
                <span>{{item.course_name}}</span>
                <span>{{item.class_name || '未分班'}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <addFeePayment v-if="showPayment" :showWarning="showWarning" :config="pay" :selfStyle="payStyle" @change="paymentChange"></addFeePayment>
        <div v-if="showPayment && otherPay && otherPay.payList.length > 0" style="margin-top: 20px;width: 750px;padding: 0 15px;background: #f9fbfc;">
          <p style="height: 50px;line-height: 50px;">书本费
            <span style="color: #ABB9C6;font-size: 13px;">（退费说明：{{bookRefundType === 1 ? '开课后不退' : '报名后不退'}}）</span>
          </p>
          <addFeePayment v-if="showPayment" :showWarning="showOtherWarning" :config="otherPay" @change="paymentChange"></addFeePayment>
        </div>
        <paymentInfo v-if="showPayment" :config="{receivableAmount:allAmount,receivedAmount:allReceived,arrearsAmount:allArrears}" :selfStyle="payStyle"></paymentInfo>
        <div class="manageInfo">
          <p>经办信息</p>
          <el-form-item label="经办校区" prop="campus">
            <selectInputCampus @change="selectManageCampus"></selectInputCampus>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="manageWraper">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="addFee">确 定</el-button>
    </div>
    <selectStudentDialog :config="selectStudentConfig" @select="selectStudentDone" :from="'addfee'" :class_type="2"></selectStudentDialog>
  </div>
</template>
<script>
  import selectStudentDialog from '@/components/reception/selectStudentDialog'
  import addFeePayment from '@/components/addFeePayment'
  import paymentInfo from '@/components/paymentInfo'
  import selectInputCampus from '@/components/selectInputCampus'
  import receptionApi from '@/services/reception'
  import studentApi from '@/services/student'
  export default {
    data () {
      return {
        selectStudentConfig: {
          visible: false
        },
        fullLoading: false,
        student: {},
        addFeeStudent: {

        },
        addFeeForm: {
          class_id: '',
          campus: ''
        },
        rules: {
          class_id: [
            { required: true, message: '请选择补费课程/班级', trigger: 'change' }
          ],
          campus: [
            { required: true, message: '请选择经办校区', trigger: 'change' }
          ]
        },
        addFeeList: [],
        pay: {
          amount: 0,
          payList: []
        },
        otherPay: {
          amount: 0,
          payList: []
        },
        allAmount: 0,
        allReceived: 0,
        allArrears: 0,
        enroll_id: '',
        showPayment: false,
        canSubmit: true,
        quitRule: 1,
        quitRuleCount: 1,
        bookRefundType: '',
        showWarning: false,
        showOtherWarning: false
      }
    },
    components: {
      selectStudentDialog,
      addFeePayment,
      paymentInfo,
      selectInputCampus
    },
    computed: {
      payStyle () {
        return {
          'width': '750px',
          'padding': '5px 15px'
        }
      }
    },
    created () {
      if (this.$route.query.detail) {
        this.addFeeForm.class_id = this.$route.query.class_id * 1
        this.getStudentDetail()
      }
    },
    methods: {
      getStudentDetail () {
        let params = {
          student_id: this.$route.query.student_id
        }
        studentApi.queryDetail(params).then(res => {
          this.loading = false
          if (res.ok) {
            this.loading1 = false
            this.student = res.data
            this.openAddList(true)
          }
        })
      },
      selectStudentDone (data) {
        this.addFeeForm.class_id = ''
        this.student = data
        this.showPayment = false
      },
      openAddList (status) {
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
            type: 2
          }
          receptionApi.addQuitFeeList(params).then(res => {
            this.addFeeList = res.data
            if (this.$route.query.detail) {
              this.selectAddFee(this.$route.query.class_id)
            }
          })
        }
      },
      selectAddFee (val) {
        if (val) {
          this.addFeeList.map((v, i) => {
            if (v.class_id * 1 === val * 1) {
              this.enroll_id = v.id
              this.quitRule = v.goods_withdraw_ruler_type
              this.quitRuleCount = v.goods_withdraw_ruler_amount
              this.bookRefundType = v.option_withdraw_ruler_type
            }
          })
          let params = {
            student_id: this.student.id,
            id: this.enroll_id
          }
          receptionApi.getClassAmount(params).then((res) => {
            if (res.ok) {
              this.showPayment = true
              let money = (res.data.payable * 100 - res.data.payed * 100 > 0) ? ((res.data.payable * 100 - res.data.payed * 100) / 100) : 0
              this.pay = {
                amount: money,
                payList: [{
                  type: '4',
                  name: '现金',
                  amount: '',
                  surplusMoney: money
                }]
              }
              if (res.data.payable_others) {
                let otherMoney = (res.data.payable_others * 1 - res.data.payed_others * 1) > 0 ? (res.data.payable_others * 1 - res.data.payed_others * 1) : 0
                this.otherPay = {
                  amount: otherMoney,
                  payList: [{
                    type: '4',
                    name: '现金',
                    amount: '',
                    surplusMoney: otherMoney
                  }]
                }
              }
            }
          })
        }
      },
      paymentChange () {
        this.getPaymentInfo()
      },
      getPaymentInfo () {
        let amount1 = 0
        let amount2 = 0
        let amount3 = 0
        let amount = 0
        if (this.pay.amount === '待定') {
          this.pay.payConfig.amount = 0
        }
        this.pay.payList.map((o) => {
          amount += o.amount * 1
        })
        this.otherPay.payList.map((o) => {
          amount += o.amount * 1
        })
        amount1 = amount1 + this.pay.amount + this.otherPay.amount
        amount2 += amount
        amount3 = amount3 + this.pay.amount + this.otherPay.amount - amount
        this.allReceived = amount2
        this.allAmount = amount1
        this.allArrears = amount3
      },
      selectManageCampus (campusId) {
        this.addFeeForm.campus = campusId
      },
      cancel () {
        this.$router.back()
      },
      addFee () {
        if (this.canSubmit) {
          this.fullLoading = true
          this.canSubmit = false
          this.$refs.form.validate((valid) => {
            if (valid) {
              let num = 0
              this.pay.payList.map((o) => {
                if (o.amount === '' && this.pay.amount !== 0) {
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
                  if (o.amount === '' && this.otherPay.amount !== 0) {
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
              if (this.allReceived <= 0) {
                this.$message({
                  message: '补费金额不可为0元',
                  type: 'warning',
                  center: true
                })
                this.canSubmit = true
                this.fullLoading = false
                return
              }
              let params = {
                student_id: this.student.id,
                id: this.enroll_id,
                pay: this.pay.payList,
                pay_others: this.otherPay.payList,
                handle: {
                  campus: this.addFeeForm.campus
                }
              }
              receptionApi.addFee(params).then((res) => {
                this.fullLoading = false
                this.canSubmit = true
                if (res.ok) {
                  this.$router.back()
                }
              })
            } else {
              this.fullLoading = false
              this.canSubmit = true
              return false
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
  .addFee {
    text-align: left;
    .addFeeWrapper {
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
      .el-form {
        .el-form-item__label {
          margin-bottom: 10px;
        }
        .el-select, .el-input, input {
          width: 340px;
          height: 50px;
        }
      }
      .manageInfo {
        margin-top: 20px;
        &>p {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .el-form-item {
          width: 340px;
          .selectInputCampus {
            width: 100%;
          }
        }
      }
    }
    .el-form-item__error {
      margin: 0;
    }
    .manageWraper {
      margin-top: 30px;
      .el-button {
        width: 110px;
        height: 40px;
      }
    }
  }
</style>
