<!-- 面授课程 -->
<template>
  <div id='tofaceclassPage'>
    <div class="createForm">
      <el-form
        :model="params"
        :rules="rules"
        ref="params"
        label-width="100px"
        class="createForm--form"
        size="mini"
        label-position="top">
        <div class="inputWrap cac-shadow">
          <el-form-item label="班级类型" prop="base_class_id" class="createForm--formItem">
            <el-input v-model="params.base_class_id" style="display:none"></el-input>
            <el-button type="primary" @click="dialogVisible=true" class="createForm--formItem--name" :class="{'placeholder__color':base_class_name==='请选择班型'}" :disabled="status==='edit'">{{base_class_name}}</el-button>
          </el-form-item>
          <el-form-item label="班级名称" prop="class_name" class="createForm--formItem">
            <el-input :maxlength="30" v-model.trim="params.class_name" placeholder="班级名称" class="createForm__input"></el-input>
          </el-form-item>
          <!-- <el-form-item label="授课教师" prop="teacher_name" class="createForm--formItem">
          <el-col :span="23">
            <el-autocomplete class="inline-input" popper-class="my-autocomplete" label=“name” clearable v-model="params.teacher_name" :fetch-suggestions="querySearchAsync" placeholder="请输入教师姓名、手机号" :trigger-on-focus="false" @select="getTeacher"></el-autocomplete>
          </el-col>
        </el-form-item> -->
          <el-form-item label="授课教师" prop="teacher_id" class="createForm--formItem">
            <el-select v-model="params.teacher_id" placeholder="授课教师" filterable :disabled="params.status===3">
              <el-option v-for="item in optionTeacher" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校区" prop="campus_id" class="createForm--formItem">
            <el-select v-model="params.campus_id" placeholder="校区" filterable>
              <el-option v-for="item in optionCampus" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程开始日期" required class="createForm--formItem">
            <el-form-item prop="start_date">
              <el-date-picker class="createForm__datePicker" type="date" :editable="false" placeholder="选择日期" :disabled="params.status===2" v-model="params.start_date" @change="handleStartDateChange" format="yyyy-MM-dd" :picker-options="dateOption"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
        <div class="selectWrap">
          <el-form-item label="课程时段" prop="lesson_date" class="inputWrap__radio">
            <el-radio-group v-model="params.lesson_date" @change="handleWeekdayChange" :disabled="params.status===2||params.status===3">
              <el-radio :label="item.value" v-for="item in dateList" :key="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="setDateView">
            <div class="setDateView__all" v-show="params.lesson_date!==''">
              <span class="setDateView__all__title">{{dateLabel||'起止'}}</span>
              <el-time-select :editable="false" class="setDateView__all__item" placeholder="起始时间" v-model="params.startTime" :picker-options="{
            start: '06:00',
            step: '00:15',
            end: '23:00',
            maxTime: params.endTime
          }">
              </el-time-select>
              <span class="setDateView__all__middle"> 至</span>
              <el-time-select :editable="false" class="setDateView__all__item" placeholder="结束时间" v-model="params.endTime" :picker-options="{
            start: '06:00',
            step: '00:15',
            end: '23:00',
            minTime: params.startTime
          }">
              </el-time-select>
            </div>
            <el-button type="text" class="setDateView__button" @click="toggleDetail" plain>
              <i class="el-icon-caret-bottom showmore" :class="{'el-icon-caret-top':showDetail}"></i>{{showDetail?'收起设置':'更多设置'}}</el-button>
            <div class="setDateView--detail" v-show="showDetail">
              <CourseSettingItem :lesson_name="item.lesson_name" :next-weekday="nextWeekday" :startDate="params.start_date" :date="item.date" :symbol="params.lesson_date" :start-time="item.startTime||params.startTime" :end-time="item.endTime||params.endTime" v-model="courseListData[index]" :index="index" :is_special="item.is_special" v-for="(item,index) in courseList" :key="item.course_id" :commonStartTime="params.startTime" :commonEndTime="params.endTime" :status="item.status" :lessonDate="params.lesson_date">
              </CourseSettingItem>
            </div>
          </div>
        </div>
      </el-form>
      <br/>
      <div class="bottom">
        <el-button type="primary" size="small" @click="doCancle" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
        <el-button type="primary" size="small" @click="doCreate('params')" class="cac-button-one confirm_button" round>{{status=="edit"?"修 改":"创 建"}}</el-button>
      </div>
    </div>
    <el-dialog title="请选择班型" :visible.sync="dialogVisible" width="450px">
      <ChooseClassType :params="params" :optionSubject="optionSubject" :courseList="courseList" @close="doClose"></ChooseClassType>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import CourseSettingItem from '@/components/classroom/CourseSettingItem'
import ChooseClassType from '@/components/classroom/ChooseClassType'
import classroomApi from '@/services/classroom'
import { getNextWeekday, formatDate, formatDateTime } from '@/utils'

export default {
  data () {
    return {
      dateOption: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      dialogVisible: false,
      showDetail: false,
      restaurants: [],
      timeout: null,
      dateList: [
        { label: '每天', value: 7 },
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 0 }
      ],
      base_class_name: '请选择班型',
      courseList: [], // 后台返回的课程列表
      courseListData: [], // 用于接收子组件中的日期数据
      nextWeekday: new Date(), // 最近的下一个周几
      optionTeacher: []
    }
  },
  props: {
    params: Object,
    rules: Object,
    status: String,
    optionSubject: Array,
    optionCampus: Array
  },
  computed: {
    // 用于显示选择的日期
    dateLabel () {
      let item = _.find(this.dateList, ['value', this.params.lesson_date])
      return item ? item.label : ''
    }
  },
  components: {
    CourseSettingItem,
    ChooseClassType
  },
  created () {
    this.base_class_name = this.params.base_class_name === '' ? this.base_class_name : this.params.base_class_name
    this.params.lessons.forEach((item, i) => {
      this.courseList.push({
        'date': formatDateTime(item.date),
        'endTime': item.end_time,
        'startTime': item.start_time,
        'index': item.index,
        'is_special': Boolean(item.is_special),
        'lesson_name': item.lesson_name,
        'id': item.lesson_id,
        'status': item.status === 1
      })
    })
    this.getTeacherList()
  },
  watch: {
    params: {
      handler () {
        if (this.$route.query.create === 'edit') {
          this.base_class_name = this.params.base_class_name === '' ? this.base_class_name : this.params.base_class_name
          this.params.lessons.forEach((item, i) => {
            this.courseList.push({
              'date': formatDateTime(item.date),
              'endTime': item.end_time,
              'startTime': item.start_time,
              'index': item.index,
              'is_special': Boolean(item.is_special),
              'lesson_name': item.lesson_name,
              'id': item.lesson_id,
              'status': item.status === 1
            })
          })
        }
      },
      deep: true
    }
  },
  methods: {
    // 课程开始日期变化
    handleStartDateChange () {
      this.handleWeekdayChange(this.params.lesson_date)
    },
    // 选择课程时段
    handleWeekdayChange (val) {
      if (!this.params.start_date) {
        this.$message({
          type: 'warning',
          message: '请先选择课程开始日期',
          center: true
        })
      } else {
        this.nextWeekday = getNextWeekday(this.params.start_date, val)
      }
    },
    // 获取所有老师
    getTeacherList () {
      classroomApi.queryTeacher().then(res => {
        if (res.ok) {
          this.optionTeacher = res.data
        }
      })
    },
    // 切换详细设置
    toggleDetail () {
      if (!this.showDetail && (!this.params.start_date || this.courseList.length === 0)) {
        if (this.courseList.length === 0 && this.params.base_class_id !== 0) {
          this.$message({
            type: 'warning',
            message: '当前班型没有对应课节，请重新选择班型！',
            center: true
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择班级类型和课程开始日期',
            center: true
          })
        }
      } else {
        this.showDetail = !this.showDetail
      }
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
          this.courseList.forEach((item, i) => {
            this.courseListData.forEach((value, j) => {
              if (i === j) {
                value.key = item.index
                value.lesson_id = item.id
              }
            })
          })
          var lessons = []
          for (var i = 0; i < this.courseListData.length; i++) {
            lessons.push({
              'index': this.courseListData[i].key,
              'lesson_id': this.courseListData[i].lesson_id,
              'date': formatDate(this.courseListData[i].date),
              'start_time': formatDate(this.courseListData[i].date).split(' ')[0] + ' ' + this.courseListData[i].startTime + ':00',
              'end_time': formatDate(this.courseListData[i].date).split(' ')[0] + ' ' + this.courseListData[i].endTime + ':00',
              'is_special': Number(this.courseListData[i].is_special)
            })
          }
          let params = {}
          if (lessons.length !== 0) {
            params = {
              'class_info': {
                'base_class_id': this.params.base_class_id,
                'subject_id': this.params.subject_id,
                'grade_id': this.params.grade_id,
                'level': this.params.level,
                'term_id': this.params.term_id,
                'teacher_id': this.params.teacher_id,
                'class_name': this.params.class_name,
                'campus_id': this.params.campus_id,
                'lesson_date': this.params.lesson_date,
                'start_time': formatDate(this.params.start_date).split(' ')[0] + ' ' + this.params.startTime + ':00',
                'end_time': lessons[lessons.length - 1].date.split(' ')[0] + ' ' + this.params.endTime + ':00', // 有问题，不是
                'lessons': lessons
              }
            }
          } else {
            this.$message({
              type: 'warning',
              message: '该班型无讲次，请重新选择！',
              center: true
            })
            return false
          }
          if (this.status === 'create') {
            let loadingInstance = this.$loading({
              text: '提交中...',
              target: '.appMain'
            })
            classroomApi.create(params).then(res => {
              setTimeout(() => {
                loadingInstance.close()
              }, 500)
              if (res.ok) {
                this.$router.back()
              }
            })
          } else {
            let loadingInstance = this.$loading({
              text: '修改中...',
              target: '.appMain'
            })
            params.class_id = this.$route.query.id
            classroomApi.update(params).then(res => {
              setTimeout(() => {
                loadingInstance.close()
              }, 500)
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
    }
  }
}
</script>
<style scoped>
.createForm {
  text-align: left;
}
.createForm--form {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.createForm--formItem:nth-child(1) {
  width: 100%;
}
.el-button--success.is-plain {
  margin-top: 15px;
}
.el-dialog__body .el-select {
  margin-bottom: 10px;
}
.el-dialog__body .el-select:last-child {
  margin-bottom: 0;
}
.bottom {
  padding-top: 30px;
  text-align: center;
  background-color: #f4f8fb;
}
.inputWrap {
  width: 100%;
  display: flex;
  background-color: #fff;
  margin-top: 20px;
  padding: 38px;
}
.inputWrap > div {
  flex: 1;
  padding-right: 30px;
}
.createForm--formItem--name {
  text-align: left;
  border: 1px solid #e6ecef !important;
}
.el-form-item__content > div,
.el-form-item__content > button {
  width: 100%;
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
.setDateView {
  background-color: rgba(244, 246, 247, 0.4);
  padding: 27px 20px 0 20px;
}
.setDateView__all {
  padding-top: 27px;
  padding-left: 20px;
  padding-bottom: 32px;
}
.setDateView__all__title {
  width: 50px;
  display: inline-block;
}
.setDateView--detail {
  border-top: 1px solid #e4e7e9;
}
.setDateView__button {
  float: right;
  margin-top: -57px;
  margin-right: 20px;
}
.showmore {
  font-size: 14px;
}
.setDateView__all__middle {
  margin: 0 5px;
  display: inline-block;
}
.el-date-editor.el-input {
  width: 190px;
}
</style>
