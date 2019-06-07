<template>
  <div class="createTeacherClass" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/platformClass' }">主讲班</router-link>
        <el-breadcrumb-item>创建班级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="classForm">
      <p>基本信息</p>
      <el-form
        :model="classForm"
        :rules="classRules"
        ref="classForm"
        label-width="160px"
        label-position="top"
        size="mini"
        inline>
        <el-form-item label="课程类型：" prop="course_type">
          <el-select @change="getCourseTypeList()" v-model.trim="classForm.course_type" placeholder="请选择课程类型">
            <el-option v-for="item in courseTypeList" :key="item.id" :label="item.course_type_name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="教学产品：" prop="product_id">-->
        <!--<el-select @change="getProductList('subject')" v-model.trim="classForm.product_id" placeholder="请选择">-->
        <!--<el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="课程名称：" prop="base_class_id">
          <el-select popper-class="visibilityDown" placeholder="请选择课程名称" :disabled="!classForm.course_type" @visible-change="baseClassChange" v-model="classForm.base_class_id">
            <el-option v-for="item in base_class_list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-input @focus="showClassType = true"  v-model.trim="classForm.base_class_id"></el-input> -->
        </el-form-item>
        <el-form-item label="主讲老师：" prop="teacher_id">
          <el-input v-show="false" v-model.trim="classForm.teacher_id"></el-input>
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model.trim="teacher_name"
            :fetch-suggestions="querySearch1"
            placeholder="输选主讲老师或手机号"
            :maxlength="11"
            @select="handleSelect1">
            <i
              class="el-icon-arrow-down el-input__icon"
              slot="suffix"
              @click="handleIconClick1">
            </i>
            <template slot-scope="props">
              <div class="name">{{ props.item.name }}</div>
              <span class="addr">{{ props.item.telephone }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="直播间：" prop="live_room_id">
          <el-input v-show="false" v-model.trim="classForm.live_room_id"></el-input>
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model.trim="liveroom_name"
            :fetch-suggestions="querySearch2"
            placeholder="输选直播间名称"
            @select="handleSelect2">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick2">
            </i>
            <template slot-scope="props">
              <div class="name">{{ props.item.name }}</div>
              <span class="addr">{{ props.item.address }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!--长期班需要配时段-->
        <el-form-item label="时段：" prop="period">
          <template>
            <el-select v-if="!classForm.course_type || classForm.course_type==1" @change="lessonTime()" v-model.trim="classForm.period" placeholder="请选择时间">
              <el-option v-for="item in period_list" :key="item.key" :label="item.start_time+'-'+item.end_time" :value="item.key">
              </el-option>
            </el-select>
            <el-time-picker
              v-else
              is-range
              :clearable="clearable"
              @change="lessonTime()"
              format="HH:mm"
              value-format="HH:mm"
              v-model="classForm.period"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </template>
        </el-form-item>
        <!--只有寒暑才有期数-->
        <el-form-item v-if="classForm.course_type==1&&(classForm.term_id==2||classForm.term_id==4)" label="期数：" prop="number">
          <el-select v-model.trim="classForm.number" placeholder="请选择期数">
            <el-option v-for="item in number_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!--长期班并且原班级有数据必填-->
        <el-form-item
          class="pre_class"
          v-if="classForm.course_type==1&&pre_class_list.length>0"
          label="关联原班级："
          prop="pre_class_id"
        >
          <el-input v-show="false" v-model.trim="classForm.pre_class_id"></el-input>
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model.trim="classForm.pre_class_name"
            :fetch-suggestions="querySearch3"
            placeholder="输选原班级"
            @select="handleSelect3">
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick3">
            </i>
            <template slot-scope="props">
              <div class="name">{{ props.item.class_name }}</div>
            </template>
          </el-autocomplete>
          <!--<el-select v-model.trim="classForm.pre_class_id" placeholder="请选择">-->
          <!--<el-option v-for="item in pre_class_list" :key="item.id" :label="item.class_name" :value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <el-form-item v-if="classForm.course_type==2||classForm.course_type==3" label="班级名称：" prop="class_name">
          <el-input :maxlength="50" v-model.trim="classForm.class_name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="classTable">
      <p style="margin-top:12px;">讲次信息</p>
      <el-table
        :data="course_list"
        style="width: 100%;">
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
        <!-- <el-table-column
          align="center"
          label="上课时间">
          <template slot-scope="scope">
            <div v-if="classForm.period" v-text="start_time+'-'+end_time"></div>
            <div v-if="!classForm.period">请配置时段</div>
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="index"
          label="上课日期">
          <template slot-scope="scope">
            <div class="block" v-if="classForm.period">
              <span>{{time[scope.row.index]}}</span>
              <el-button class="clearfix cac-button-two chooseDateBtn" size="mini" round @click="openDatePicker(scope.$index)">{{time[scope.row.index] ? '修改日期' : '选择日期'}}</el-button>
              <el-date-picker
                :ref="'datePicker' + scope.$index"
				 class="datePicker"
                :picker-options="dateOption"
                value-format="yyyy-MM-dd"
                :clearable="clearable"
                v-model="time[scope.row.index]"
                @change="getTime(scope.row.index,scope.row.lesson_id,time[scope.row.index])"
                type="date"
                :editable="false"
                placeholder="选择日期">
              </el-date-picker>
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
            <div v-if="!classForm.period">请配置时段</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <router-link :to="{ path: '/platformClass' }">
          <el-button type="primary" class="cac-button-two cancel-button cancel_button" size="small" round>取 消</el-button>
        </router-link>
        <el-button type="primary" @click="submitForm('classForm')" class="cac-button-one confirm_button" size="small" round>创 建</el-button>
      </div>
    </div>
    <el-dialog title="筛选课程名称" :visible.sync="showClassType" width="450px">
      <el-form label-width="90px" size="medium">
        <el-form-item label="学科：" prop="subject_id">
          <el-select @change="getProductList('grade')" v-model="classForm.subject_id" placeholder="请选择学科">
            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级：" prop="grade_id">
          <el-select v-if="classForm.course_type==1" @change="getProductList('term')" v-model="classForm.grade_id" placeholder="请选择年级">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <!--如果是短期班，跳过学期和班型-->
          <el-select v-if="classForm.course_type==2||classForm.course_type==3" @change="getProductList('base_class')" v-model="classForm.grade_id" placeholder="请选择年级">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="classForm.course_type==1" label="学期：" prop="term_id">
          <el-select @change="getProductList('level')" v-model="classForm.term_id" placeholder="请选择学期">
            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="classForm.course_type==1" label="班型：" prop="level">
          <el-select @change="getProductList('base_class')" v-model="classForm.level" placeholder="请选择班型">
            <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称：" prop="base_class_id">
          <el-select @change="changeBaseClass()" v-model="classForm.base_class_id" placeholder="请选择课程名称">
            <el-option v-for="item in base_class_list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showClassType = false" class="cac-button-two cancel-button dialog_cancel_button" round>取 消</el-button>
        <el-button type="primary" size="small" @click="selectBaseClass" class="cac-button-one conform-button dialog_confirm_button" round>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import teacherClassApi from '@/services/platform/teacher_class'
  import receptionApi from '@/services/reception'

  export default {
    data () {
      return {
        loading: false,
        start_time: '',
        end_time: '',
        clearable: false,
        showClassType: false,
        productList: [],
        subjectList: [],
        gradeList: [],
        termList: [],
        levelList: [],
        base_class_list: [],
        teacher_name: '',
        teacher_list: [],
        liveroom_name: '',
        liveRoom_list: [],
        course_list: [],
        period_list: [],
        number_list: ['0', '1', '2', '3', '4', '5'],
        pre_class_list: [],
        time: {},
        dateOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        },
        courseTypeList: [],
        classForm: {
          lessons: {},
          course_type: '',
          term_id: ''
        },
        classRules: {
          product_id: [
            {required: true, message: '请选择教学产品', trigger: 'change'}
          ],
          course_type: [
            {required: true, message: '请输入课程类型', trigger: 'change'}
          ],
          teacher_id: [
            {required: true, message: '请输入主讲老师', trigger: 'change'}
          ],
          live_room_id: [
            {required: true, message: '请输入直播间', trigger: 'change'}
          ],
          period: [
            {required: true, message: '请选择时段', trigger: 'change'}
          ],
          number: [
            {required: true, message: '请选择期数', trigger: 'change'}
          ],
          base_class_id: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          class_name: [
            {required: true, message: '请输入班级名称', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    watch: {
      teacher_name: function () {
        if (this.teacher_name === '') {
          this.$set(this.classForm, 'teacher_id', '')
        }
      },
      liveroom_name: function () {
        if (this.liveroom_name === '') {
          this.$set(this.classForm, 'live_room_id', '')
        }
      },
      classForm: {
        handler () {
          if (this.classForm.pre_class_name === '') {
            this.$set(this.classForm, 'pre_class_id', '')
          }
        },
        deep: true
      }
    },
    created () {
      this.getCourseTypeList()
      teacherClassApi.getPeriod().then(res => {
        if (res.ok) {
          this.period_list = res.data
        }
      })
    },
    mounted () {
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/platformClass') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    methods: {
      baseClassChange (val) {
        if (val) {
          this.showClassType = true
          if (!this.classForm.product_id) {
            this.getProductList('product').then(res => {
              this.getProductList('subject')
            })
          }
        }
      },
      selectBaseClass () {
        this.showClassType = false
      },
      getCourseTypeList () {
        receptionApi.getOptionsList().then(res => {
          if (res.ok) {
            this.courseTypeList = res.data.course_types
            // 切换课程类型，表单清空
            this.classForm = {
              course_type: this.classForm.course_type,
              lessons: {}
            }
            this.classForm.lessons = {}
            this.time = {}
            this.pre_class_list = []
            this.teacher_name = ''
            this.liveroom_name = ''
            /* this.getProductList('product').then(res => {
              this.getProductList('subject')
            }) */
          }
        })
      },
      lessonTime () {
        if (this.classForm.course_type !== 1) {
          this.start_time = this.classForm.period[0]
          this.end_time = this.classForm.period[1]
        } else {
          this.period_list.forEach((item, index) => {
            if (this.classForm.period === item.key) {
              this.start_time = item.start_time
              this.end_time = item.end_time
            }
          })
        }
        for (var i in this.classForm.lessons) {
          this.classForm.lessons[i]['start_time'] = this.classForm.lessons[i]['start_time'].split(' ')[0] + ' ' + this.start_time
          this.classForm.lessons[i]['end_time'] = this.classForm.lessons[i]['end_time'].split(' ')[0] + ' ' + this.end_time
        }
      },
      getTime (index, lessonId, time) {
        this.classForm.lessons[index] = {}
        var lessons = this.classForm.lessons[index]
        lessons['index'] = index
        lessons['lesson_id'] = lessonId
        lessons['date'] = time
        lessons['start_time'] = time ? time + ' ' + this.start_time : ''
        lessons['end_time'] = time ? time + ' ' + this.end_time : ''
      },
      // 主讲老师输选
      querySearch1 (queryString, cb) {
        // 模糊搜索
        let params = {
          key: queryString
        }
        teacherClassApi.searchTeacher(params).then(res => {
          if (res.ok) {
            this.teacher_list = res.data
            var teacherList = this.teacher_list
            var results = queryString ? teacherList.filter(this.createFilter1(queryString)) : teacherList
            // 调用 callback 返回建议列表的数据
            cb(results)
          }
        })
      },
      createFilter1 (queryString) {
        return (restaurant) => {
          return (
            restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0 ||
            restaurant.telephone.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
          )
        }
      },
      handleSelect1 (item) {
        console.log(item)
        this.teacher_name = item.name
        this.$set(this.classForm, 'teacher_id', item.id)
      },
      handleIconClick1 (ev) {
        console.log(ev)
      },
      // 直播间输选
      querySearch2 (queryString, cb) {
        let liveData = {
          room_name: queryString,
          type: 1,
          is_active: 1
        }
        teacherClassApi.searchLiveRoom(liveData).then(res => {
          if (res.ok) {
            this.liveRoom_list = res.data
            var liveRoomList = this.liveRoom_list
            var results = queryString ? liveRoomList.filter(this.createFilter2(queryString)) : liveRoomList
            // 调用 callback 返回建议列表的数据
            cb(results)
          }
        })
      },
      createFilter2 (queryString) {
        return (restaurant) => {
          return (
            restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0 ||
            restaurant.address.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
          )
        }
      },
      handleSelect2 (item) {
        this.liveroom_name = item.name
        this.$set(this.classForm, 'live_room_id', item.room_id)
      },
      handleIconClick2 (ev) {
        console.log(ev)
      },
      // 原班级输选
      querySearch3 (queryString, cb) {
        var preClassList = this.pre_class_list
        var results = queryString ? preClassList.filter(this.createFilter3(queryString)) : preClassList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter3 (queryString) {
        return (restaurant) => {
          return (restaurant.class_name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        }
      },
      handleSelect3 (item) {
        console.log(item)
        this.classForm.pre_class_id = item.id
        this.$set(this.classForm, 'pre_class_name', item.class_name)
      },
      handleIconClick3 (ev) {
        console.log(ev)
      },
      loadAll () {
        let params = {
          key: ''
        }
        teacherClassApi.searchTeacher(params).then(res => {
          if (res.ok) {
            this.teacher_list = res.data
          }
        })
        let liveData = {
          room_name: '',
          type: 1,
          is_active: 1
        }
        teacherClassApi.searchLiveRoom(liveData).then(res => {
          if (res.ok) {
            this.liveRoom_list = res.data
          }
        })
      },
      changeBaseClass () {
        // 课程名称变化，讲次清空
        this.classForm.lessons = {}
        this.time = {}
        this.base_class_list.forEach(item => {
          if (item.id === this.classForm.base_class_id) {
            this.$set(this.classForm, 'base_class_name', item.name)
          }
        })

        let params = {
          base_class_id: this.classForm.base_class_id
        }
        // 获取讲次列表
        teacherClassApi.queryCourseList(params).then(res => {
          if (res.ok) {
            this.course_list = res.data
            console.log(this.course_list)
          }
        })
      },
      getProductList (myType) {
        let params = {
          type: myType,
          course_type_id: this.classForm.course_type,
          product_id: this.classForm.product_id,
          subject_id: this.classForm.subject_id,
          grade_id: this.classForm.grade_id,
          term_id: this.classForm.term_id,
          level_id: this.classForm.level
        }
        return teacherClassApi.createClassOption(params).then(res => {
          if (res.ok) {
            switch (myType) {
              case 'product':
                this.productFun(res)
                this.subjectFun(res)
                this.gradeFun(res)
                this.termFun(res)
                this.levelFun(res)
                this.baseClassFun(myType, res)
                break
              case 'subject':
                this.subjectFun(res)
                this.gradeFun(res)
                this.termFun(res)
                this.levelFun(res)
                this.baseClassFun(myType, res)
                break
              case 'grade':
                this.gradeFun(res)
                this.termFun(res)
                this.levelFun(res)
                this.baseClassFun(myType, res)
                break
              case 'term':
                this.termFun(res)
                this.levelFun(res)
                this.baseClassFun(myType, res)
                break
              case 'level':
                this.levelFun(res)
                this.baseClassFun(myType, res)
                break
              case 'base_class':
                this.baseClassFun(myType, res)
                break
            }
          }
        })
      },
      productFun (res) {
        this.productList = res.data
        if (res.data.length > 0) {
          this.classForm.product_id = res.data[0].id
        } else {
          res.data = []
          this.$set(this.classForm, 'product_id', '')
        }
      },
      subjectFun (res) {
        this.subjectList = res.data
        res.data = []
        this.$set(this.classForm, 'subject_id', '')
      },
      gradeFun (res) {
        // 切换教学产品和学科，原班级清空
        this.pre_class_list = []
        this.$set(this.classForm, 'pre_class_id', '')
        this.$set(this.classForm, 'pre_class_name', '')
        // 判断是否有教学产品和学科，来获取原班级列表
        if (this.classForm.product_id && this.classForm.subject_id) {
          var data = {
            product_id: this.classForm.product_id,
            subject_id: this.classForm.subject_id
          }
          // 获取原班级列表
          teacherClassApi.getRelationBaseClass(data).then(res => {
            if (res.ok) {
              // 切换课程类型，表单清空
              this.pre_class_list = res.data
            }
          })
        }
        this.gradeList = res.data
        res.data = []
        this.$set(this.classForm, 'grade_id', '')
      },
      termFun (res) {
        this.termList = res.data
        res.data = []
        this.$set(this.classForm, 'term_id', '')
      },
      levelFun (res) {
        // 学期切换，期数清空
        this.$set(this.classForm, 'number', '')
        this.levelList = res.data
        res.data = []
        this.$set(this.classForm, 'level', '')
      },
      baseClassFun (myType, res) {
        this.course_list = []
        this.base_class_list = res.data
        // 教学产品和课程名称变化，讲次清空
        this.classForm.lessons = {}
        this.time = {}
        // 首次进入课程类型校验报错
        if (myType !== 'product' && myType !== 'subject') {
          this.$set(this.classForm, 'base_class_id', '')
          this.$set(this.classForm, 'base_class_name', '')
        }
      },
      unique2 (array) {
        // 数组去重
        return Array.from(new Set(array))
      },
      openDatePicker (index) {
        this.$refs['datePicker' + index].focus()
      },
      submitForm (formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 每一讲次都需要配置
            var LessonsLength = this.course_list.length
            var formLessonsLength = 0
            var lessonDataList = []
            for (var item in this.classForm.lessons) {
              formLessonsLength++
              lessonDataList.push(this.classForm.lessons[item].date)
            }
            if (formLessonsLength !== LessonsLength) {
              this.$message({
                showClose: true,
                message: '每一讲次上课时间都需要配置哦',
                type: 'warning',
                center: true
              })
              this.loading = false
            } else {
              // 每一讲次日期不能相同
              if (this.unique2(lessonDataList).length !== LessonsLength) {
                this.$message({
                  showClose: true,
                  message: '每一讲次上课日期不可相同',
                  type: 'warning',
                  center: true
                })
                this.loading = false
              } else {
                let params = {}
                params = this.classForm
                /* if (this.classForm.course_type && this.classForm.course_type !== 1) {
                  this.classForm.period = ''
                } */
                teacherClassApi.createClass(params).then(res => {
                  this.loading = false
                  if (res.ok) {
                    console.log('ok')
                    this.$router.back()
                  } else {
                    console.log(this.classForm)
                  }
                })
              }
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
.createTeacherClass{
  text-align: left;
  .classForm,.classTable {
    &>p {
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
  }
  .classForm {
    width: 900px;
    background-color: #fff;
    margin-top: 20px;
    .el-form-item {
      margin-right: 80px;
    }
    .el-form-item__label {
      color: #7A808D;
    }
    .el-form-item__content {
      width: 340px;
    }
    .el-select,.el-input,.el-autocomplete {
      width: 100%;
      height: 50px;
      input {
        height: 50px !important;
      }
    }
    .el-date-editor {
      width: 100%;
      height: 50px;
      .el-range-separator{
        line-height: 42px;
      }
    }
  }
  .block {
    position: relative;
    height: 28px;
    &>span {
      display: inline-block;
      position: absolute;
      left: 50%;
      width: 100px;
      text-align: right;
      margin-left: -160px;
    }
    .chooseDateBtn {
      position: absolute;
      left: 50%;
      background-color: #FFF;
      z-index: 11;
      width: 90px;
      margin-left: -45px;
    }
    .datePicker {
      position: absolute;
      left: 50%;
      width: 20px;
      height: 20px;
      padding: 0;
      i {
        display: none;
      }
      input {
        width: 10px;
        height: 100%;
        border: none !important;
        margin-left: -30px;
      }
    }
  }

  .radiogroup__title {
    color: #606266;
    margin-bottom: 15px;
  }
  .el-dialog {
    .el-form-item {
      height: 50px;
      margin-bottom: 10px;
      .el-form-item__label {
        height: 50px;
        line-height: 50px;
      }
    }
    .el-select,.el-input, input {
      width: 100%;
      height: 50px !important;
      border-radius: 3px;
    }
  }
  .bottom {
    padding-top: 30px;
    .el-button {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
}
</style>
