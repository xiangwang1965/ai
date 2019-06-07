<template>
  <div class="schedulelesson">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/prepareLesson' }">我的主辅备课</router-link>
        <el-breadcrumb-item class="cac-bread">排课</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="scheduleContent">
      <p>基本信息</p>
      <div class="attentionText"><i class="el-icon-warning"></i><span>时间冲突或直播间冲突无法排课的辅导老师，在辅导端app可以观看主辅备课回放</span></div>
      <div class="lessonName">
        {{formData.class_name}}
      </div>
      <el-form :data="formData" ref="prepareForm" :model="formData" :rules="formDataRules" label-position="top">
        <div class="left">
          <el-form-item class="classroomSelect" label="教室" prop="live_room_id">
            <el-select v-model="formData.live_room_id" placeholder="请选择教室" @change="getRoomId">
              <el-option v-for="classroom in classroomList" :key="classroom.room_id" :value="classroom.room_id" :label="classroom.name"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item class="campusSelect" label="校区" prop="campus_id">
            <el-select v-model="formData.campus_id" placeholder="请选择校区">
              <el-option v-for="campus in campusList" :key="campus.key" :value="campus.key" :label="campus.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="辅导老师" prop="teacher_id">
          <el-radio-group v-model="formData.teacher_id" @change="selectTeacher">
            <el-radio v-for="teacher in formData.ass_teachers" :key="teacher.id" :value="teacher.id" :label="teacher.id">{{teacher.name}}</el-radio>
          </el-radio-group>
          <!-- <el-tag
            class="teacherTag"
            v-for="teacher in teacherList"
            :key="teacher.id"
            type="info">
            {{teacher.name}}
          </el-tag> -->
          <!-- <el-button type="primary" size="small" round class="addTeacherBtn" icon="el-icon-plus">添加</el-button> -->
        </el-form-item>
      </el-form>
      <p style="margin-bottom:20px;">讲次信息</p>
      <el-table :data="formData.lessons">
        <el-table-column prop="index" label="讲次"></el-table-column>
        <el-table-column prop="lesson_name" label="讲次名称"></el-table-column>
        <el-table-column prop="lesson_time" label="上课日期"></el-table-column>
      </el-table>
    </div>
    <div class="manageWraper">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button cancel_button" round @click="cancel">取消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button confirm_button" round @click="scheduleLesson">{{formData.class_status ? '确定' : '创建'}}</el-button>
    </div>
  </div>
</template>
<script>
import classroomApi from '@/services/classroom'
import preparelessonApi from '@/services/preparelesson'
export default {
  data () {
    return {
      formData: {
        live_room_id: '',
        campus_id: '',
        teacher_id: ''
      },
      formDataRules: {
        live_room_id: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ],
        campus_id: [
          { required: true, message: '请选择校区', trigger: 'change' }
        ],
        teacher_id: [
          { required: true, message: '请至少选择一个辅导老师', trigger: 'change' }
        ]
      },
      lessons: [],
      classroomList: [],
      campusList: [],
      teacherList: []
    }
  },
  computed: {
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/prepareLesson') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  created () {
    this.formData = JSON.parse(sessionStorage.getItem('prepareDetail'))
    if (this.formData.campus_id === 0) {
      this.formData.campus_id = ''
    }
    if (this.formData.live_room_id === 0) {
      this.formData.live_room_id = ''
    }
    this.formData.live_class_id = this.$route.query.id
    this.formData.teacher_id = this.formData.ass_teacher_id || ''
    if (this.formData.ass_teacher_id) {
      this.formData.ass_teachers.forEach(item => {
        if (item.id === this.formData.ass_teacher_id) {
          this.formData.vd_teacher_id = item.vd_id
        }
      })
    }
    this.getSubjectOption()
    this.getLiveRoom()
  },
  methods: {
    // 获取所有下拉条件
    getSubjectOption () {
      // 校区
      let params = { 'class_id': this.$route.query.id || null }
      classroomApi.queryClassOption(params).then(res => {
        if (res.ok) {
          this.campusList = res.data.options.campus
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
          this.classroomList = res.data.list
        }
      })
    },
    // 选择教室获取微度id
    getRoomId (id) {
      this.classroomList.forEach(item => {
        if (item.room_id === id) {
          this.formData.vd_room_id = item.vd_id
        }
      })
    },
    selectTeacher (id) {
      this.formData.ass_teachers.forEach(item => {
        if (item.id === id) {
          this.formData.vd_teacher_id = item.vd_id
        }
      })
    },
    scheduleLesson () {
      this.$refs.prepareForm.validate((valid) => {
        if (valid) {
          let params = this.formData
          params.detail_code = this.detail_code
          this.fullscreenLoading = true
          if (!this.formData.class_status) {
            preparelessonApi.scheduleLesson(params).then(res => {
              if (res.ok) {
                this.$router.back()
              }
              this.fullscreenLoading = false
            })
          } else {
            preparelessonApi.modifyScheduleLesson(params).then(res => {
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
    cancel () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less">
.schedulelesson {
  text-align: left;
  .scheduleContent {
    margin-bottom: 30px;
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-top: 30px;
    }
    .attentionText {
      color: #FF8D41;
      background-color: #fff9f4;
      height: 36px;
      line-height: 36px;
      margin-top: 10px;
      margin-bottom: 30px;
      padding: 0 10px;
      i {
        margin-right: 5px;
      }
    }
    .lessonName {
      height: 25px;
      line-height: 25px;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 30px;
    }
    .el-form {
      .left, .right {
        display: inline-block;
        width: 340px;
        margin-bottom: 10px;
        .el-select, .el-input, input {
          width: 100%;
          height: 50px;
        }
      }
      .left {
        margin-right: 60px;
      }
      .el-form-item {
        margin-bottom: 15px;
        .el-form-item__label {
          padding: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
