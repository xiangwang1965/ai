<template>
  <div class="classroomEditView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link v-if="source === 'live'" :to="{ path: '/live' }">班级管理</router-link>
        <router-link v-if="source === 'teaching'" :to="{ path: '/class' }">班级管理</router-link>
        <el-breadcrumb-item>{{status=="edit"?"修改班级":"创建班级"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<div class="radiogroup cac-shadow" v-show="is_teach&&is_live">-->
      <!--<h6 class="radiogroup__title">班级类别</h6>-->
      <!--<el-radio-group v-model="params.type" @change="getType">-->
        <!--<el-radio class="radiogroup__content" label="1" v-show="is_teach && $route.query.create==='create'">面授</el-radio>-->
        <!--<el-radio class="radiogroup__content" label="2" v-show="is_live && $route.query.create==='create'">双师</el-radio>-->
      <!--</el-radio-group>-->
    <!--</div>-->
    <TofaceClass v-if="params.type==='1'" :params="params" :rules="rules" :optionSubject="optionSubject" :optionCampus="optionCampus" :status="status"></TofaceClass>
    <LiveClass v-else :params="params" :rules="rules" :optionSubject="optionSubject" :status="status" :optionCampus="optionCampus"></LiveClass>
  </div>
</template>

<script>
import TofaceClass from './tofaceclass'
import LiveClass from './liveclass'
import classroomApi from '@/services/classroom'
import authUtils from '@/services/auth/utils'
import { formatDateTime } from '@/utils'
export default {
  props: ['source'],
  data () {
    return {
      status: this.$route.query.create,
      class_id: this.$route.query.id,
      optionSubject: [],
      optionCampus: [],
      is_teach: Number(this.$route.query.is_teach),
      is_live: Number(this.$route.query.is_live),
      params: {
        type: '2',
        roles: '1',
        class_name: '',
        level: '',
        level_name: '',
        grade_id: '',
        grade_id_name: '',
        subject_id: '',
        subject_id_name: '',
        term_id: '',
        term_name: '',
        teacher_id: '',
        campus_id: '',
        start_date: '',
        lesson_date: -1,
        live_class_id: '',
        live_room_id: '',
        startTime: '',
        endTime: '',
        base_class_id: '',
        base_class_name: '',
        classRoom: '',
        classRoom_id: '',
        lessons: [],
        class_type: 2,
        charge_method: 1,
        amount: '',
        withdraw_rulers_type: '1',
        withdraw_rulers_amount: '1',
        option_charge: [{
          amount: '',
          refund_type: '0',
          charge_type: '1'
        }]
      },
      rules: {
        grade_id: [
          { required: true, message: '请输入班级年级', trigger: 'change' }
        ],
        subject_id: [
          { required: true, message: '请输入班级学科', trigger: 'change' }
        ],
        term_id: [
          { required: true, message: '请输入学期', trigger: 'change' }
        ],
        teacher_id: [
          { required: true, message: '请输入授课教师', trigger: 'change' }
        ],
        class_name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        campus_id: [
          { required: true, message: '请输入校区', trigger: 'change' }
        ],
        start_date: [
          { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        lesson_date: [
          { required: true, message: '请选择课程时段', trigger: 'change' }
        ],
        base_class_id: [
          { required: true, message: '请选择班级类型', trigger: 'change' }
        ],
        classRoom_id: [
          { required: true, message: '请输入教室', trigger: 'change' }
        ],
        live_class_id: [
          { required: true, message: '请选择双师课程名称', trigger: 'change' }
        ],
        live_room_id: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ],
        charge_method: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请选择收费模式', trigger: 'change' }
        ],
        amount: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请输入收费标准', trigger: 'blur' }
        ]
      },
      // 在创建时用于存放初始params指，当切换面授和双师的时候
      temp: {},
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge')
    }
  },
  components: {
    TofaceClass,
    LiveClass
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/live' || to.path === '/class') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  created () {
    this.temp = Object.assign({}, this.params)
    this.getSubjectOption()
    if (this.status === 'edit') {
      this.getClassDetail(this.class_id)
    }
  },
  mounted () {
    // 如果是编辑页面，class_type带进来
    if (this.status === 'edit') {
      this.params.type = String(this.$route.query.type)
    } else {
      // 如果没有双师  创建
      // this.params.type = this.is_teach === 1 ? '1' : '2'
      this.params.type = '2'
    }
  },
  methods: {
    // 修改信息时获取班级详情
    getClassDetail (id) {
      let params = {
        'class_id': id,
        'class_type': this.$route.query.type
      }
      classroomApi.queryClassDetail(params).then(res => {
        if (res.ok) {
          // 获取班型名称
          this.base_class_name = res.data.base_class_name
          this.base_class_id = res.data.base_class_id
          this.params.base_class_id = this.base_class_id
          res.data.type = this.params.type
          this.params = res.data
          if (this.params.class_type === 1) {
            this.$set(this.params, 'start_date', formatDateTime(this.params.start_time))
            typeof (this.params.start_time) === 'string' && this.$set(this.params, 'startTime', this.params.start_time.split(' ')[1].substring(0, 5))
            typeof (this.params.end_time) === 'string' && this.$set(this.params, 'endTime', this.params.end_time.split(' ')[1].substring(0, 5))
          } else {
            this.params.lessons.forEach(item => {
              item.date = item.date + ' ' + item.time_span
            })
          }
          if (this.isCharge >= 0) {
            this.params.amount = res.data.charge_info.amount
            this.params.charge_method = res.data.charge_info.charge_method
          }
        }
      })
    },
    // 获取所有下拉条件
    getSubjectOption () {
      // 校区
      let params = { 'class_id': this.$route.query.id || null }
      classroomApi.queryClassOption(params).then(res => {
        if (res.ok) {
          this.optionCampus = res.data.options.campus
        }
      })
    },
    getType (type) {
      this.temp.type = type
      this.params = Object.assign({}, this.temp)
    }
  }
}
</script>
<style scoped>
.radiogroup {
  text-align: left;
  background-color: #fff;
  padding: 15px 30px;
  margin-top: 20px;
}
.radiogroup__title {
  color: #606266;
  margin-bottom: 15px;
}
</style>
