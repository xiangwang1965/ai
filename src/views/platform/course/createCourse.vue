<template>
  <div class="classroomEditView" id="createCoursePage" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/platformCourse">
        <router-link :to="{ path: source === 'platform'?'/platformCourse':'/course' }">课程</router-link>
        <el-breadcrumb-item v-if="source === 'platform'">{{tabName}}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>创建面授课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="radiogroup">
      <p>基本信息</p>
      <!-- 双师平台课程 -->
      <el-form v-if="source==='platform'" ref="platformCourseForm" :model="platformCourseForm" inline :rules="platformCourseRules" size="mini" label-width="160px" label-position="top">
        <el-form-item class="classNameItem" v-if="type_id!=1" label="课程名称：" prop="base_class_name">
          <el-input style="width: 600px" :maxlength="30" v-model.trim="platformCourseForm.base_class_name"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="年份：" prop="year">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.year" placeholder="请选择">
            <el-option v-for="item in optionsData.years" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科：" prop="subject_id">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.subject_id" placeholder="请选择">
            <el-option v-for="item in optionsData.subjects" :key="item.subject_id" :label="item.subject_name" :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级：" prop="grade_id">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.grade_id" placeholder="请选择">
            <el-option v-for="item in optionsData.grade" :key="item.grade_id" :label="item.grade_name" :value="item.grade_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type_id==1" label="学期：" prop="term_id">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.term_id" placeholder="请选择">
            <el-option v-for="item in optionsData.terms" :key="item.term_id" :label="item.term_name" :value="item.term_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type_id==1" label="班型：" prop="class_level">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.class_level" placeholder="请选择">
            <el-option v-for="item in optionsData.levels" :key="item.class_level_id" :label="item.class_level_name" :value="item.class_level_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type_id==1" label="版本：" prop="edition_id">
          <el-select @change="getCourseName" no-data-text="请先选择教学产品" v-model.trim="platformCourseForm.edition_id" placeholder="请选择">
            <el-option v-for="item in optionsData.editions" :key="item.edition_id" :label="item.edition_name" :value="item.edition_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type_id==1" label="课程名称预览：" prop="base_class_name">
          <el-input style="width: 600px" disabled v-model.trim="platformCourseForm.base_class_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 教务中心课程 -->
      <el-form v-if="source==='course'" class="courseForm" ref="courseForm" :model="courseForm" :rules="courseRules" label-position="top" inline size="mini">
        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model.trim="courseForm.courseType" placeholder="请选择课程类型">
            <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.course_type_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="termId">
          <el-select v-model.trim="courseForm.termId" @visible-change="getTermList" placeholder="请选择学期">
            <el-option v-for="term in termList" :key="term.termId" :value="term.termId" :label="term.termName"></el-option>
          </el-select>
          <el-button class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('term')">新增学期</el-button>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId">
          <el-select v-model.trim="courseForm.subjectId" @visible-change="getOptionsList" placeholder="请选择学科">
            <el-option v-for="subject in subjectList" :key="subject.subject_id" :value="subject.subject_id" :label="subject.subject_name"></el-option>
          </el-select>
          <el-button class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('subject')">新增学科</el-button>
        </el-form-item>
        <el-form-item label="班型" prop="classLevel">
          <el-select v-model.trim="courseForm.classLevel" @visible-change="getOptionsList" placeholder="请选择班型">
            <el-option v-for="classLevel in classLevelList" :key="classLevel.class_level_id" :value="classLevel.class_level_id" :label="classLevel.class_level_name"></el-option>
          </el-select>
          <el-button class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('classLevel')">新增班型</el-button>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model.trim="courseForm.gradeId" @visible-change="getOptionsList" placeholder="请选择年级">
            <el-option v-for="grade in gradeList" :key="grade.grade_id" :value="grade.grade_id" :label="grade.grade_name"></el-option>
          </el-select>
          <el-button class="cac-button-two" icon="el-icon-plus" size="mini" round @click="viewAddDialog('grade')">新增年级</el-button>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model.trim="courseForm.courseName" placeholder="请输入课程名称" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="适用校区" class="full_item" prop="isAllCampus">
          <el-radio-group v-model="courseForm.isAllCampus" @change="changeCampusArea">
            <el-radio :label="0">全部校区</el-radio>
            <el-radio :label="1">指定校区</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="courseForm.isAllCampus === 1" v-model="formCampusList">
            <el-checkbox v-for="campus in campusList" v-if="campus.is_active" :key="campus.id" :label="campus.id" :value="campus.id">{{campus.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div class="chargeStandard" v-if="isCharge >= 0 && false">
          <p>收费标准</p>
          <el-form-item label="收费模式" class="charge_method" prop="charge_method">
            <selectInputChargetype @change="selectChargeMethod"></selectInputChargetype>
          </el-form-item>
          <el-form-item label="收费标准" class="charge_standard" prop="amount">
            <InputNumber v-model="courseForm.amount" :min="0" :isFloat="true" :width="'340px'" :height="'50px'"></InputNumber><span style="margin-left: 5px;">元/人</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog class="addLessonDialog tipDialog" :title="addDialogConfig.title" top="38vh" width="560px" append-to-body @open="dialogOpen" :visible.sync="addDialogConfig.visible">
      <el-input style="width:300px;" :maxlength="8" :placeholder="addDialogConfig.placeholder" v-model.trim="addDialogConfig.value"></el-input>
      <div slot="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="addDialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="addDialogDone">创 建</el-button>
      </div>
    </el-dialog>
    <div class="bottom">
      <router-link :to="{ path: source === 'platform'?'/platformCourse':'/course' }">
        <el-button type="primary" size="small" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      </router-link>
      <el-button type="primary" size="small" class="cac-button-one" round @click="submitForm">创 建</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/services/platform/course'
import staffApi from '@/services/internal/staff'
import authUtil from '@/services/auth/utils'
import receptionApi from '@/services/reception'
import selectInputChargetype from '@/components/selectInputChargetype'
import InputNumber from '@/components/inputNumber'
export default {
  props: ['source'],
  data () {
    return {
      loading: false,
      tabName: '',
      useList: [
        {
          name: '通用',
          value: 1
        },
        {
          name: '双师',
          value: 2
        },
        {
          name: '面授',
          value: 3
        }
      ],
      productList: [],
      optionsData: {
        years: [],
        subjects: [],
        grade: [],
        terms: [],
        levels: [],
        editions: []
      },
      type_id: Number(this.$route.query.type_id),
      platformCourseForm: {
        base_class_name: '',
        product_id: '',
        year: '',
        type_id: '',
        subject_id: '',
        grade_id: '',
        term_id: '',
        edition_id: '',
        class_level: '',
        step_list: []
      },
      courseForm: {
        courseType: '',
        termId: '',
        subjectId: '',
        classLevel: '',
        gradeId: '',
        courseName: '',
        isAllCampus: 0,
        charge_method: 1,
        amount: ''
      },
      platformCourseRules: {
        base_class_name: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请选择年份', trigger: 'change' }
        ],
        subject_id: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        grade_id: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        term_id: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        class_level: [
          { required: true, message: '请选择班型', trigger: 'change' }
        ],
        edition_id: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ]
      },
      courseRules: {
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        termId: [
          { required: false, message: '请选择学期', trigger: 'change' }
        ],
        subjectId: [
          { required: false, message: '请选择学科', trigger: 'change' }
        ],
        classLevel: [
          { required: false, message: '请选择班型', trigger: 'change' }
        ],
        gradeId: [
          { required: false, message: '请选择年级', trigger: 'change' }
        ],
        courseName: [
          { max: 30, required: true, message: '请输入课程名称（30字以内）', trigger: 'change' }
        ],
        isAllCampus: [
          { required: true, message: '请选择适用校区', trigger: 'change' }
        ],
        charge_method: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请选择收费模式', trigger: 'change' }
        ],
        amount: [
          { required: this.isCharge >= 0 ? 'true' : 'false', message: '请输入收费标准', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      teaching_method_modifiable: false,
      schoolId: '',
      courseTypeList: [],
      termList: [],
      subjectList: [],
      classLevelList: [],
      gradeList: [],
      campusList: [],
      formCampusList: [],
      addDialogConfig: {
        title: '',
        visible: false,
        type: '',
        placeholder: '',
        value: ''
      },
      isCharge: authUtil.getUser().permissions.indexOf('enroll_charge')
    }
  },
  components: {
    selectInputChargetype,
    InputNumber
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/platformCourse' || to.path === '/course') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  created () {
    if (this.type_id === 1) {
      this.tabName = '创建长期班'
    } else if (this.type_id === 2) {
      this.tabName = '创建短期班'
    } else if (this.type_id === 3) {
      this.tabName = '创建体验课'
    }
    this.getProductList()
    this.getOptionsList()
    this.getCampusList()
    // 默认用途为通用，且不可修改
    this.platformCourseForm.use = 2
  },
  mounted () {
    this.schoolId = authUtil.getUser().school_id
  },
  methods: {
    getCourseName () {
      if (
        this.type_id === 1 && this.platformCourseForm.year !== '' && this.platformCourseForm.subject_id !== '' && this.platformCourseForm.grade_id !== '' && this.platformCourseForm.term_id !== '' && this.platformCourseForm.class_level !== '' && this.platformCourseForm.edition_id !== ''
      ) {
        let params = {
          year: this.platformCourseForm.year,
          subject_id: this.platformCourseForm.subject_id,
          product_id: this.platformCourseForm.product_id,
          grade_id: this.platformCourseForm.grade_id,
          term_id: this.platformCourseForm.term_id,
          class_level_id: this.platformCourseForm.class_level,
          edition_id: this.platformCourseForm.edition_id
        }
        courseApi.getCourseName(params).then(res => {
          if (res.ok) {
            this.$set(this.platformCourseForm, 'base_class_name', res.data)
          }
        })
      }
    },
    getProductList () {
      if (this.source === 'platform') {
        let params = {
          detail: 0
        }
        courseApi.getProductList(params).then(res => {
          if (res.ok) {
            this.productList = res.data
            this.platformCourseForm.product_id = res.data[0] ? res.data[0].id : 0
            this.getCourseOptions()
          }
        })
      }
    },
    getCourseOptions () {
      let params = {
        product_id: this.platformCourseForm.product_id,
        course_type_id: this.type_id
      }
      courseApi.courseOptions(params).then(res => {
        if (res.ok) {
          this.optionsData = res.data
          var grade = []
          for (var gradeGroup in res.data.grade) {
            res.data.grade[gradeGroup].forEach(item => {
              grade.push(item)
            })
          }
          this.optionsData.grade = grade
        }
      })
    },
    getCourseType () {
      courseApi.courseType().then(res => {
        this.courseTypeList = res
        this.getCampusList()
      })
    },
    getOptionsList () {
      let params = {
        type: 3 // 获取面授对应项
      }
      receptionApi.getOptionsList(params).then(res => {
        this.courseTypeList = res.data.course_types
        this.classLevelList = res.data.class_type
        this.gradeList = res.data.grade
        this.subjectList = res.data.subject
      })
    },
    getTermList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getTermList(params).then(res => {
        this.termList = res
      })
    },
    getSubjectList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getSubjectList(params).then(res => {
        this.subjectList = res
      })
    },
    getClassLevelList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getClassLevelList(params).then(res => {
        this.classLevelList = res
      })
    },
    getGradeList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getGradeList(params).then(res => {
        this.gradeList = res
      })
    },
    viewAddDialog (type) {
      this.addDialogConfig.placeholder = '请输入8个字符以内'
      this.addDialogConfig.type = type
      switch (type) {
        case 'term':
          this.addDialogConfig.title = '新增学期'
          break
        case 'subject':
          this.addDialogConfig.title = '新增学科'
          break
        case 'grade':
          this.addDialogConfig.title = '新增年级'
          break
        case 'classLevel':
          this.addDialogConfig.title = '新增班型'
          break
        default:
          this.addDialogConfig.title = '新增'
      }
      this.addDialogConfig.visible = true
    },
    dialogOpen () {
      this.addDialogConfig.value = ''
    },
    addDialogDone () {
      let params = {}
      params.school_id = this.schoolId
      let type = this.addDialogConfig.type
      if (type === 'classLevel' || type === 'classType') {
        type = 'class_type'
        this.addDialogConfig.type = 'classType'
      }
      params[type + '_name'] = this.addDialogConfig.value
      courseApi[this.addDialogConfig.type + 'Add'](params).then(res => {
        if (res.ok) {
          this.addDialogConfig.value = ''
          this.addDialogConfig.visible = false
        }
      })
    },
    getCampusList () {
      let params = {
        status: 1
      }
      params.school_id = this.schoolId
      staffApi.getCampusList(params).then(res => {
        this.campusList = res
      })
    },
    changeCampusArea () {
      this.formCampusList = []
    },
    selectChargeMethod (val) {
      this.courseForm.charge_method = val
    },
    submitForm () {
      this.loading = true
      let formName = this.source === 'platform' ? 'platformCourseForm' : 'courseForm'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          if (this.source === 'platform') {
            params.base_class_name = this.platformCourseForm.base_class_name
            params.product_id = this.platformCourseForm.product_id
            params.year = this.platformCourseForm.year
            params.type_id = this.type_id
            params.subject_id = this.platformCourseForm.subject_id
            params.grade_id = this.platformCourseForm.grade_id
            params.term_id = this.platformCourseForm.term_id
            params.edition_id = this.platformCourseForm.edition_id
            params.class_level = this.platformCourseForm.class_level
            params.use = this.platformCourseForm.use
            params.step_list = []
            courseApi.createCourse(params).then(res => {
              this.loading = false
              if (res.ok) {
                this.$router.back()
              }
            })
          }
          if (this.source === 'course') {
            params.course_type_id = this.courseForm.courseType
            params.term_id = this.courseForm.termId
            params.subject_id = this.courseForm.subjectId
            params.class_type_id = this.courseForm.classLevel
            params.grade_id = this.courseForm.gradeId
            params.base_class_name = this.courseForm.courseName
            params.campus_id = this.courseForm.isAllCampus
            params.school_id = this.schoolId
            params.amount = this.courseForm.amount
            params.charge_method = this.courseForm.charge_method
            if (this.courseForm.isAllCampus === 1) {
              if (this.formCampusList.length === 0) {
                this.$message({
                  message: '请至少选择一个指定校区',
                  type: 'warning',
                  center: true
                })
                this.loading = false
                return
              }
              params.campus_id = this.formCampusList.join(',')
            }
            courseApi.createFaceCourse(params).then(res => {
              this.loading = false
              if (res.ok) {
                this.$router.back()
              }
            })
          }
        } else {
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.classroomEditView {
  text-align: left;
  .radiogroup {
    text-align: left;
    background-color: #fff;
    padding: 10px 0;
    margin-top: 20px;
    & > p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin-bottom: 30px;
    }
    .el-form {
      width: 1100px;
      .el-form-item {
        width: 340px;
        .el-form-item__label {
          color: #7a808d;
        }
        .el-select {
          width: 340px;
        }
        input {
          height: 50px;
          width: 340px;
        }
      }
      .el-form-item:nth-of-type(odd) {
        margin-right: 80px;
      }
      .classNameItem {
        width: 600px;
        input {
          width: 600px;
        }
      }
      .full_item {
        width: 100% !important;
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }
      .el-checkbox {
        margin-right: 30px;
      }
      .chargeStandard {
        display: block;
        width: 100%;
        &>p {
          font-size: 20px;
          font-weight: bold;
          height: 28px;
          line-height: 28px;
          margin-bottom: 30px;
        }
        .el-form-item {
          display: block;
          .el-form-item__label {
            display: block;
            height: 40px;
            line-height: 40px;
            margin-right: 5px;
          }
          .el-form-item__content {
            .el-select, .el-input {
              width: 340px;
              & > input {
                width: 340px;
              }
            }
          }
        }
        .charge_standard {
          input {
            text-align: right;
          }
        }
      }
    }
    .courseForm {
      .el-form-item {
        width: 480px;
        .el-button {
          margin-left: 20px;
        }
      }
    }
  }
  .bottom {
    .el-button {
      width: 110px;
    }
  }
}
</style>
