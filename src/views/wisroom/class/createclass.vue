<template>
  <div class="createClass" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/wisroomClass' }">班级管理</router-link>
        <el-breadcrumb-item>{{status=="edit"?"修改班级":"创建班级"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createClassContent">
      <p>基本信息</p>
      <el-form
        ref="createClassForm"
        :model="createForm"
        label-position="top"
        :rules="createRules"
        size="mini">
        <div class="left">
          <el-form-item label="课程名称" prop="scene_base_class_id">
            <el-select
              v-model="createForm.scene_base_class_id"
              placeholder="请选择课程"
              :disabled="status === 'edit' || !!$route.query.wareId"
              @visible-change="getCourseList"
              clearable
              @change="selectCourse">
              <el-option v-for="course in courseList" :key="course.id" :value="course.id" :label="course.course_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期" prop="term_id">
            <el-select :disabled="createForm.term_id === ''" v-model.trim="createForm.term_id" placeholder="请先选择课程" @change="selectTerm">
              <el-option v-for="term in termList" :key="term.id" :value="term.id" :label="term.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预招学员" prop="advance_student_num">
            <InputNumber v-model="createForm.advance_student_num" :max="20" :placeholder="'请输入预招学员人数'" :min="0" :width="'100%'" :height="'50px'" @change="inputChange"></InputNumber><span style="margin-left: -25px;color: #c0c4CC;">人</span>
          </el-form-item>
          <el-form-item label="校区" prop="campus_id">
            <el-select clearable v-model="createForm.campus_id" placeholder="请选择校区" @visible-change="getCampusList" style="width:100%;">
              <el-option v-for="campus in campusList" :key="campus.id" :value="campus.id" :label="campus.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间段" v-if="false">
            <div v-for="(item,index) in lesson_times" :key="index" class="padding-bottom-10">
              <dynamic-time
                :dynamicTimeData="item"
                :oneTimeIndex="index"
                :timeListLength="lesson_times.length"
                v-on:addOne="addOneTime"
                v-on:deleteOne="deleteOneTime(index)"
                v-on:sceneStartTimeChange="selectStartTime(item,index)"
                v-on:sceneEndTimeChange="selectEndTime(item,index)"
              ></dynamic-time>
            </div>
          </el-form-item>
          <el-form-item label="时间段" class="timePikerItem">
            <div v-for="(item,index) in periodList" v-if="item.visible" :key="index" class="padding-bottom-10" style="position: relative;">
              <el-time-picker
                v-model="item.start"
                :clearable="false"
                :editable="true"
                :disabled="!createForm.scene_base_class_id"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="开始时间"
                @change="selectStartTime(item.start, index)"
                :picker-options="{
                  selectableRange: (limitStartTimeList[index] ? limitStartTimeList[index].start : '00') + ':00 - ' + (limitStartTimeList[index] ? (limitStartTimeList[index].end + ':00') : '23:00')
                }">
              </el-time-picker>
              <el-time-picker
                v-model="item.end"
                :clearable="false"
                :editable="true"
                :disabled="!createForm.scene_base_class_id"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="结束时间"
                @change="selectEndTime(item.end, index)"
                :picker-options="{
                  selectableRange: (limitEndTimeList[index] ? limitEndTimeList[index].start : '00') + ':00 - ' + (limitEndTimeList[index] ? (limitEndTimeList[index].end + ':00') : '23:59')
                }">
              </el-time-picker>
              <div class="time-one">
                <i class="el-icon-circle-plus common-icon add-icon" @click="addPeriodTime(index)" v-if="useablePeriodIndex === index"></i>
                <i class="el-icon-remove common-icon delete-icon" @click="deletePeriodTime(index)" v-if="useablePeriodNum > 1"></i>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="年级" prop="grade_id">
            <el-select :disabled="createForm.grade_id === ''" v-model.trim="createForm.grade_id" placeholder="请先选择课程" @change="selectGrade">
              <el-option v-for="grade in gradeList" :key="grade.id" :value="grade.id" :label="grade.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="class_name">
            <el-input v-model="createForm.class_name" :maxlength="30" style="width: 340px" placeholder="请填写班级名称"></el-input>
          </el-form-item>
          <el-form-item label="老师" prop="scene_teacher_id">
            <el-select
              v-model="createForm.scene_teacher_id"
              @visible-change="getTeacherList"
              placeholder="请选择老师">
              <el-option v-for="teacher in teacherList" :key="teacher.id" :value="teacher.id" :label="teacher.name">{{teacher.name}}</el-option>
            </el-select>
            <el-button type="text" @click="searchTimeTable('teacher')">查看老师课表</el-button>
          </el-form-item>
          <el-form-item label="教室" prop="live_room_id">
            <el-select
              v-model="createForm.live_room_id"
              :disabled="status === 'edit'"
              @visible-change="getClassroomList"
              @change="selectClassroom"
              placeholder="请选择教室">
              <el-option v-for="classroom in classroomList" :key="classroom.id" :value="classroom.id" :label="classroom.name"></el-option>
            </el-select>
            <el-button type="text" @click="searchTimeTable('class')">查看教室课表</el-button>
          </el-form-item>
        </div>
        <!-- <el-form-item label="适用校区" prop="apply_campus_id">
          <el-radio-group :disabled="status === 'edit'" v-model="createForm.apply_campus_id" @change="changeCampusArea">
            <el-radio :label="0">全部校区</el-radio>
            <el-radio :label="1">指定校区</el-radio>
          </el-radio-group>
          <el-checkbox-group :disabled="status === 'edit'" v-if="createForm.apply_campus_id === 1" v-model="formCampusList">
            <el-checkbox class="campusCheckbox" v-for="campus in campusList" :key="campus.id" :label="campus.id" :value="campus.id">{{campus.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
      </el-form>
      <div class="payment_info" v-if="isCharge > 0 && false">
        <p>收费标准</p>
        <p>
          <span>收费标准：</span>
          <span v-if="createForm.amount">{{createForm.amount.split('元')[0]}}元/人/期</span>
        </p>
      </div>
      <p>讲次信息</p>
      <el-table
        :data="lessonList"
        style="width: 100%;"
        max-height="500">
        <el-table-column
          align="left"
          prop="index"
          label="讲次"
          width="150">
          <template slot-scope="scope">
            <div v-text="'第'+scope.row.index+'讲'"></div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lesson_name"
          label="讲次名称">
        </el-table-column>
        <el-table-column
          align="left"
          prop=""
          label="上课时长">
          <template slot-scope="scope">
            <span>{{scope.row.time_span}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="courseware"
          label="课件"
          v-if="isShowCourseware">
          <template slot-scope="scope">
            <!--<div class="courseware-status">-->
              <!--<el-button plain size="mini" class="status-exist" v-if="scope.row.coursewareStatus==2">已下载</el-button>-->
              <!--<el-button plain size="mini" class="status-noexist" v-if="scope.row.coursewareStatus==1">未下载</el-button>-->
              <!--<el-button plain size="mini" class="status-undetected" v-if="scope.row.coursewareStatus==0">未检测</el-button>-->
            <!--</div>-->
            <div class="courseware-status" v-if="scope.row.coursewareStatus==0">未检测</div>
            <div class="courseware-status" v-if="scope.row.coursewareStatus==1">不存在</div>
            <div class="courseware-status" v-if="scope.row.coursewareStatus==2">不完整</div>
            <div class="courseware-status" v-if="scope.row.coursewareStatus==3">已存在</div>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          align="center"
          prop="index"
          label="上课日期">
          <template slot-scope="scope">
            <div class="block">
              <!--<span v-if="scope.row.date">{{scope.row.date}}</span>-->
              <!--<el-button type="primary" class="clearfix cac-button-two chooseDateBtn" size="mini" round @click="openDatePicker(scope.$index)">{{scope.row.date ? '修改日期' : '选择日期'}}</el-button>-->
              <div class="inline-block">
                <el-date-picker
                  :ref="'datePicker' + scope.$index"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="scope.row.date"
                  type="date"
                  size="small"
                  prefix-icon=" "
                  :picker-options="dateOption"
                  :editable="false"
                  :clearable="false"
                  :disabled="$route.query.create==='edit'&&scope.row.scene_lesson_status!=1"
                  :default-value="defaultDateList[scope.$index]"
                  placeholder="请选择日期"
                  @change="((item)=>{lessonDateChange(item,scope.$index)})">
                </el-date-picker>
              </div>
              <div class="inline-block">
                <el-select
                  v-model="scope.row.lesson_time"
                  placeholder="请选择时间段"
                  size="small"
                  @change="((item)=>{lessonTimeChange(item,scope.$index)})"
                  :disabled="$route.query.create==='edit'&&scope.row.scene_lesson_status!=1">
                  <el-option
                    v-for="item in periodList"
                    :key="item.start + '-' + item.end"
                    v-if="item.visible"
                    :label="item.start + '-' + item.end"
                    :value="item.start + '-' + item.end">
                  </el-option>
                </el-select>
              </div>
              <!--<el-date-picker-->
              <!--:picker-options="dateOption"-->
              <!--:clearable="clearable"-->
              <!--value-format="yyyy-MM-dd HH:mm:ss"-->
              <!--v-model="time[scope.row.index]"-->
              <!--type="datetimerange"-->
              <!--@change="getTime(scope.row.index,scope.row.lesson_id,time[scope.row.index])"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期">-->
              <!--</el-date-picker>-->
            </div>
            <!--<div v-else>{{scope.row.scene_lesson_start_at.split(' ')[0] || '无'}}</div>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="timeTableDialog" width="1050px" append-to-body @open="timeTableDialogOpen" @close="timeTableDialogClose" :visible.sync="timeTableConfig.visible" style="height:100%;">
      <timeTableDialog ref="timeTable" :role="timeTableRole" :campus_id="createForm.campus_id" :brandId="4"></timeTableDialog>
    </el-dialog>
    <div class="bottom">
      <router-link :to="{ path: '/wisroomClass' }">
        <el-button type="primary" size="small" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      </router-link>
      <el-button type="primary" size="small" class="cac-button-one confirm_button" round @click="submitForm">{{status=="edit"?"修 改":"创 建"}}</el-button>
    </div>
  </div>
</template>
<script>
import authUtil from '@/services/auth/utils'
import classroomApi from '@/services/classroom'
import wisroomApi from '@/services/wisroom'
import receptionApi from '@/services/reception'
import staffApi from '@/services/internal/staff'
import timeTableDialog from '@/components/timetable.vue'
// import { formatDay } from '@/utils'
import inputNumber from '@/components/inputNumber'
import DynamicTime from '@/components/dynamicTime'
import PeriodTime from '@/components/periodTime'
export default {
  props: ['source'],
  data () {
    return {
      status: this.$route.query.create,
      firstStartTime: '',
      firstEndTime: '',
      startTime: '',
      endTime: '',
      loading: false,
      createForm: {
        campus_id: '',
        class_name: '',
        advance_student_num: '',
        scene_base_class_id: '',
        scene_teacher_id: '',
        live_room_id: '',
        room_name: '',
        apply_campus: '',
        apply_campus_id: 0,
        scene_start_time: '',
        scene_end_time: '',
        amount: '0.00',
        charge_method: 1,
        term_id: '',
        term_name: '',
        grade_id: '',
        grade_name: ''
      },
      // 时间段循环数组
      lesson_times: [{
        scene_start_time: '',
        scene_end_time: '',
        sign: 0
      }],
      createRules: {
        campus_id: [
          { required: true, message: '请选择校区', trigger: 'change' }
        ],
        class_name: [
          { required: true, message: '请输入班级名称', trigger: 'change' }
        ],
        advance_student_num: [
          { required: true, message: '请输入预招学员人数', trigger: 'change' },
          { max: 2, required: true, message: '学员人数最多为20人', trigger: 'change' }
        ],
        scene_base_class_id: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        scene_teacher_id: [
          { required: true, message: '请选择主讲', trigger: 'change' }
        ],
        live_room_id: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ],
        apply_campus: [
          { required: true, message: '请选择适用校区', trigger: 'change' }
        ],
        apply_campus_id: [
          { required: false, message: '请选择适用校区', trigger: 'change' }
        ],
        term_id: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        grade_id: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ]
      },
      campusList: [],
      formCampusList: [],
      courseList: [],
      teacherList: [],
      classroomList: [],
      lessonList: [],
      timeTableRole: '',
      timeTableConfig: {
        visible: false
      },
      // 时间段列表
      lessonTimeList: [],
      // 暂存添加时间
      tempAddTimes: [],
      // 是否显示课件
      isShowCourseware: false,
      // 缓存后台获取时间段长度
      tempLessonTimeListLength: '',
      // 缓存后台获取时间段数据
      historyTimeList: [],
      // 现有学员
      scene_student_num: '',
      // // 时间范围
      // timeDuration: ''
      isCharge: authUtil.getUser().permissions.indexOf('enroll_charge'),
      periodList: [{start: '', end: '', visible: true}],
      limitStartTimeList: [{start: '00:00:00', end: '23:59:59'}],
      limitEndTimeList: [{start: '00:00:00', end: '23:59:59'}],
      termList: [],
      gradeList: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/wisroomClass') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  components: {
    DynamicTime,
    timeTableDialog: timeTableDialog,
    PeriodTime: PeriodTime,
    InputNumber: inputNumber
  },
  computed: {
    dateOption () {
      let obj = {}
      obj.disabledDate = (date) => {
        var status = false
        var newDate = new Date()
        if (date.getTime() < (newDate.getTime() - newDate.getHours() * 3600000 - newDate.getMinutes() * 60000 - newDate.getSeconds() * 1000 - 1000)) {
          status = true
        }
        return status
      }
      return obj
    },
    useablePeriodNum () {
      let num = 0
      this.periodList.map((v, i) => {
        if (v.visible) {
          num += 1
        }
      })
      return num
    },
    useablePeriodIndex () {
      let num = 0
      this.periodList.map((v, i) => {
        if (v.visible) {
          num = i
        }
      })
      return num
    },
    defaultDateList () {
      let arr = []
      for (let i = 0; i < this.lessonList.length; i++) {
        if (this.lessonList[i + 1] && this.lessonList[i + 1].date) {
          arr[i] = this.lessonList[i + 1].date
        }
        if (this.lessonList[i - 1] && this.lessonList[i - 1].date) {
          arr[i] = this.lessonList[i - 1].date
        }
        if (arr[i + 1]) {
          arr[i] = arr[i + 1]
        }
        if (arr[i - 1]) {
          arr[i] = arr[i - 1]
        }
      }
      return arr
    }
  },
  created () {
    this.init()
    this.$nextTick(() => {
      if (this.$route.query.create === 'edit') {
        this.loading = true
        classroomApi.faceClassDetail({class_id: this.$route.query.id}).then(res => {
          this.loading = false
          if (res.status_code === 200) {
            // res.data.apply_campus_name = res.data.apply_campus_name.split(' ').join('、')
            // if (res.data.apply_campus_name[res.data.apply_campus_name.length - 1] === '、') {
            //   res.data.apply_campus_name = res.data.apply_campus_name.substring(0, res.data.apply_campus_name.length - 1)
            // }
            if (res.data.apply_campus[0] * 1 === 0) {
              res.data.apply_campus_id = 0
            } else {
              this.formCampusList = []
              res.data.apply_campus.map((v, index) => {
                this.formCampusList.push(v * 1)
              })
              res.data.apply_campus_id = 1
            }
            res.data.live_room_id = res.data.wisroom_room_id
            res.data.scene_start_time = res.data.lessons[0].scene_lesson_start_at.split(' ')[1]
            res.data.scene_end_time = res.data.lessons[0].scene_lesson_end_at.split(' ')[1]
            res.data.advance_student_num += ''
            this.createForm = res.data
            // 现有学员
            this.scene_student_num = res.data.scene_student_num
            if (this.isCharge >= 0) {
              this.createForm.amount = res.data.charge_info.amount
              this.createForm.charge_method = res.data.charge_info.charge_method
            }
            this.courseList = [{
              id: res.data.course_id,
              course_name: res.data.course_name
            }]
            this.lessonList = res.data.lessons
            this.getCourseDetail()
            this.getCampusList(true)
            this.getTeacherList(true)
            this.getClassroomList(true)
            // 获取讲次时间段信息
            // 获取课件状态
            let roomId = this.createForm.live_room_id
            this.getCoursewareStatus(roomId)
          }
        })
      }
    })
  },
  watch: {
    'periodList': {
      handler (val, oldval) {
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.getCampusList()
      this.getOptionsList()
      if (this.$route.query.wareId) {
        this.createForm.scene_base_class_id = this.$route.query.wareId * 1
        this.getCourseList(true)
      }
    },
    getCampusList (val) {
      if (val) {
        let params = {
          school_id: authUtil.getUser().school_id,
          status: 1
        }
        staffApi.getCampusList(params).then(res => {
          res.map((v, i) => {
            v.id *= 1
          })
          this.campusList = res
        })
      }
    },
    getOptionsList () {
      receptionApi.getOptionsByType({type: 4}).then((res) => {
        this.gradeList = res.data.grade
        this.termList = res.data.term
        if (this.createForm.grade_id) {
          this.gradeList.map((v, i) => {
            if (v.id === this.createForm.grade_id) {
              this.createForm.grade_name = v.name
            }
          })
        }
        if (this.createForm.term_id) {
          this.termList.map((v, i) => {
            if (v.id === this.createForm.term_id) {
              this.createForm.term_name = v.name
            }
          })
        }
      })
    },
    getCourseList (val) {
      var params = {
        brand: 4
      }
      if (this.$route.query.create !== 'edit') {
        params.can_use = 1
      }
      if (val) {
        wisroomApi.getCourseList(params).then(res => {
          if (res.ok) {
            this.courseList = res.data.list
            if (this.$route.query.create === 'edit') {
              this.courseList.map((v, i) => {
                if (v.id === this.createForm.course_id) {
                  this.timeDuration = v.period_time
                  this.editLimitTime()
                }
              })
            }
            if (this.$route.query.wareId) {
              this.selectCourse(this.$route.query.wareId)
            }
          }
        })
      }
    },
    getCourseDetail () {
      let params = {
        course_id: this.createForm.course_id,
        course_type: 4
      }
      wisroomApi.getCourseDetail(params).then(res => {
        if (res.status_code === 200) {
          this.timeDuration = res.data.period_time
          this.getLessonTimesLists()
        }
      })
    },
    editLimitTime () {
      if (this.periodList.length > 0) {
        this.periodList.map((v, index) => {
          this.selectStartTime(v.start, index)
          this.selectEndTime(v.end, index)
        })
      } else {
        this.editLimitTime()
      }
    },
    getClassroomList (val) {
      if (val) {
        let params = {
          page: 0,
          usage: 1,
          is_active: 1,
          type: 2,
          brand: 4
        }
        wisroomApi.getClassroomList(params).then(res => {
          if (res.ok) {
            this.classroomList = res.data.data
          }
        })
      }
    },
    selectGrade (gradeId) {
      if (gradeId) {
        this.gradeList.map((v, i) => {
          if (v.id === gradeId) {
            this.createForm.grade_name = v.name
          }
        })
      }
    },
    selectTerm (termId) {
      if (termId) {
        this.termList.map((v, i) => {
          if (v.id === termId) {
            this.createForm.term_name = v.name
          }
        })
      }
    },
    selectCourse (courseId) {
      if (!courseId) {
        this.createForm.grade_id = ''
        this.createForm.term_id = ''
        return
      }
      let params = {
        course_id: courseId,
        course_type: 4
      }
      this.courseList.map((v, i) => {
        if (v.id === courseId * 1) {
          this.timeDuration = v.period_time ? v.period_time : '1~6'
          this.createForm.amount = v.charge_info ? v.charge_info.amount : 0
        }
      })
      wisroomApi.getCourseDetail(params).then(res => {
        if (res.status_code === 200) {
          /* res.data.map((v, index) => {
            v.date = ''
          }) */
          this.lessonList = res.data.lessons
          this.createForm.grade_id = res.data.grade
          this.createForm.term_id = res.data.term
          this.selectGrade(res.data.grade)
          this.selectTerm(res.data.term)
        }
      })
      // 只有在编辑时获取讲次时间段信息
      if (this.$route.query.create === 'edit') {
        // 获取讲次时间段信息
        this.getLessonTimesLists()
      }
      if (this.createForm.live_room_id) {
        this.getCoursewareStatus(this.createForm.live_room_id)
      }
    },
    // 获取讲次时间段信息
    getLessonTimesLists () {
      // 获取讲次信息时间段
      // 班级Id
      let params = {
        class_id: this.$route.query.id
      }
      classroomApi.getLessonTimes(params).then(res => {
        if (res.status_code === 200) {
          this.periodList = []
          res.data.map((v, index) => {
            this.periodList.push({
              start: v.scene_start_time,
              end: v.scene_end_time,
              visible: true
            })
            this.selectStartTime(v.scene_start_time, index)
            this.selectEndTime(v.scene_end_time, index)
          })
          this.tempAddTimes = this.periodList.slice(0)
          if (this.$route.query.create !== 'edit') {
            if (this.periodList.length !== 0) {
              this.lessonList.map((v, i) => {
                this.periodList.map((o, j) => {
                  if (this.checkLessonTime(this.periodList[0].start + '-' + this.periodList[0].end, this.lessonList[j].period_time)) {
                    if (!v.lesson_time) {
                      v.lesson_time = this.periodList[0].start + '-' + this.periodList[0].end
                    }
                  }
                })
              })
            }
          }
          this.tempLessonTimeListLength = this.periodList.length
          this.historyTimeList = this.periodList
        }
      })
    },
    checkLessonTime (time, period) {
      if (!time || !period) {
        return false
      }
      var timeArr = time.split('-')
      var periodArr = period.split('-')
      var startTime = {}
      var endTime = {}
      var hour = 0
      var min = 0
      startTime.hour = timeArr[0].split(':')[0] * 1
      startTime.min = timeArr[0].split(':')[1] * 1
      endTime.hour = timeArr[1].split(':')[0] * 1
      endTime.min = timeArr[1].split(':')[1] * 1
      hour = 24 - startTime.hour + endTime.hour
      min = 60 - startTime.min + endTime.min
      var periodTime = hour + min / 60
      if (periodArr[0] <= periodTime <= periodArr[1]) {
        return true
      } else {
        return false
      }
    },
    selectClassroom (roomId) {
      this.classroomList.map((v, i) => {
        if (v.id === roomId) {
          this.createForm.room_name = v.name
        }
      })
      // 获取课件状态
      this.getCoursewareStatus(roomId)
    },
    // 获取课件状态
    getCoursewareStatus (roomId) {
      // 获取课件状态
      let params = {
        // 课程ID   教室ID  班级Id
        base_class_id: this.createForm.scene_base_class_id,
        live_room_id: roomId,
        class_id: this.$route.query.create === 'edit' ? this.$route.query.id : ''
      }
      classroomApi.getCoursewareStatus(params).then(res => {
        if (res.status_code === 200) {
          if (res.data.coursewareStatusList.length === 0) {
            this.lessonList.map((v, i) => {
              this.$set(v, 'coursewareStatus', 0)
            })
          } else {
            res.data.coursewareStatusList.map((item, i) => {
              this.$set(this.lessonList[i], 'coursewareStatus', item.status)
            })
          }
          this.isShowCourseware = true
        }
      })
    },
    getTeacherList (val) {
      if (val) {
        let params = {
          school_id: authUtil.getUser().school_id,
          brand: 4
        }
        classroomApi.getFaceTeacherList(params).then(res => {
          res.data.map((v, i) => {
            v.id *= 1
          })
          this.teacherList = res.data
        })
      }
    },
    searchTimeTable (value) {
      this.timeTableRole = value
      this.timeTableConfig.visible = true
    },
    timeTableDialogOpen () {
      this.$nextTick(() => {
        this.$refs.timeTable.initWeekDate()
      })
    },
    timeTableDialogClose () {
      this.timeTableRole = ''
      this.$refs.timeTable.clearTimeData()
    },
    changeCampusArea () {
      this.formCampusList = []
    },
    openDatePicker (index) {
      this.$refs['datePicker' + index].focus()
    },
    inputChange (val) {
      let num = Number(this.createForm.advance_student_num)
      if (num && num > 20) {
        this.createRules.advance_student_num[0].max = 0
        this.createRules.advance_student_num[0].message = '最多为20人'
      } else if (this.createForm.advance_student_num && num < 1) {
        this.createRules.advance_student_num[0].max = 0
        this.createRules.advance_student_num[0].message = '最少为1人'
      } else if (this.$route.query.create === 'edit') {
        if (num < this.scene_student_num) {
          this.createRules.advance_student_num[0].max = 0
          this.createRules.advance_student_num[0].message = '预招人数小于现有学员，请重新修改'
        } else {
          this.createRules.advance_student_num[0].max = 2
        }
      } else {
        this.createRules.advance_student_num[0].max = 2
        this.createRules.advance_student_num[0].message = '请输入预招学员人数'
      }
      if (val === 0) {
        val = ''
      }
      this.createForm.advance_student_num = val + ''
    },
    studentNumInput (event) {
      const invalidChars = ['-', '-', '+', '+', 'e', '.', 'E']
      if (invalidChars.indexOf(event.key) !== -1) {
        event.preventDefault()
      }
    },
    studentNumChange () {
      this.createForm.advance_student_num = this.createForm.advance_student_num.replace(/[^0-9]/ig, '')
    },
    studentNumBlur () {
      let num = Number(this.createForm.advance_student_num)
      if (num && num > 20) {
        this.createRules.advance_student_num[0].max = 0
        this.createRules.advance_student_num[0].message = '最多为20人'
      } else if (this.createForm.advance_student_num && num < 1) {
        this.createRules.advance_student_num[0].max = 0
        this.createRules.advance_student_num[0].message = '最少为1人'
      } else if (this.$route.query.create === 'edit') {
        if (num < this.scene_student_num) {
          this.createRules.advance_student_num[0].max = 0
          this.createRules.advance_student_num[0].message = '预招人数小于现有学员，请重新修改'
        } else {
          this.createRules.advance_student_num[0].max = 2
        }
      } else {
        this.createRules.advance_student_num[0].max = 2
        this.createRules.advance_student_num[0].message = '请输入预招学员人数'
      }
    },
    submitForm () {
      this.loading = true
      this.$refs.createClassForm.validate((valid) => {
        if (valid) {
          let params = this.createForm
          let list = []
          let canCreate = true
          if (this.lessonList.length > 0) {
            this.lessonList.map((res) => {
              if (!res.date) {
                this.$message({
                  message: '请选择上课日期',
                  type: 'warning',
                  center: true
                })
                canCreate = false
              }
              if (!res.lesson_time) {
                this.$message({
                  message: '请选择上课时间段',
                  type: 'warning',
                  center: true
                })
                canCreate = false
              }
              if (canCreate) {
                list.push({
                  lesson_id: res.id,
                  index: res.index,
                  date: res.date,
                  scene_start_time: res.lesson_time.split('-')[0],
                  scene_end_time: res.lesson_time.split('-')[1],
                  scene_lesson_status: this.$route.query.create === 'edit' ? res.scene_lesson_status : ''
                })
              }
            })
          }
          if (!canCreate) {
            this.loading = false
            return
          }
          params.lessons = list
          // 开课时间----讲次信息第一条数据
          this.createForm.scene_start_time = list[0].scene_start_time
          this.createForm.scene_end_time = list[0].scene_end_time
          if (params.apply_campus_id === 1) {
            params.apply_campus = this.formCampusList.join(',')
          } else {
            params.apply_campus = 0
          }
          params.type = 4
          if (this.status === 'edit') {
            params.live_org_class_id = params.id
            classroomApi.editFaceClass(params).then(res => {
              this.loading = false
              if (res.status_code === 200) {
                this.$router.back()
              }
            })
          } else {
            classroomApi.createClass(params).then(res => {
              this.loading = false
              if (res.status_code === 200) {
                this.$router.back()
              }
            })
          }
        } else {
          this.loading = false
        }
      })
    },
    // 添加一个时间段
    addOneTime () {
      this.lesson_times.push({
        scene_start_time: '',
        scene_end_time: '',
        sign: this.tempAddTimes.length
      })
    },
    // 删除一个时间段
    deleteOneTime (index) {
      this.lessonTimeList[index].visible = false
      const leftSign = this.lesson_times[index].sign
      for (var i = 0; i < this.lessonTimeList.length; i++) {
        if (leftSign === this.lessonTimeList[i].sign) {
          this.lessonTimeList[i].sign = 'a' + index
        }
      }
      // this.lessonTimeList[index].sign = 'a' + index
      this.lesson_times.splice(index, 1)
    },
    selectStartTime (item, index) {
      if (item === null) {
        this.limitEndTimeList[index] = {
          start: '00:00',
          end: '23:59'
        }
        return
      }
      if (!item) {
        this.limitEndTimeList[index] = {
          start: '',
          end: ''
        }
        this.periodList[index].start = ''
        return false
      } else {
        for (var i = 0; i < this.periodList.length; i++) {
          if (i !== index) {
            if (this.periodList[i].visible && (item === this.periodList[i].start && this.periodList[index].end === this.periodList[i].end)) {
              this.$message({
                message: '时间段重复',
                type: 'warning',
                center: true
              })
              this.periodList[index].start = ''
              return false
            }
          }
        }
        let arr = item.split(':')
        let newArr1 = []
        let newArr2 = []
        newArr1[0] = Number(arr[0])
        newArr1[1] = Number(arr[1]) + 1
        newArr2[0] = Number(arr[0])
        newArr2[1] = Number(arr[1]) + 1
        if (this.periodList[index].end && this.limitStartTimeList[index] && arr[0] * 1 > this.limitStartTimeList[index].end.split(':')[0] * 1) {
          this.$message({
            message: '请选择结束时间之前的时间',
            type: 'warning',
            center: true
          })
          this.periodList[index].start = ''
          return
        }
        let start = newArr1.join(':')
        let isSame = false
        this.limitEndTimeList.map((v, i) => {
          if (arr[0] === v.start && arr[1] === v.end) {
            isSame = true
          }
        })
        if (isSame) {
          this.periodList[index].start = ''
          this.limitEndTimeList[index] = {
            start: '00:00',
            end: '23:59'
          }
        } else {
          this.limitEndTimeList[index] = {
            start: start,
            end: '23:59'
          }
        }
        if (index === 0 && this.$route.query.create !== 'edit') {
          if (this.periodList[0].start && this.periodList[0].end) {
            this.lessonList.map((v, i) => {
              this.$set(this.lessonList[i], 'lesson_time', this.periodList[0].start + '-' + this.periodList[0].end)
            })
          }
        }
      }
    },
    selectEndTime (item, index) {
      console.log(item, index)
      if (item === null) {
        this.limitStartTimeList[index] = {
          start: '00:00',
          end: '23:59'
        }
        return
      }
      if (!item) {
        this.limitStartTimeList[index] = {
          start: '',
          end: ''
        }
        return false
      } else {
        for (var i = 0; i < this.periodList.length; i++) {
          if (i !== index) {
            if (this.periodList[i].visible && (item === this.periodList[i].end && this.periodList[index].start === this.periodList[i].start)) {
              this.$message({
                message: '时间段重复',
                type: 'warning',
                center: true
              })
              this.periodList[index].end = ''
              return
            }
          }
        }
        let arr = item.split(':')
        let newArr1 = []
        let newArr2 = []
        newArr1[0] = Number(arr[0])
        newArr1[1] = Number(arr[1]) - 1
        newArr2[0] = Number(arr[0])
        newArr2[1] = Number(arr[1]) - 1
        if (this.periodList[index].start && this.limitEndTimeList[index] && arr[0] * 1 < this.limitEndTimeList[index].start.split(':')[0] * 1) {
          this.$message({
            message: '请选择开始时间之后的时间',
            type: 'warning',
            center: true
          })
          this.periodList[index].end = ''
          return
        }
        let end = newArr2.join(':')
        let isSame = false
        this.limitStartTimeList.map((v, i) => {
          if (arr[0] === v.start && arr[1] === v.end) {
            isSame = true
          }
        })
        if (isSame) {
          this.periodList[index].end = ''
          this.limitStartTimeList[index] = {
            start: '00:00',
            end: '23:59'
          }
        } else {
          this.limitStartTimeList[index] = {
            start: '00:00',
            end: end
          }
        }
        if (index === 0 && this.$route.query.create !== 'edit') {
          if (this.periodList[0].start && this.periodList[0].end) {
            this.lessonList.map((v, i) => {
              this.$set(this.lessonList[i], 'lesson_time', this.periodList[0].start + '-' + this.periodList[0].end)
            })
          }
        }
      }
    },
    addPeriodTime (index) {
      if (!this.periodList[index].start || !this.periodList[index].end) {
        this.$message({
          message: '请先配置已上时间段',
          type: 'warning',
          center: true
        })
        return
      }
      this.periodList.push({
        start: '',
        end: '',
        visible: true
      })
      this.limitStartTimeList.push({
        start: '00:00',
        end: '23:59'
      })
      this.limitEndTimeList.push({
        start: '00:00',
        end: '23:59'
      })
    },
    deletePeriodTime (index) {
      this.periodList[index].visible = false
      this.limitStartTimeList.slice(index, 1)
      this.limitEndTimeList.slice(index, 1)
    },
    /*
    selectStartTime (item, index) {
      if (this.$route.query.create !== 'edit' && !this.timeDuration) {
        this.$message({
          message: '请先选择校区和课程名称',
          type: 'warning',
          center: true
        })
        item.scene_start_time = ''
        return false
      }
      if (item.scene_end_time !== '') {
        var time = {
          start: this.timeDuration.split('~')[0] * 1 * 60 * 60 * 1000,
          end: this.timeDuration.split('~')[1] * 1 * 60 * 60 * 1000
        }
        var beginTime = new Date(new Date().toLocaleDateString() + ' ' + item.scene_start_time + ':00').getTime()
        var endTime = new Date(new Date().toLocaleDateString() + ' ' + item.scene_end_time + ':00').getTime()
        var nowDifferentVal = endTime - beginTime
        if (nowDifferentVal < time.start || nowDifferentVal > time.end) {
          this.$message({
            message: '请输入' + this.timeDuration + '小时内区间值',
            type: 'warning',
            center: true
          })
          item.scene_start_time = ''
          return false
        }
      }
      if (item.scene_start_time !== '' && item.scene_end_time !== '') {
        let beginTime = item.scene_start_time
        let endTime = item.scene_end_time
        for (let i = 0; i < this.lesson_times.length; i++) {
          if (i !== index) {
            let someIBeginTime = this.lesson_times[i].scene_start_time
            let someIEndTime = this.lesson_times[i].scene_end_time
            if (beginTime === someIBeginTime && endTime === someIEndTime) {
              this.$message({
                message: '时间段重复',
                type: 'warning',
                center: true
              })
              this.lesson_times[index].scene_start_time = ''
              this.lesson_times[index].scene_end_time = ''
              return false
            }
          }
        }
        for (let i = 0; i < this.lessonTimeList.length; i++) {
          let someIBeginTime = this.lessonTimeList[i].label.split('-')[0]
          let someIEndTime = this.lessonTimeList[i].label.split('-')[1]
          if (beginTime === someIBeginTime && endTime === someIEndTime) {
            this.$message({
              message: '时间段重复',
              type: 'warning',
              center: true
            })
            this.lesson_times[index].scene_start_time = ''
            this.lesson_times[index].scene_end_time = ''
            return false
          }
        }
        var Exit = true
        for (var i = 0; i < this.lessonTimeList.length; i++) {
          if (item.sign === this.lessonTimeList[i].sign) {
            this.$set(this.lessonTimeList, i, {label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
            Exit = false
          }
        }
        if (Exit) {
          this.lessonTimeList.push({label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
          this.tempAddTimes.push({label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
        }
      }
      if (this.$route.query.create === 'create') {
        if (index === 0 && item.scene_start_time !== '' && item.scene_end_time !== '') {
          this.lessonList.map((v, i) => {
            v.lesson_time = this.lessonTimeList[0].label
            // v.lesson_time = {label: this.lesson_times[0].scene_start_time + '-' + this.lesson_times[0].scene_end_time}
          })
        }
      }
    },
    selectEndTime (item, index) {
      if (this.$route.query.create !== 'edit' && !this.timeDuration) {
        this.$message({
          message: '请先选择校区和课程名称',
          type: 'warning',
          center: true
        })
        item.scene_end_time = ''
        return false
      }
      if (item.scene_start_time !== '') {
        var time = {
          start: this.timeDuration.split('~')[0] * 1 * 60 * 60 * 1000,
          end: this.timeDuration.split('~')[1] * 1 * 60 * 60 * 1000
        }
        var beginTime = new Date(new Date().toLocaleDateString() + ' ' + item.scene_start_time + ':00').getTime()
        var endTime = new Date(new Date().toLocaleDateString() + ' ' + item.scene_end_time + ':00').getTime()
        var nowDifferentVal = endTime - beginTime
        if (nowDifferentVal < time.start || nowDifferentVal > time.end) {
          this.$message({
            message: '请输入' + this.timeDuration + '小时内区间值',
            type: 'warning',
            center: true
          })
          item.scene_end_time = ''
          return false
        }
      }
      if (item.scene_start_time !== '' && item.scene_end_time !== '') {
        let beginTime = item.scene_start_time
        let endTime = item.scene_end_time
        for (let i = 0; i < this.lesson_times.length; i++) {
          if (i !== index) {
            let someIBeginTime = this.lesson_times[i].scene_start_time
            let someIEndTime = this.lesson_times[i].scene_end_time
            if (beginTime === someIBeginTime && endTime === someIEndTime) {
              this.$message({
                message: '时间段重复',
                type: 'warning',
                center: true
              })
              this.lesson_times[index].scene_start_time = ''
              this.lesson_times[index].scene_end_time = ''
              return false
            }
          }
        }
        for (let i = 0; i < this.lessonTimeList.length; i++) {
          let someIBeginTime = this.lessonTimeList[i].label.split('-')[0]
          let someIEndTime = this.lessonTimeList[i].label.split('-')[1]
          if (beginTime === someIBeginTime && endTime === someIEndTime) {
            this.$message({
              message: '时间段重复',
              type: 'warning',
              center: true
            })
            this.lesson_times[index].scene_start_time = ''
            this.lesson_times[index].scene_end_time = ''
            return false
          }
        }
        var Exit = true
        for (var i = 0; i < this.lessonTimeList.length; i++) {
          if (item.sign === this.lessonTimeList[i].sign) {
            this.$set(this.lessonTimeList, i, {label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
            Exit = false
          }
        }
        if (Exit) {
          this.lessonTimeList.push({label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
          this.tempAddTimes.push({label: item.scene_start_time + '-' + item.scene_end_time, sign: item.sign})
        }
      }
      if (this.$route.query.create === 'create') {
        if (index === 0 && item.scene_start_time !== '' && item.scene_end_time !== '') {
          this.lessonList.map((v, i) => {
            v.lesson_time = this.lessonTimeList[0].label
            // v.lesson_time = {label: this.lesson_times[0].scene_start_time + '-' + this.lesson_times[0].scene_end_time}
          })
        }
      }
    }, */
    // 讲次信息列表日期改变方法
    lessonDateChange (val, index) {
      // let nowDate = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
      val = val.replace(/-/g, '/')
      let newVal = new Date(val + ' ' + '00:00:00').getTime()
      // if (newVal === nowDate) {
      //  this.$message({
      //    message: '不可选择当天日期，请修改',
      //    type: 'warning',
      //    center: true
      //  })
      //  this.lessonList[index].date = ''
      //  return false
      // } else {

      // }
      for (var i = 0; i < this.lessonList.length; i++) {
        if (!this.lessonList[i].date) {
          continue
        } else {
          var lessonListIDate = this.lessonList[i].date.replace(/-/g, '/')
          let someOneDate = new Date(lessonListIDate + ' ' + '00:00:00').getTime()
          if (i < index) {
            if (newVal < someOneDate) {
              this.$message({
                message: '日期需按照时间顺序选择，请重新选择',
                type: 'warning',
                center: true
              })
              this.lessonList[index].date = ''
              return false
            }
          }
          if (i > index) {
            if (newVal > someOneDate) {
              this.$message({
                message: '日期需按照时间顺序选择，请重新选择',
                type: 'warning',
                center: true
              })
              this.lessonList[index].date = ''
              return false
            }
          }
        }
        if (i !== index) {
          var timeArr
          var tempTimeStampBegin
          var tempTimeStampEnd
          if (!this.lessonList[index].lesson_time) {
            continue
          } else {
            timeArr = this.lessonList[index].lesson_time.split('-')
            tempTimeStampBegin = new Date(val + ' ' + timeArr[0] + ':00').getTime()
            tempTimeStampEnd = new Date(val + ' ' + timeArr[1] + ':00').getTime()
          }
          var arr
          var beginTime
          var endTime
          if (this.lessonList[i].date === '' || this.lessonList[i].lesson_time === '') {
            continue
          } else {
            arr = this.lessonList[i].lesson_time.split('-')
            beginTime = new Date(lessonListIDate + ' ' + arr[0] + ':00').getTime()
            endTime = new Date(lessonListIDate + ' ' + arr[1] + ':00').getTime()
          }
          if (!(endTime < tempTimeStampBegin || beginTime > tempTimeStampEnd)) {
            this.$message({
              message: '日期或时间段重复，请重新选择',
              type: 'warning',
              center: true
            })
            this.lessonList[index].date = ''
            return false
          }
        }
      }
    },
    // 讲次信息时间段改变方法
    lessonTimeChange (item, index) {
      var temp = this.lessonList[index]
      temp.lesson_time = item
      for (var i = 0; i < this.lessonList.length; i++) {
        if (i !== index) {
          var timeArr
          timeArr = temp.lesson_time.split('-')
          if (!this.lessonList[index].date) {
            continue
          } else {
            var lessonListIndexDate = this.lessonList[index].date.replace(/-/g, '/')
            var tempTimeStampBegin = new Date(lessonListIndexDate + ' ' + timeArr[0] + ':00').getTime()
            var tempTimeStampEnd = new Date(lessonListIndexDate + ' ' + timeArr[1] + ':00').getTime()
          }
          var lessonListIDate
          var arr
          var beginTime
          var endTime
          if (this.lessonList[i].date === '' || this.lessonList[i].lesson_time === '') {
            continue
          } else {
            lessonListIDate = this.lessonList[i].date.replace(/-/g, '/')
            arr = this.lessonList[i].lesson_time.split('-')
            beginTime = new Date(lessonListIDate + ' ' + arr[0] + ':00').getTime()
            endTime = new Date(lessonListIDate + ' ' + arr[1] + ':00').getTime()
          }
          if (!(endTime < tempTimeStampBegin || beginTime > tempTimeStampEnd)) {
            this.$message({
              message: '日期或时间段重复，请重新选择',
              type: 'warning',
              center: true
            })
            this.lessonList[index].lesson_time = ''
            return false
          }
        }
      }
      this.$set(this.lessonList, index, temp)
    }
  }
}
</script>
<style lang="less">
.createClass {
  text-align: left;
  .createClassContent {
    & > p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin: 30px 0;
    }
    .left,
    .right {
      display: inline-block;
      vertical-align: top;
    }
    .left {
      margin-right: 80px;
      min-width:340px;
    }
    .el-form-item {
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        color: #7A808D;
      }
      .el-select {
        width: 340px;
      }
      input, .el-input__inner {
        height: 50px;
      }
      .el-date-editor {
        display: inline-block;
        width: 168px;
      }
      .el-checkbox {
        margin-left: 0;
        margin-right: 20px;
        .el-checkbox__label {
          width: 150px;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .time-one{
        position: absolute;
        top: 0;
        left: 350px;
        min-width:50px;
        display:inline-block;
      }
      .common-icon{
        line-height:50px;
        display:inline-block;
        font-size:20px;
      }
      .add-icon{
        color:#3C75F6;
      }
      .delete-icon{
        color:#FF6968;
      }
    }
    .timePikerItem {
      .el-form-item__label::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .payment_info {
      & > p {
        font-size: 20px;
        font-weight: bold;
        height: 28px;
        line-height: 28px;
        margin: 30px 0;
      }
    }
    .el-table {
      .block {
        /*position: relative;*/
        /*display: inline-block;*/
        /*width: 250px;*/
        /*height: 30px;*/
        /*text-align: left;*/
        .inline-block{
          display:inline-block;
        }
        .tips-error{
          color:#F56C6C;
        }
        .el-select{
          width:128px;
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width:128px;
        }
        .el-input--prefix .el-input__inner{
          padding-left:5px;
          padding-right:5px;
        }
        .el-date-editor {
          /*position: absolute;*/
          /*left: 50%;*/
          /*margin-left: -50px;*/
          /*width: 20px;*/
          /*height: 10px;*/
          /*input {*/
            /*width: 20px;*/
            /*height: 10px;*/
            /*margin-top: 5px;*/
            /*margin-left: 10px;*/
          /*}*/
          /*i {*/
            /*display: none;*/
          /*}*/
          .el-input,.el-input__inner{
            width:128px;
            text-align:center;
          }
        }
        .el-button {
          position: absolute;
          width: 100px;
          margin-left: -50px;
          left: 50%;
          z-index: 1;
          background-color: #fff;
        }
      }
    }
  }
  .bottom {
    margin-top: 20px;
  }
  // 底部10像素padding
  .padding-bottom-10{
    padding-bottom:10px;
  }
}
</style>
<style>
  .courseware-status{
    color:#3E434C;
    font-size:13px;
  }
  /*课件状态样式*/
  .courseware-status .el-button{
    width:56px;
    height:24px;
    border-radius:12px;
    text-align: center;
  }
  .courseware-status .el-button--mini, .el-button--mini.is-round{
    padding:2px;
  }
  .status-exist{
    background:rgba(89,198,134,0.05);
    color:rgba(89,198,134,1);
  }
  .status-noexist{
    background:rgba(122,128,141,0.05);
    color:rgba(122,128,141,1);
  }
  .status-undetected{
    background:rgba(255,141,65,0.05);
    color:rgba(255,141,65,1);
  }
</style>
