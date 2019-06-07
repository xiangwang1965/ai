<!-- 双师课程 -->
<template>
  <div class='liveclassPage'>
    <div class="inputWrap">
      <p>基本信息</p>
      <el-form
        ref="params"
        class="createForm--form"
        :model="params"
        :rules="rules"
        inline
        size="mini"
        label-width="100px"
        label-position="top">
        <el-form-item label="双师课程名称" prop="live_class_id" class="createForm--formItem">
          <!-- <el-input placeholder="课程名称" :disabled="status == 'edit'" @focus="showClassList = true" v-model.trim="params.live_class_name"></el-input> -->
          <el-select v-model="params.live_class_id" clearable placeholder="请选择双师课程" filterable :disabled="status==='edit' || jump" @change="handleLive">
            <el-option v-for="item in optionLiveClass" :key="item.id || item.live_class_id" :label="item.live_class_name || item.class_name" :value="item.id || item.live_class_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" prop="class_name" class="createForm--formItem">
          <el-input v-model.trim="params.class_name" :maxlength="30" placeholder="班级名称" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="辅导老师" prop="teacher_id" class="createForm--formItem">
          <!-- 原disabeld的条件 params.status===3 -->
          <el-select v-model="params.teacher_id" placeholder="辅导老师" filterable :disabled="params.status===3" @change="handleTeacher">
            <el-option v-for="item in optionTeacher" :key="item.id" :label="item.name" :value="item.id">
              <div>
                <span>{{item.name}}</span>
                <span>{{item.telephone}}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校区" prop="campus_id" class="createForm--formItem">
          <el-select v-model="params.campus_id" placeholder="校区" filterable>
            <el-option v-for="item in optionCampus" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室" prop="live_room_id" class="createForm--formItem">
          <!-- 原没有disabled -->
          <el-select v-model="params.live_room_id" placeholder="教室" filterable @change="getRoomId">
            <el-option v-for="item in optionClassRoom" :key="item.room_id" :label="item.name" :value="item.room_id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="chargeStandard" v-if="isCharge >= 0 && source !== 'platform' && params.canSeeFee">
          <p>收费标准
            <el-tooltip class="item" effect="dark" content="班级内有学生、已结课、已关班、已退班不可修改收费标准" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </p>
          <el-form-item label="收费模式" class="charge_method" prop="charge_method">
            <selectInputChargetype @change="selectChargeMethod" :disabled="!canEditCharge"></selectInputChargetype>
          </el-form-item>
          <el-form-item label="收费标准" class="charge_standard" prop="amount">
            <InputNumber v-model="params.amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'" :disabled="!canEditCharge"></InputNumber><span style="margin-left: -35px;color: #3E434C;font-size: 13px;">元/人</span>
            <el-radio-group v-model="params.withdraw_rulers_type" :disabled="!canEditCharge" style="display: inline-block;width: auto;" @change="chargeTypeChange">
              <el-radio label="1">根据未上讲次退费</el-radio>
              <el-radio label="4">前
                <span v-if="!isChangeFirst">{{firstChargeNum}}</span>
                <InputNumber v-else v-model="firstChargeNum" :min="0" :max="lessonList.length" :width="'40px'" :height="'20px'" :disabled="!canEditCharge"></InputNumber>
                讲退班，全额退费
              </el-radio><el-button type="text" :disabled="!canEditCharge" @click="changeFirstChargeNum">{{isChangeFirst ? '保存' : '修改'}}</el-button>
              <el-radio label="5">后
                <span v-if="!isChangeSecond">{{secondChargeNum}}</span>
                <InputNumber v-else v-model="secondChargeNum" :min="0" :max="lessonList.length" :width="'40px'" :height="'20px'" :disabled="!canEditCharge""></InputNumber>
                讲退班，不退费用</el-radio><el-button type="text" style="margin-right: 0;" :disabled="!canEditCharge" @click="changeSecondChargeNum">{{isChangeSecond ? '保存' : '修改'}}</el-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="书本费" class="charge_standard">
            <InputNumber v-model="params.option_charge[0].amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'" :disabled="!canEditCharge"></InputNumber><span style="margin-left: -35px;color: #3E434C;">元/人</span>
            <el-radio-group v-model="params.option_charge[0].refund_type" :disabled="!canEditCharge" style="display: inline-block;width: auto;">
              <el-radio label="0">报名后不退</el-radio>
              <el-radio label="1">开课后不退</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="lessonListWrap">
      <p class="baseInfo_title">讲次信息</p>
      <el-table
        class="lessonList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="lessonList"
        max-height="370"
        style="width: 100%"
        highlight-current-row>
        <el-table-column align="left" prop="index" width="150" label="讲次" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>第{{scope.$index+1}}讲</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="lesson_name" label="讲次名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="date" label="上课日期" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" @click="doCancle" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      <el-button type="primary" size="small" @click="doCreate('params')" class="cac-button-one confirm_button" round>{{status=="edit"?"确 定":"创 建"}}</el-button>
    </div>
    <el-dialog title="请选择班型" :visible.sync="dialogVisible" width="450px">
      <ChooseClassType :params="params" :optionSubject="optionSubject" :courseList="courseList" @close="doClose"></ChooseClassType>
    </el-dialog>
  </div>
</template>

<script>
import ChooseClassType from '@/components/classroom/ChooseClassType'
import classroomApi from '@/services/classroom'
import teacherClassApi from '@/services/platform/teacher_class'
import selectInputChargetype from '@/components/selectInputChargetype'
import InputNumber from '@/components/inputNumber'

export default {
  data () {
    return {
      showClassList: false,
      base_class_name: '请选择班型',
      dialogVisible: false,
      loading: false,
      jump: false,
      code: this.$route.query.code,
      detail_code: this.$route.query.detail_code,
      id: this.$route.query.id,
      courseList: [],
      optionLevel: [],
      optionGrade: [],
      optionTerm: [],
      optionTeacher: [],
      optionBaseClass: [],
      optionClassRoom: [],
      optionLiveClass: [],
      lessonList: [],
      queryStatus: this.$route.query.create,
      firstChargeNum: 1,
      secondChargeNum: 1,
      isChangeFirst: false,
      isChangeSecond: false,
      isEdited: false
    }
  },
  props: ['params', 'rules', 'status', 'optionSubject', 'optionCampus', 'source', 'isCharge'],
  components: {
    ChooseClassType,
    selectInputChargetype,
    InputNumber
  },
  created () {
    if (this.status === 'edit') {
      this.lessonList = this.params.lessons
      this.params.live_class_id *= 1
      if (this.params.withdraw_rulers_type) {
        if (this.params.withdraw_rulers_type * 1 === 4) {
          this.firstChargeNum = this.params.withdraw_rulers_amount
        }
        if (this.params.withdraw_rulers_type === 5) {
          this.secondChargeNum = this.params.withdraw_rulers_amount
        }
      }
    } else {
      // 路由include：code说明从双师班级跳转来的，给live_class_id赋值id
      this.$route.query.code && this.$set(this.params, 'live_class_id', Number(this.$route.query.id))
      if (this.$route.query.code) { this.jump = true }
    }
    this.getLiveClass()
    this.getAssistant()
    this.getLiveRoom()
  },
  watch: {
    params: {
      handler () {
        if (this.status === 'edit') {
          this.lessonList = this.params.lessons
          if (this.params.withdraw_rulers_type && !this.isEdited) {
            if (this.params.withdraw_rulers_type * 1 === 4 && this.secondChargeNum !== this.params.withdraw_rulers_amount) {
              this.firstChargeNum = this.params.withdraw_rulers_amount
            }
            if (this.params.withdraw_rulers_type * 1 === 5 && this.firstChargeNum !== this.params.withdraw_rulers_amount) {
              this.secondChargeNum = this.params.withdraw_rulers_amount
            }
          }
        } else {
          this.$route.query.code && this.$set(this.params, 'live_class_id', Number(this.$route.query.id))
          if (this.$route.query.code) { this.jump = true }
        }
      },
      deep: true
    }
  },
  computed: {
    canEditCharge () {
      if (this.status === 'edit') {
        if (this.params.student_count > 0) {
          return false
        }
        if (this.params.class_status === 1) {
          return false
        }
        if (this.params.status === 3 || this.params.status === 4) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    // 选择双师课程
    choiceLiveclass (item) {
      this.params.live_class_id = item.id
      this.params.live_class_name = item.class_name
      this.handleLive(item.id)
    },
    // 如果授课教师过多，采用输入框的话采用这个进行异步查询
    querySearchAsync (queryString, cb) {
      let params = {
        'name': queryString
      }
      classroomApi.queryTeacher(params).then(res => {
        if (res.ok) {
          res.data.forEach((item, i) => {
            item.value = item.name
            item.address = item.teach_subject
          })
          cb(res.data)
        }
      })
    },
    selectChargeMethod (val) {
      this.params.charge_method = val
    },
    getLiveClass () {
      let params = {
        class_name: '',
        status: '1,2'
      }
      if (this.source === 'platform') {
        teacherClassApi.queryMyLive(params).then(res => {
          if (res.ok) {
            this.optionLiveClass = res.data
            this.code && this.fetchLiveClass()
          }
        })
      } else {
        teacherClassApi.getDoubleCourse(params).then(res => {
          if (res.status_code === 200) {
            this.optionLiveClass = res.data
            this.code && this.fetchLiveClass()
            if (this.queryStatus === 'edit') {
              setTimeout(() => {
                this.optionLiveClass = [{
                  live_class_id: this.params.live_class_id * 1,
                  live_class_name: this.params.live_class_name
                }]
              }, 1000)
            }
          }
        })
      }
    },
    getAssistant () {
      classroomApi.queryAssistant().then(res => {
        if (res.ok) {
          this.optionTeacher = res.data
        }
      })
    },
    getLiveRoom () {
      let params = {
        'type': 2,
        'is_active': 1
      }
      classroomApi.queryLiveRoom(params).then(res => {
        if (res.ok) {
          this.optionClassRoom = res.data.list
        }
      })
    },
    loadAll (queryString) {
      if (queryString) {
        let params = {
          'name': queryString
        }
        classroomApi.queryTeacher(params).then(res => {
          if (res.ok) {
            return res.data
          }
        })
      } else {
        return []
      }
    },
    // 获取老师
    getTeacher (item) {
      this.params.teacher_id = item.id
    },
    // 关闭确认班型
    doClose (data, dataList) {
      this.dialogVisible = false
      if (data) {
        for (var key in data) {
          this.params[key] = data[key]
        }
        this.courseList = dataList
        this.base_class_name = this.params.base_class_name === '' ? this.base_class_name : this.params.base_class_name
      }
    },
    // 取消创建
    doCancle () {
      this.$router.back()
    },
    // 创建
    doCreate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.params
          params.detail_code = this.detail_code
          if (this.params.withdraw_rulers_type * 1 === 4) {
            params.withdraw_rulers_amount = this.firstChargeNum
          }
          if (this.params.withdraw_rulers_type * 1 === 5) {
            params.withdraw_rulers_amount = this.secondChargeNum
          }
          if (this.status === 'create') {
            params.course_type = 1
            classroomApi.createLiveClass(params).then(res => {
              if (res.ok) {
                this.$router.back()
              }
            })
          } else {
            params.charge_info.amount = params.amount
            params.class_id = this.$route.query.id
            classroomApi.modifyLiveClass(params).then(res => {
              if (res.ok) {
                this.$router.back()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLive (id) {
      let params = {
        class_id: id
      }
      teacherClassApi.classDetail(params).then(res => {
        if (res.ok) {
          this.lessonList = res.data.lessons
          this.lessonList.forEach(item => {
            item.date = item.date + ' ' + item.time_span
          })
        }
      })
      this.optionLiveClass.forEach(item => {
        if (id === item.live_class_id) {
          let params = {
            'code': item.code
          }
          classroomApi.queryLiveDetail(params).then(res => {
            if (res.ok) {
              this.lessonList = res.data.lessons
              this.lessonList.forEach(item => {
                item.date = item.date + ' ' + item.time_span
              })
              this.detail_code = res.data.detail_code
            }
          })
        }
      })
    },
    // 如果从双师页面跳转进来获取双师信息
    fetchLiveClass () {
      let params = {
        'code': this.code
      }
      classroomApi.queryLiveDetail(params).then(res => {
        if (res.ok) {
          this.lessonList = res.data.lessons
          this.lessonList.forEach(item => {
            item.date = item.date + '  ' + item.time_span
          })
        }
      })
    },
    // 选择教室获取微度id
    getRoomId (id) {
      this.optionClassRoom.forEach(item => {
        if (item.room_id === id) {
          this.params.vd_room_id = item.vd_id
        }
      })
    },
    // 选择助教老师获取纬度id
    handleTeacher (id) {
      this.optionTeacher.forEach(item => {
        if (item.id === id) {
          this.params.vd_teacher_id = item.vd_id
        }
      })
    },
    changeFirstChargeNum () {
      this.isChangeFirst = !this.isChangeFirst
      this.isChangeSecond = false
      this.isEdited = true
    },
    changeSecondChargeNum () {
      this.isChangeSecond = !this.isChangeSecond
      this.isChangeFirst = false
      this.isEdited = true
    },
    chargeTypeChange () {
      this.isEdited = true
    }
  }
}
</script>
<style lang="less">
.liveclassPage {
  text-align: left;
  .inputWrap {
    width: 1050px;
    margin-bottom: 30px;
    &>p {
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
    .el-form-item {
      width: 340px;
      margin-right: 80px;
      .el-select,.el-input {
        width: 340px;
        height: 50px;
        input {
          height: 100%;
        }
      }
      .inputNumber {
        input {
          padding-right: 40px;
        }
      }
    }
    .chargeStandard {
      &>p {
        height: 28px;
        line-height: 28px;
        font-weight: bold;
        font-size: 20px;
        margin: 10px 0 20px;
        color: #3E434C;
      }
      .el-form-item {
        display: block;
        width: 1050px;
        .inputNumber {
          input {
            text-align: right;
          }
        }
      }
      .el-radio-group {
        margin-left: 5px;
        .el-button {
          margin-left: -20px;
          margin-right: 35px;
          font-size: 13px;
        }
        .inputNumber {
          line-height: 1;
          input {
            width: 50px;
            height: 20px;
            padding: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .lessonListWrap {
    &>p {
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
    .lessonList {
      margin-bottom: 20px;
    }
  }
  // .createForm {
  //   text-align: left;
  // }
  // .createForm--form {
  //   text-align: left;
  //   display: flex;
  //   flex-wrap: wrap;
  //   align-content: space-between;
  // }
  // .createForm--formItem:nth-child(1) {
  //   width: 100%;
  // }
  // .el-button--success.is-plain {
  //   margin-top: 15px;
  // }
  // .el-dialog__body .el-select {
  //   margin-bottom: 10px;
  // }
  // .el-dialog__body .el-select:last-child {
  //   margin-bottom: 0;
  // }
  // .bottom {
  //   /* height: 90px;
  //   line-height: 90px; */
  //   padding-top: 30px;
  //   text-align: center;
  //   background-color: #f4f8fb;
  // }
  // .inputWrap {
  //   width: 900px;
  //   display: flex;
  //   background-color: #fff;
  //   margin-top: 20px;
  //   padding: 38px;
  // }
  // .inputWrap > div {
  //   flex: 1;
  //   padding-right: 30px;
  // }
  // .createForm--formItem--name {
  //   text-align: left;
  //   border: 1px solid #e6ecef !important;
  // }
  // .el-form-item__content > div,
  // .el-form-item__content > button {
  //   width: 100%;
  // }
  // .placeholder__color {
  //   color: #c4c8d0 !important;
  // }
  // .selectWrap {
  //   width: 100%;
  //   background-color: #fff;
  //   margin-top: 20px;
  //   padding: 38px;
  // }

  // /* 讲次模块 */
  // .lessonListWrap {
  //   margin-top: 20px;
  // }
  // .baseInfo_title {
  //   height: 61px;
  //   text-align: left;
  //   padding-top: 11px;
  //   font-size: 18px;
  //   color: #333;
  //   line-height: 50px;
  // }
  //   /*双师课程dialog*/
  //   .class_list_dialog{
  //     max-height: 350px;
  //     overflow-y: auto;
  //     display: flex;
  //     flex-wrap: wrap;
  //     box-shadow: 0 -10px 13px -12px rgba(0,0,0,0.1) inset;
  //   }
  // .class_list_dialog>div{
  //   border-radius: 6px;
  //   text-align: left;
  //   border: 1px solid #e7ecef;
  //   width: 48%;
  //   margin: 1%;
  //   padding: 20px;
  // }
  // .class_list_dialog .class_orange{
  //   font-size: 12px;
  //   padding: 2px 8px;
  //   border-radius: 10px;
  //   background-color: rgb(238,147,58);
  //   color: #ffffff;
  // }
  // .class_list_dialog .class_blue{
  //   font-size: 12px;
  //   padding: 2px 8px;
  //   border-radius: 10px;
  //   background-color: rgb(53,139,247);
  //   color: #ffffff;
  // }
  // .class_list_dialog .class_name{
  //   color: #282828;
  //   line-height: 20px;
  //   margin-top: 15px;
  //   font-size: 16px;
  //   font-weight: 500;
  // }
  // .class_list_dialog .teacher{
  //   font-size: 12px;
  //   margin-top: 15px;
  // }
  // .class_list_dialog .teacher>:last-child{
  //   color: #282828;
  // }
  // .class_list_dialog .time{
  //   font-size: 12px;
  //   line-height: 20px;
  //   margin-top: 5px;
  // }
  // .active_item{
  //   background-color: rgba(231,236,239,1);
  // }
}
</style>
