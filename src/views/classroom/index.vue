<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{source === 'platform' ? '主讲班' : '班级管理'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{name: source === 'platform' ? 'platformCreateClass' : 'createClass', query: {create: 'create', is_teach: is_teach,is_live: is_live}}">
        <el-button type="primary" class="clearfix cac-button-one create-button create-class" size="small" round icon="el-icon-plus">创建班级</el-button>
      </router-link>
      <div class="nonDivision" v-if="nonDivisionPageConfig.total !== 0 && source !== 'platform'" @click="openNonDivisionDialog">已报课程未分班<span>{{nonDivisionPageConfig.totalNum}}</span>人</div>
    </div>
    <div class="selectRow" v-if="source !== 'platform'">
      <!-- <el-select
        class="selectRow__select"
        v-model="params.subject_id"
        placeholder="学科"
        size="small"
        clearable>
        <el-option v-for="item in optionSubject" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="params.grade_id"
        placeholder="年级"
        size="small"
        clearable>
        <el-option v-for="item in optionGrade" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="params.level"
        placeholder="班型"
        size="small"
        clearable
        filterable>
        <el-option v-for="item in optionLevel" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="params.term_id"
        placeholder="学期"
        size="small"
        clearable>
        <el-option v-for="item in optionSemester" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select> -->
      <el-select
        class="selectRow__select"
        v-model="params.status"
        placeholder="班级状态"
        size="small"
        clearable>
        <el-option v-for="item in optionClassStatus" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="params.campus_id"
        placeholder="校区"
        size="small"
        clearable
        filterable>
        <el-option v-for="item in optionCampus" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button style="vertical-align:top;" type="primary" class="cac-button-one spc_filter" size="small" round @click="getList">筛选</el-button>
      <el-input
        class="searchRow__input"
        v-model="params.search"
        @keyup.enter.native="getList"
        placeholder="请输入班级名称"
        size="small"
        round>
        <i slot="suffix" class="el-icon-search el-input__icon" @click="getList"></i>
      </el-input>
      <!--<el-select v-if="is_live&&is_teach" v-model="params.class_type" placeholder="班级类型" class="selectRow__select">-->
        <!--<el-option v-for="item in optionClasstype" :key="item.key" :label="item.value" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData.list"
        size="mini"
        v-if="source === 'platform'">
        <!-- <el-table-column align="center" label="班级ID" width="70" prop="class_code"></el-table-column> -->
        <el-table-column align="left" label="班级名称" prop="class_name" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" label="班级类型" prop="level_name" show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" label="学科" prop="subject_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="年级" prop="grade_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="主讲老师" prop="teacher_name" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" label="课程起止日期" width="260" prop="start_time" :formatter="endTime"></el-table-column> -->
        <!-- <el-table-column align="center" label="校区" prop="campus_name" show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" label="班级状态" prop="status_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
              <router-link style="color:blue;margin-right:10px;" :to="{name: source === 'teaching' ? 'teachingClassDetail' : 'platformClassDetail', query: { class_id: scope.row.live_class_id || scope.row.id, class_type: scope.row.class_type }}">
                <el-button class="clearfix cac-button-two manage-button" size="mini" round>详情</el-button>
              </router-link>
            <!-- <el-tooltip content="详情" placement="top" :open-delay="500">
              <i class="el-icon-view cac-icon-button" @click="handleDetail(scope.$index, scope.row)"></i>
              <i class="el-icon-view cac-icon-button cac-icon-disabled"></i>
            </el-tooltip> -->
            <!-- <el-tooltip content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit cac-icon-button" @click="handleEdit(scope.$index, scope.row)" v-if="!(scope.row.status===3)"></i>
              <i class="el-icon-edit cac-icon-button cac-icon-disabled" v-if="scope.row.status===3"></i>
            </el-tooltip> -->
            <!-- <el-tooltip content="添加学生" placement="top" :open-delay="500">
              <i class="el-icon-circle-plus cac-icon-button" @click="handleAddStudent(scope.$index, scope.row)" v-if="!(scope.row.status===3)"></i>
              <i class="el-icon-circle-plus cac-icon-button cac-icon-disabled" v-if="scope.row.status===3"></i>
            </el-tooltip> -->
              <el-button class="clearfix cac-button-two manage-button" size="mini" :disabled="scope.row.is_deletable==0 || scope.row.status==3 || scope.row.status==4 || scope.row.status==2" round @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!-- <el-tooltip content="删除" placement="top" :open-delay="500">
              <i class="el-icon-delete cac-icon-button" @click="handleDelete(scope.$index, scope.row)" v-if="!(params.class_type===2||scope.row.status===3||scope.row.status===2)"></i>
              <i class="el-icon-delete cac-icon-button cac-icon-disabled" v-if="params.class_type===2||scope.row.status===3||scope.row.status===2"></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData.list"
        size="mini"
        v-if="source === 'teaching'">
        <el-table-column align="left" label="班级名称" prop="class_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="校区" prop="campus_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="教室" prop="room_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="授课教师" prop="teacher_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="预招学员" prop="advance_student_num" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="当前学员" prop="scene_student_num" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="班级状态" prop="status_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="350" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link style="color:blue;margin-right:10px;" :to="{name: source === 'teaching' ? 'teachingClassDetail' : 'platformClassDetail', query: { class_id: scope.row.class_id || scope.row.id, class_type: scope.row.class_type }}">
              <el-button class="clearfix cac-button-two manage-button" size="mini" round>详情</el-button>
            </router-link>
            <el-button class="clearfix cac-button-two manage-button" size="mini" :disabled="scope.row.scene_class_status===3 || scope.row.scene_class_status===4" round @click="handleAddStudent(scope.$index, scope.row)">添加学生</el-button>
            <el-button class="clearfix cac-button-two manage-button" size="mini" :disabled="scope.row.scene_class_status===3 || scope.row.scene_class_status===4" round @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button class="clearfix cac-button-two manage-button" size="mini" :disabled="scope.row.scene_class_status===3 || scope.row.scene_class_status===2" round @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="{ page: params.page, per_page: params.page_size, total: tableData.total }" @change="getList"></pagination>
    </div>
    <addSingleStudentDialog v-if="isCharge >= 0 && false" ref="addStudentDialog" :config="addStudentConfig" :classId="class_id" @select="addSingleStudentDone"></addSingleStudentDialog>
    <addStudentDialog v-else ref="addStudentDialog" :config="addStudentConfig" @close="addStudentDone" :class_name="class_name" :class_id="class_id"></addStudentDialog>
    <!-- <el-dialog class="add__student" title="添加学生" :visible.sync="dialogTableVisible" width="950px" top="5vh">
      <AddStudent :class_name="this.class_name" :class_id="this.class_id" :class_type="class_type" v-on:close="doClose"></AddStudent>
    </el-dialog> -->
    <el-dialog class="nonDivisionDialog" title="未分班学生" width="1050px" style="height:100%;" :visible.sync="nonDivisionConfig.visible">
      <div>
        <el-select
          v-model="nonDivisionPageConfig.campus_id"
          placeholder="校区"
          size="small"
          clearable
          filterable>
          <el-option v-for="item in optionCampus" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" style="vertical-align:top;" class="cac-button-one spc_filter" size="small" round @click="doSelect">筛选</el-button>
        <el-input
          v-model="nonDivisionPageConfig.key"
          @keyup.enter.native="getNonDivisionList"
          placeholder="请输入姓名、手机号、课程名称"
          size="small"
          style="width:300px;float:right;"
          round>
          <i slot="suffix" class="el-icon-search el-input__icon" @click="doSelect"></i>
        </el-input>
      </div>
      <el-table :data="nonDivisionList" row-class-name="listTr" v-loading="dialogLoading">
        <el-table-column align="left" prop="name" label="姓名" width="270" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="telephone" width="120" label="手机号"></el-table-column>
        <el-table-column align="center" prop="campus_name" label="所属校区" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="" label="课程名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.course_name || '无'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="nonDivisionPageConfig" @change="getNonDivisionList"></pagination>
      <div slot="footer" class="footer">
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="cancel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import teacherClassApi from '@/services/platform/teacher_class'
import studentApi from '@/services/student'
import authUtils from '@/services/auth/utils'
import eventHub from '@/utils/eventHub'
import pagination from '@/components/pagination'
import staffApi from '@/services/internal/staff'
import addStudentDialog from '@/components/reception/addStudentDialog'
import addSingleStudentDialog from '@/components/reception/addSingleStudentDialog'
import { requireAgainPage } from '@/utils'
export default {
  props: [ 'source' ],
  data () {
    return {
      loading: false,
      dialogLoading: false,
      tableData: {
        list: [],
        total: 0
      },
      params: {
        status: '',
        level: '',
        grade_id: '',
        subject_id: '',
        term_id: '',
        campus_id: '',
        search: '',
        class_type: 2,
        page: Number(this.$route.query.page) || 1,
        page_size: 8,
        mute: true,
        target: 'tableWrapper'
      },
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      addStudentConfig: {
        visible: false
      },
      optionClassStatus: [
        {
          key: 1,
          value: '未开课'
        }, {
          key: 2,
          value: '已开课'
        }, {
          key: 3,
          value: '已结课'
        }
      ],
      optionLevel: [],
      optionGrade: [],
      optionSubject: [],
      optionSemester: [],
      optionCampus: [],
      optionClasstype: [],
      dialogTableVisible: false,
      class_id: 0,
      class_name: '',
      class_type: '',
      is_teach: 0,
      is_live: 1,
      nonDivisionList: [],
      nonDivisionConfig: {
        visible: false
      },
      nonDivisionPageConfig: {
        page: 1,
        per_page: 8,
        total: 0,
        totalNum: 0,
        key: '',
        campus_id: ''
      },
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge')
    }
  },
  components: {
    pagination,
    addStudentDialog,
    addSingleStudentDialog
  },
  created () {
    this.getOption()
    eventHub.$on('updateUser', this.getUser)
    this.getUser()
    this.getNonDivisionList()
  },
  methods: {
    getUser () {
      this.is_teach = authUtils.getUser() && Number(authUtils.getUser().is_teach)
      this.is_live = authUtils.getUser() && Number(authUtils.getUser().is_live)
      // 如果没有面授的权限，默认类型为 面授1 只要有面授，就默认展示面授
      // this.params.class_type = this.is_teach === 0 ? 2 : 1
      this.params.class_type = 2
      this.getList()
    },
    // 格式化年级学科
    subject (row, column) {
      return row.grade_name + '/' + row.subject_name
    },
    // 格式化起止日期
    endTime (row, column) {
      return row.start_time.split(' ')[0] + '至' + row.end_time.split(' ')[0]
    },
    // 获取所有筛选条件
    getOption () {
      classroomApi.queryClassOption().then(res => {
        if (res.ok) {
          let list = []
          res.data.options.status.map((v, i) => {
            if (this.source === 'platform') {
              if (v.key !== 4) {
                list.push(v)
              }
            } else {
              list.push(v)
            }
          })
          this.optionLevel = res.data.options.level
          this.optionGrade = res.data.options.grade
          this.optionSubject = res.data.options.subject
          this.optionSemester = res.data.options.term
          this.optionClasstype = res.data.options.class_type
        }
      })
      staffApi.getCampusList({status: 1}).then(res => {
        this.optionCampus = res
      })
    },
    getNonDivisionList (index) {
      let params = {
        page: index && typeof index === 'number' ? index : this.nonDivisionPageConfig.page,
        per_page: this.nonDivisionPageConfig.per_page,
        school_id: authUtils.getUser().school_id,
        brand: 1
      }
      if (this.nonDivisionPageConfig.key) {
        params.key = this.nonDivisionPageConfig.key
      }
      if (this.nonDivisionPageConfig.campus_id) {
        params.campus_id = this.nonDivisionPageConfig.campus_id
      }
      this.dialogLoading = true
      studentApi.getStudentList(params).then(res => {
        this.dialogLoading = false
        this.nonDivisionList = res.data.list
        this.nonDivisionPageConfig.total = res.data.total_count
        this.nonDivisionPageConfig.totalNum = res.data.total
        if (requireAgainPage(this.nonDivisionPageConfig) > 0) {
          this.nonDivisionPageConfig.page = requireAgainPage(this.nonDivisionPageConfig)
          this.getNonDivisionList()
        }
      })
    },
    openNonDivisionDialog () {
      this.nonDivisionPageConfig.key = ''
      this.nonDivisionPageConfig.campus_id = ''
      this.nonDivisionConfig.visible = true
      this.getNonDivisionList()
    },
    cancel () {
      this.nonDivisionConfig.visible = false
    },
    addStudentDone (status) {
      if (status === 'success') {
        this.getList(1)
      }
    },
    // 开放报名缴费机构只能添加单个学生，关闭弹框进入缴费页面
    addSingleStudentDone (val) {
      if (this.source === 'platform') {
        this.$router.push({name: 'addStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.class_id}})
      } else {
        this.$router.push({name: 'addClassStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.class_id}})
      }
    },
    // 获取用户列表
    getList (index) {
      this.params.page = index && typeof index === 'number' ? index : this.params.page
      this.loading = true
      if (this.source === 'platform') {
        this.params.per_page = this.params.page_size
        teacherClassApi.ClassList(this.params).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.ok) {
            res.data.data.map((v, index) => {
              let status = v.scene_class_status || v.status
              switch (status * 1) {
                case 1:
                  v.status_name = '未开课'
                  break
                case 2:
                  v.status_name = '已开课'
                  break
                case 3:
                  v.status_name = '已结课'
                  break
                case 4:
                  v.status_name = '已关班'
                  break
                default:
                  v.status_name = '未开课'
              }
            })
            this.tableData.list = res.data.data
            this.tableData.total = res.data.total_count || res.data.total
            let num = requireAgainPage({page: this.params.page, per_page: this.params.page_size, total: this.tableData.total})
            if (num > 0) {
              this.getList(num)
            }
          }
        })
      } else {
        let params = {
          page: this.params.page,
          per_page: 8,
          key: this.params.search,
          campus_id: this.params.campus_id,
          status: this.params.status
        }
        classroomApi.faceClassList(params).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.status_code === 200) {
            res.data.list.map((v, index) => {
              switch (v.scene_class_status) {
                case 1:
                  v.status_name = '未开课'
                  break
                case 2:
                  v.status_name = '已开课'
                  break
                case 3:
                  v.status_name = '已结课'
                  break
                case 4:
                  v.status_name = '已关班'
                  break
                default:
                  v.status_name = '未开课'
              }
            })
            this.tableData.list = res.data.list
            this.tableData.total = res.data.total_count
            let num = requireAgainPage({page: this.params.page, per_page: this.params.page_size, total: this.tableData.total})
            if (num > 0) {
              this.getList(num)
            }
          }
        })
      }
    },
    // 删除
    handleDelete (index, row) {
      this.$confirm('班级删除后，将不可再上课，请再次确认是否删除？', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        let params = {
          'class_id': row.class_id || row.id
        }
        if (this.source === 'platform') {
          teacherClassApi.deleteClass(params).then(res => {
            if (res.ok) {
              this.tableData.list.splice(index, 1)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
            }
          })
        } else {
          classroomApi.deleteFaceClass(params).then(res => {
            if (res.status_code === 200) {
              this.tableData.list.splice(index, 1)
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功',
                center: true
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    // 编辑
    handleEdit (index, row) {
      this.$router.push({ name: 'createClass', query: { create: 'edit', id: row.class_id || row.id, type: row.class_type } })
    },
    // 详情
    handleDetail (index, row) {
      this.$router.push({ name: 'classDetail', query: { class_id: row.class_id || row.id, class_type: row.class_type } })
    },
    // 筛选
    doSelect () {
      this.params.page = 1
      this.getNonDivisionList()
    },
    handleCurrentChange (val) {
      // this.$router.push({name:'classdetail',query:this.params.page})
      this.params.page = val
      this.getList()
    },
    // 给班级添加学生
    handleAddStudent (index, item) {
      this.class_id = item.class_id || item.id
      this.class_name = item.class_name
      this.class_type = item.class_type
      this.addStudentConfig.visible = true
      if (this.isCharge < 0) {
        this.$nextTick(() => {
          this.$refs.addStudentDialog.refresh()
        })
      }
      // this.dialogTableVisible = true
    },
    // 关闭添加学生
    doClose (data) {
      this.dialogTableVisible = false
      if (data === 'success') {
        this.getList()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.routeList = to.meta.routeList
    })
  }
}
</script>
<style lang="less">
.classroomView{
  text-align: left;
  .nonDivision {
    display:inline-block;
    color:#7A808D;
    margin-left:10px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    span {
      color:#FF6968;
    }
  }
  .tableWrapper {
    text-align: center;
    font-size: 13px;
  }
  .create-class{
    display: block;
    margin: 0;
  }

  .viewTitle {
    width: 100%;
    text-align: left;
  }
  .selectRow {
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    .selectRow__select {
      margin-right: 10px;
      width: 100px;
    }
    input {
      border-radius: 16px !important;
    }
    .searchRow__input {
      width: 220px;
      float: right;
    }
  }
  .nonDivisionDialog {
    .el-dialog__header {
      padding: 20px;
      .el-dialog__title {
        font-weight: bold;
      }
    }
    .el-dialog__body {
      padding: 0 20px 20px;
      height: 550px !important;
      .el-table {
        height: 435px;
        margin-top: 10px;
        td {
          height: 50px;
        }
      }
    }
    .footer {
      text-align: center;
    }
  }
  .search-button {
    margin-left: 15px;
  }
}
</style>
