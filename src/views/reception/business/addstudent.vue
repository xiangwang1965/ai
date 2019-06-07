<template>
  <div class="addStudentPage" v-loading.fullscreen.lock="fullLoading">
    <div class="cac-bread-bar changeClassHeader">
      <el-breadcrumb separator="/">
        <a @click="cancel">班级管理</a>
        <el-breadcrumb-item class="cac-bread">添加学生</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="addStudentContent">
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
      </div>
      <p style="margin-top: 20px;">班级</p>
      <el-table :data="classData">
        <el-table-column prop="class_name" label="班级名称" show-overflow-tooltip>

        </el-table-column>
        <el-table-column prop="" label="课程名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.course_name || scope.row.live_class_name}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="schoolType === 'wisroom'" prop="teacher_name" label="主讲老师" show-overflow-tooltip>

        </el-table-column>
        <el-table-column v-if="schoolType === 'face'" prop="teacher_name" label="面授主讲" show-overflow-tooltip>

        </el-table-column>
        <el-table-column v-if="schoolType === 'doubleTeacher'" prop="live_teacher_name" label="双师主讲" show-overflow-tooltip>

        </el-table-column>
        <el-table-column align="center" label="授课方式" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="schoolType !== 'wisroom' && scope.row.type === 1">双师</span>
            <span v-if="schoolType !== 'wisroom' && scope.row.type === 2">面授</span>
            <span v-if="schoolType === 'wisroom'">双师</span>
          </template>
        </el-table-column>
        <el-table-column prop="course_open_time" label="开课时间" width="220" align="center" show-overflow-tooltip>

        </el-table-column>
        <el-table-column align="center" label="收费标准" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.charge_info.amount}}元/人/期</span>
          </template>
        </el-table-column>otherPayConfig
      </el-table>
      <paymentType v-if="showPayment" :showWarning="showWarning" :config="classData[0].payConfig" :startedData="startedData" @change="paymentChange"></paymentType>
      <div v-if="showInPay && otherPay && otherPay.payList.length > 0" style="margin-top: 0px;width: 750px;">
        <p style="height: 50px;line-height: 50px;">书本费</p>
        <paymentType v-if="showPayment" :config="classData[0].otherPayConfig" @change="paymentChange"></paymentType>
      </div>
      <paymentInfo v-if="showPayment" :config="{receivableAmount:allAmount,receivedAmount:allReceived,arrearsAmount:allArrears}" :startedData="startedData"></paymentInfo>
      <!--<div class="classDetail" v-loading="loading2">
              <div>
                <span>校区</span>
                <span>{{classDetail.campus_name}}</span>
              </div>
              <div>
                <span>课程名称</span>
                <span :title="classDetail.course_name">{{classDetail.course_name}}</span>
              </div>
              <div>
                <span>老师</span>
                <span>{{classDetail.teacher_name}}</span>
              </div>
              &lt;!&ndash; <div>
                <span>适用校区</span>
                <span>{{classDetail.apply_campus_name}}</span>
              </div> &ndash;&gt;
              <br>
              <div>
                <span>班级名称</span>
                <span>{{classDetail.class_name}}</span>
              </div>
              <div>
                <span>预招人数</span>
                <span>{{classDetail.advance_student_num}}</span>
              </div>
              <div>
                <span>教室</span>
                <span>{{classDetail.room_name}}</span>
              </div>
            </div>-->
      <div class="manageInfo">
        <p>经办信息</p>
        <div>
          <span>经办校区</span>
          <selectInputCampus @change="selectManageCampus"></selectInputCampus>
          <p :class="['hiddenWarning', {'campusWarning': campusWarning}]" style="color: #F56C6B;font-size: 12px;">请选择经办校区</p>
        </div>
      </div>
      <div>
      <div class="manageWraper">
        <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="entryClass">创 建</el-button>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
  import studentApi from '@/services/student'
  import classroomApi from '@/services/classroom'
  import receptionApi from '@/services/reception'
  import authUtils from '@/services/auth/utils'
  import paymentType from '@/components/paymentType'
  import paymentInfo from '@/components/paymentInfo'
  import selectInputCampus from '@/components/selectInputCampus'
  export default {
    props: ['source'],
    data () {
      return {
        loading1: false,
        loading2: false,
        fullLoading: false,
        student: {
          info: {},
          entryList: []
        },
        student_id: this.$route.query.id,
        classData: [],
        showPayment: false,
        startedData: {
          allFee: -1,
          startedLesssons: 0
        },
        allAmount: 0,
        allReceived: 0,
        allArrears: 0,
        showWarning: false,
        campusWarning: false,
        canSubmit: true
      }
    },
    components: {
      paymentType,
      paymentInfo,
      selectInputCampus
    },
    created () {
      this.init()
    },
    computed: {
      schoolType () {
        if (authUtils.getUser().third_part === 'wisroom') {
          return 'wisroom'
        } else {
          console.log(this.classData)
          if (this.classData.length > 0 && this.classData[0].type === 2) {
            return 'face'
          } else {
            return 'doubleTeacher'
          }
        }
      }
    },
    methods: {
      init () {
        this.getOptionsList()
        this.getStudentInfo()
        this.getClassInfo()
      },
      getOptionsList () {
        receptionApi.getOptionsList().then(res => {
          this.courseTypeList = res.data.course_types
        })
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
      selectManageCampus (campusId) {
        this.student.info.campus = campusId
      },
      getClassInfo () {
        this.loading2 = true
        this.studentLoading = true
        if (this.source === 'teaching' || this.source === 'wisroom') {
          classroomApi.faceClassDetail({ class_id: this.$route.query.classId }).then(res => {
            this.loading2 = false
            if (res.status_code === 200) {
              res.data.apply_campus_name = res.data.apply_campus_name.split(' ').join('、')
              if (res.data.apply_campus_name[res.data.apply_campus_name.length - 1] === '、') {
                res.data.apply_campus_name = res.data.apply_campus_name.substring(0, res.data.apply_campus_name.length - 1)
              }
              this.classData = [res.data]
              this.getClassFee()
            }
          })
        }
        if (this.source === 'studentClassroom' || this.source === 'platform') {
          classroomApi.queryClassDetail({class_id: this.$route.query.classId}).then(res => {
            if (res.ok) {
              this.classData = [res.data]
              this.classData[0].type = 1
              this.getClassFee()
            }
          })
        }
      },
      getClassFee () {
        let params = {
          id: this.$route.query.classId,
          type: 2
        }
        receptionApi.getClassAmount(params).then((res) => {
          if (res.ok) {
            let amount = res.data.left_fee * 1
            this.$set(this.startedData, 'allFee', res.data.fee * 1)
            this.$forceUpdate()
            this.$set(this.startedData, 'startedLesssons', res.data.lesson_finish_counts)
            this.$forceUpdate()
            this.startedData.allFee = res.data.fee * 1
            this.startedData.startedLesssons = res.data.lesson_finish_counts * 1
            this.showWarning = false
            this.classData[0].payConfig = {
              amount: amount,
              payList: [{
                type: '4',
                name: '现金',
                amount: '',
                surplusMoney: amount
              }]
            }
            if (res.data.payable_others) {
              let otherMoney = (res.data.payable_others * 100 - res.data.payed_others * 100) / 100
              this.classData[0].otherPayConfig = {
                amount: otherMoney,
                payList: [{
                  type: '4',
                  name: '现金',
                  amount: '',
                  surplusMoney: otherMoney
                }]
              }
              this.showPayment = true
            }
          }
        })
      },
      paymentChange () {
        this.getPaymentInfo()
      },
      getPaymentInfo () {
        let amount1 = 0
        let amount2 = 0
        let amount3 = 0
        let amount = 0
        if (this.classData[0].payConfig.amount === '待定') {
          this.classData[0].payConfig.amount = 0
        }
        this.classData[0].payConfig.payList.map((o) => {
          amount += o.amount * 1
        })
        this.classData[0].otherPayConfig.payList.map((o) => {
          amount += o.amount * 1
        })
        amount1 = amount1 + this.classData[0].payConfig.amount + this.classData[0].otherPayConfig.amount
        amount2 += amount
        amount3 = amount3 + this.classData[0].payConfig.amount + this.classData[0].otherPayConfig.amount - amount
        this.allReceived = amount2
        this.allAmount = amount1
        this.allArrears = amount3
      },
      cancel () {
        this.$router.back()
      },
      entryClass () {
        if (this.canSubmit) {
          this.canSubmit = false
          this.fullLoading = true
          if (!this.student.info.campus) {
            this.campusWarning = true
            this.canSubmit = true
            this.fullLoading = false
            return
          } else {
            this.campusWarning = false
          }
          let params = {
            student_id: this.student_id,
            class_ids: this.$route.query.classId,
            vd_student_id: this.$route.query.vd_id,
            pay: this.classData[0].payConfig.payList
          }
          params.handle = {
            campus: this.student.info.campus
          }
          let num = 0
          this.classData[0].payConfig.payList.map((o) => {
            if (o.amount === '' && this.classData[0].payConfig.amount !== 0 && this.startedData.allFee > 0) {
              num += 1
            }
          })
          if (num >= 3) {
            this.$set(this, 'showWarning', true)
            this.$forceUpdate()
          } else {
            this.$set(this, 'showWarning', false)
            this.$forceUpdate()
          }
          if (num >= 3) {
            this.fullLoading = false
            this.canSubmit = true
            return
          }
          receptionApi.insertStudent(params).then(res => {
            this.fullLoading = false
            this.canSubmit = true
            if (res.status_code === 200) {
              this.$router.back()
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
.addStudentPage {
  text-align: left;
  .addStudentContent {
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
      .el-loading-mask {
        width: 100%;
      }
    }
    .classDetail {
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
    .payment_type {
      margin-bottom: 30px;
      padding: 0 30px 10px 30px;
      background: rgba(249, 251, 252, 1);
    }
    .manageInfo {
      &>p {
        margin: 15px 0 20px;
        font-size: 20px;
        font-weight: bold;
      }
      &>div {
        &>span {
          height: 50px;
          line-height: 50px;
          &::before {
            content: '*';
            color: #F56C6B;
            margin-right: 5px;
          }
        }
      }
      .selectInputCampus {
        display: block;
        height: 50px;
        width: 340px;
        .el-select, .el-input, input {
          width: 100%;
          height: 100%;
        }
      }
      .hiddenWarning {
        visibility: hidden;
        height: 20px;
        line-height: 20px;
      }
      .campusWarning {
        visibility: visible;
      }
    }
    .manageWraper {
      margin-top: 20px;
    }
  }
}
</style>
