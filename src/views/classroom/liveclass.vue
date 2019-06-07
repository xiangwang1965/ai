<!-- 双师课程 -->
<template>
  <div class='liveclassPage'>
    <el-form :model="params" :rules="rules" ref="params" size="mini" label-width="100px" class="createForm--form" label-position="top">
      <div class="inputWrap">
        <p>基本信息</p>
        <div class="left">
          <el-form-item label="双师课程名称" prop="live_class_id" class="createForm--formItem">
            <el-select v-model="params.live_class_id" placeholder="请选择双师课程" filterable :disabled="status==='edit' || jump" @change="handleLive">
              <el-option v-for="item in optionLiveClass" :key="item.live_class_id" :label="item.live_class_name || item.class_name" :value="item.live_class_id">
                {{item.live_class_name || item.class_name}}
              </el-option>
            </el-select>
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
          <el-form-item label="教室" prop="live_room_id" class="createForm--formItem">
            <!-- 原没有disabled -->
            <el-select v-model="params.live_room_id" placeholder="教室" filterable @change="getRoomId">
              <el-option v-for="item in optionClassRoom" :key="item.room_id" :label="item.name" :value="item.room_id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="班级名称" prop="class_name" class="createForm--formItem">
            <el-input :maxlength="30" v-model.trim="params.class_name" placeholder="班级名称" class="createForm__input"></el-input>
          </el-form-item>
          <el-form-item label="校区" prop="campus_id" class="createForm--formItem">
            <el-select v-model="params.campus_id" placeholder="校区" filterable>
              <el-option v-for="item in optionCampus" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="chargeStandard" v-if="isCharge >= 0">
          <p>收费标准</p>
          <el-form-item label="收费模式" class="charge_method" prop="charge_method">
            <selectInputChargetype @change="selectChargeMethod" :disabled="status === 'edit'"></selectInputChargetype>
          </el-form-item>
          <el-form-item label="收费标准" class="charge_standard" prop="amount">
            <InputNumber v-model="params.amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'" :disabled="status === 'edit'"></InputNumber><span style="margin-left: -35px;color: #3E434C;">元/人</span>
            <el-radio-group v-model="params.withdraw_rulers_type" style="display: inline-block;width: auto;">
              <el-radio label="1">根据未上讲次退费</el-radio>
              <el-radio label="4">前
                <span v-if="!isChangeFirst">{{firstChargeNum}}</span>
                <InputNumber v-else v-model="firstChargeNum" :min="0" :max="lessonList.length" :width="'40px'" :height="'20px'" :disabled="status === 'edit'"></InputNumber>
                <!--<InputNumber v-model="params.amount" :min="1" :isFloat="true" :width="'20px'" :height="'20px'" :disabled="status === 'edit'"></InputNumber>-->
                讲退班，全额退费
              </el-radio><el-button type="text" @click="changeFirstChargeNum">{{isChangeFirst ? '保存' : '修改'}}</el-button>
              <el-radio label="5">后
                <span v-if="!isChangeSecond">{{secondChargeNum}}</span>
                <InputNumber v-else v-model="secondChargeNum" :min="0" :max="lessonList.length" :width="'40px'" :height="'20px'" :disabled="status === 'edit'"></InputNumber>
                讲退班，不退费用</el-radio><el-button type="text" style="margin-right: 0;" @click="changeSecondChargeNum">{{isChangeSecond ? '保存' : '修改'}}</el-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="书本费" class="charge_standard">
            <InputNumber v-model="params.option_charge[0].amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'" :disabled="status === 'edit'"></InputNumber><span style="margin-left: -35px;color: #3E434C;">元/人</span>
            <el-radio-group v-model="params.option_charge[0].refund_type" style="display: inline-block;width: auto;">
              <el-radio label="0">报名后不退</el-radio>
              <el-radio label="1">开课后不退</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="lessonListWrap">
      <p class="baseInfo_title">讲次信息</p>
      <el-table class="lessonList" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="lessonList" max-height="370" style="width: 100%" highlight-current-row>
        <el-table-column align="left" prop="index" label="讲次" width="170" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>第&nbsp;{{scope.$index+1}}&nbsp;讲</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="lesson_name" label="讲次名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="date" label="上课日期" width="200" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" round @click="doCancle" class="cac-button-two cancel-button cancel_button">取 消</el-button>
      <el-button type="primary" size="small" round v-loading="fullscreenLoading" @click="doCreate('params')" class="cac-button-one confirm_button">{{status=="edit"?"确 定":"创 建"}}</el-button>
    </div>
    <el-dialog title="请选择班型" :visible.sync="dialogVisible" width="450px">
      <ChooseClassType :params="params" :optionSubject="optionSubject" :courseList="courseList" @close="doClose"></ChooseClassType>
    </el-dialog>
  </div>
</template>

<script>
import ChooseClassType from '@/components/classroom/ChooseClassType'
import classroomApi from '@/services/classroom'
import authUtils from '@/services/auth/utils'
import selectInputChargetype from '@/components/selectInputChargetype'
import InputNumber from '@/components/inputNumber'
export default {
  data () {
    return {
      fullscreenLoading: false,
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
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      firstChargeNum: 1,
      secondChargeNum: 1,
      isChangeFirst: false,
      isChangeSecond: false
    }
  },
  props: {
    params: Object,
    rules: Object,
    status: String,
    optionSubject: Array,
    optionCampus: Array
  },
  components: {
    ChooseClassType,
    selectInputChargetype,
    InputNumber
  },
  created () {
    if (this.status === 'edit') {
      this.params.live_class_id *= 1
      this.lessonList = this.params.lessons
    } else {
      // 路由include：code说明从双师班级跳转来的，给live_class_id赋值id
      this.$route.query.code && this.$set(this.params, 'live_class_id', Number(this.$route.query.id))
      if (this.$route.query.code) { this.jump = true }
    }
    this.getAssistant()
    this.getLiveClass()
    this.getLiveRoom()
  },
  watch: {
    params: {
      handler () {
        if (this.status === 'edit') {
          this.lessonList = this.params.lessons
        } else {
          this.$route.query.code && this.$set(this.params, 'live_class_id', Number(this.$route.query.id))
          if (this.$route.query.code) { this.jump = true }
        }
      },
      deep: true
    }
  },
  methods: {
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
    getLiveClass () {
      let params = {}
      // 未结课状态的双师课
      this.status === 'create' && (params.status = '1,2')
      classroomApi.queryMyLive(params).then(res => {
        if (res.ok) {
          res.data.live_class_id *= 1
          this.optionLiveClass = res.data
          this.code && this.fetchLiveClass()
        }
      })
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
          this.fullscreenLoading = true
          if (this.status === 'create') {
            if (this.params.withdraw_rulers_type * 1 === 4) {
              params.withdraw_rulers_amount = this.firstChargeNum
            }
            if (this.params.withdraw_rulers_type * 1 === 5) {
              params.withdraw_rulers_amount = this.secondChargeNum
            }
            params.course_type = 1
            classroomApi.createLiveClass(params).then(res => {
              if (res.ok) {
                this.$router.back()
              }
              this.fullscreenLoading = false
            })
          } else {
            let params = this.params
            params.class_id = this.$route.query.id
            classroomApi.modifyLiveClass(params).then(res => {
              if (res.ok) {
                this.$router.back()
              }
              this.fullscreenLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLive (id) {
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
    selectChargeMethod (val) {
      this.params.charge_method = val
    },
    changeFirstChargeNum () {
      this.isChangeFirst = !this.isChangeFirst
      this.isChangeSecond = false
    },
    changeSecondChargeNum () {
      this.isChangeSecond = !this.isChangeSecond
      this.isChangeFirst = false
    }
  }
}
</script>
<style lang="less">
.liveclassPage {
  text-align: left;
  .createForm--form {
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  /*.createForm--formItem {
    &:nth-child(1) {
      width: 100%;
    }
  }*/
  .el-button--success {
    &.is-plain {
      margin-top: 15px;
    }
  }
  .el-dialog__body {
    .el-select {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .bottom {
    padding-top: 30px;
  }
  .inputWrap {
    width: 100%;
    background-color: #fff;
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    & > div {
      flex: 1;
      padding-right: 30px;
    }
  }
  .createForm--formItem--name {
    text-align: left;
    border: 1px solid #e6ecef !important;
  }
  .el-form {
    .left {
      margin-right: 80px;
    }
    .left, .right {
      display: inline-block;
      vertical-align: top;
      width: 340px;
      .el-form-item {
        width: 100%;
        .el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          color: #7A808D;
        }
        .el-select {
          width: 340px;
        }
        input {
          height: 50px;
        }
      }
    }
    .chargeStandard {
      display: block;
      width: 100%;
      &>p {
        font-size: 20px;
        font-weight: bold;
        height: 28px;
        line-height: 28px;
      }
      .el-form-item {
        display: block;
        width: 1150px;
        .el-form-item__content {
          .el-select, .el-input, input {
            width: 340px;
            height: 50px;
          }
        }
        .inputNumber {
          input {
            padding-right: 40px;
          }
        }
      }
      .charge_standard {
        input {
          text-align: right;
        }
        .el-radio-group {
          margin-left: 20px;
          .el-radio {
            margin-right: 35px;
          }
          .el-button {
            margin-left: -20px;
            margin-right: 40px;
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
  }
  .placeholder__color {
    color: #c4c8d0 !important;
  }
  .selectWrap {
    width: 100%;
    background-color: #fff;
    margin-top: 20px;
    padding: 38px;
  }
  /* 讲次模块 */
  .lessonListWrap {
    margin-top: 20px;
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }
  .baseInfo_title {
    height: 61px;
    text-align: left;
    padding-top: 11px;
    font-size: 18px;
    color: #333;
    line-height: 50px;
  }
}

</style>
