<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{source === 'studentClassroom' ? '班级管理' : '学生班'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link v-if="source !== 'studentClassroom' || isCharge < 0" :to="{name: source === 'platform' ? 'platformStudentEdit' : 'studentClassroomEdit', query: {create: 'create', is_teach: is_teach,is_live: is_live}}">
        <el-button type="primary" class="clearfix cac-button-one create-button create-class" size="small" round icon="el-icon-plus">创建班级</el-button>
      </router-link>
    </div>
    <div class="selectRow">
      <el-select size="small" v-model="params.subject_id" placeholder="学科" class="selectRow__select" clearable>
        <el-option v-for="item in optionSubject" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select size="small" v-model="params.grade_id" placeholder="年级" class="selectRow__select" clearable>
        <el-option v-for="item in optionGrade" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select size="small" v-model="params.level" placeholder="班型" class="selectRow__select" clearable filterable>
        <el-option v-for="item in optionLevel" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select size="small" v-model="params.term_id" placeholder="学期" class="selectRow__select" clearable>
        <el-option v-for="item in optionSemester" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select size="small" v-model="params.status" placeholder="班级状态" class="selectRow__select" clearable>
        <el-option v-for="item in optionClassStatus" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select size="small" v-model="params.campus_id" placeholder="校区" class="selectRow__select" clearable filterable>
        <el-option v-for="item in optionCampus" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-button type="primary" style="vertical-align:top;" class="cac-button-one spc_filter" size="small" round @click="doSelect">筛选</el-button>
      <el-input size="small" class="searchRow__input" placeholder="请输入班级名称" @keyup.enter.native="doSelect" v-model="params.search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="doSelect"></i>
      </el-input>
      <!--<el-select v-if="is_live&&is_teach" v-model="params.class_type" placeholder="班级类型" class="selectRow__select">-->
        <!--<el-option v-for="item in optionClasstype" :key="item.key" :label="item.value" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table :header-cell-style="{
    'background-color': '#f9fbfc',
    'color': '#7a808d'}" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="tableData" size="mini">
        <!-- <el-table-column align="center" label="班级ID" width="70" prop="class_code"></el-table-column> -->
        <el-table-column :resizable="false" align="left" min-width="100px" label="班级名称" prop="class_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="班级类型" prop="" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.level_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="年级/学科" prop="grade_name" :formatter="subject" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="辅导老师" prop="teacher_name" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" label="课程起止日期" width="260" prop="start_time" :formatter="endTime"></el-table-column> -->
        <el-table-column :resizable="false" align="left" label="校区" prop="campus_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="当前学员" width="110" prop="student_count" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="班级状态" prop="" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.class_status === 1">已退课</span>
            <span v-else>{{scope.row.status_name}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" class-name="table_manage_column" label="操作" :min-width="isCharge >= 0 ? '100px' : '420px'">
          <template slot-scope="scope">
            <router-link style="color:blue;margin-right:10px;" :to="{name: source === 'platform' ? 'platformStudentDetail' : 'studentClassroomDetail', query: { class_id: scope.row.class_id, class_type: scope.row.class_type }}">
              <el-button class="clearfix cac-button-two manage-button" size="mini" round>详情</el-button>
            </router-link>
            <el-button v-if="isCharge < 0" type="primary" class="clearfix cac-button-two manage-button" size="mini" round :disabled="scope.row.class_status===1 || scope.row.status===3 || scope.row.status===4 || scope.row.live_class_type === 5" @click="handleAddStudent(scope.$index, scope.row)">添加学生</el-button>
            <el-button type="primary" class="clearfix cac-button-two manage-button" size="mini" round :disabled="scope.row.class_status===1 || scope.row.status===3 || scope.row.status===4 || scope.row.live_class_type === 4" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="isCharge < 0" type="primary" class="clearfix cac-button-two manage-button" size="mini" round :disabled="scope.row.class_status===1 || scope.row.status===2 || scope.row.status===3 || scope.row.status===4 || scope.row.live_class_type===5" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!-- <el-tooltip content="详情" placement="top" :open-delay="500">
              <i class="el-icon-view cac-icon-button" @click="handleDetail(scope.$index, scope.row)"></i>
              <i class="el-icon-view cac-icon-button cac-icon-disabled"></i>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit cac-icon-button" @click="handleEdit(scope.$index, scope.row)" v-if="!(scope.row.status===3)"></i>
              <i class="el-icon-edit cac-icon-button cac-icon-disabled" v-if="scope.row.status===3"></i>
            </el-tooltip>
            <el-tooltip content="添加学生" placement="top" :open-delay="500">
              <i class="el-icon-circle-plus cac-icon-button" @click="handleAddStudent(scope.$index, scope.row)" v-if="!(scope.row.status===3)"></i>
              <i class="el-icon-circle-plus cac-icon-button cac-icon-disabled" v-if="scope.row.status===3"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :open-delay="500">
              <i class="el-icon-delete cac-icon-button" @click="handleDelete(scope.$index, scope.row)" v-if="!(params.class_type===2||scope.row.status===3||scope.row.status===2)"></i>
              <i class="el-icon-delete cac-icon-button cac-icon-disabled" v-if="params.class_type===2||scope.row.status===3||scope.row.status===2"></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="{page: params.page, per_page: params.page_size, total: params.total}" @change="getList"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.page_size" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination> -->
    </div>
    <addStudentDialog ref="addStudentDialog" :config="addStudentConfig" :class_name="this.class_name" :class_id="this.class_id" :class_type="class_type" :isOld="true" v-on:close="doClose"></addStudentDialog>
    <addSingleStudentDialog v-if="isCharge >= 0 && false" ref="addStudentDialog" :config="addStudentConfig" :classId="class_id" @select="addSingleStudentDone"></addSingleStudentDialog>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import addStudentDialog from '@/components/reception/addStudentDialog'
import authUtils from '@/services/auth/utils'
import eventHub from '@/utils/eventHub'
import pagination from '@/components/pagination'
import addSingleStudentDialog from '@/components/reception/addSingleStudentDialog'
import { requireAgainPage } from '@/utils'
export default {
  props: ['source'],
  data () {
    return {
      loading: false,
      tableData: [],
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
        total: 0,
        mute: true,
        target: 'tableWrapper'
      },
      optionClassStatus: [],
      optionLevel: [],
      optionGrade: [],
      optionSubject: [],
      optionSemester: [],
      optionCampus: [],
      optionClasstype: [],
      addStudentConfig: {
        visible: false
      },
      class_id: 0,
      class_name: '',
      class_type: '',
      is_teach: 0,
      is_live: 1,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge')
    }
  },
  components: {
    addStudentDialog,
    pagination,
    addSingleStudentDialog
  },
  created () {
    this.getOption()
    eventHub.$on('updateUser', this.getUser)
    this.getUser()
  },
  methods: {
    getUser () {
      this.is_teach = authUtils.getUser() && Number(authUtils.getUser().is_teach)
      this.is_live = authUtils.getUser() && Number(authUtils.getUser().is_live)
      // is_self_live: school.is_self_live,
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
          this.optionClassStatus = list
          this.optionLevel = res.data.options.level
          this.optionGrade = res.data.options.grade
          this.optionSubject = res.data.options.subject
          this.optionSemester = res.data.options.term
          this.optionCampus = res.data.options.campus
          this.optionClasstype = res.data.options.class_type
        }
      })
    },
    // 获取用户列表
    getList (index) {
      this.params.page = index || this.params.page
      this.loading = true
      classroomApi.query(this.params).then(res => {
        this.loading = false
        if (res.ok) {
          this.tableData = res.data.list
          this.params.total = res.data.total_count
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.getList()
          }
        }
      })
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
          'class_id': row.class_id
        }
        classroomApi.disabled(params).then(res => {
          if (res.ok) {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功',
              center: true
            })
          }
        })
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
      this.$router.push({ name: this.source === 'platform' ? 'platformStudentEdit' : 'studentClassroomEdit', query: { create: 'edit', id: row.class_id, type: row.class_type } })
    },
    // 详情
    handleDetail (index, row) {
      this.$router.push({ name: 'studentClassroomDetail', query: { class_id: row.class_id, class_type: row.class_type } })
    },
    // 筛选
    doSelect () {
      this.params.page = 1
      this.getList()
    },
    handleCurrentChange (val) {
      // this.$router.push({name:'classdetail',query:this.params.page})
      this.params.page = val
      this.getList()
    },
    // 给班级添加学生
    handleAddStudent (index, item) {
      this.class_id = item.class_id
      this.class_name = item.class_name
      this.class_type = item.class_type
      if (this.isCharge >= 0) {
        this.addStudentConfig.visible = true
      } else {
        this.addStudentConfig.visible = true
        this.$nextTick(() => {
          this.$refs.addStudentDialog.refresh()
        })
      }
    },
    // 开放报名缴费机构只能添加单个学生，关闭弹框进入缴费页面
    addSingleStudentDone (val) {
      if (this.source === 'platform') {
        this.$router.push({name: 'platformAddStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.class_id, from: 'class'}})
      } else {
        this.$router.push({name: 'addStudent', query: {id: val.id, vd_id: val.vd_id, classId: this.class_id, from: 'class'}})
      }
    },
    // 关闭添加学生
    doClose (data) {
      this.addStudentConfig.visible = false
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
.classroomView {

  .tableWrapper {
    text-align: center;
    .el-button {
      min-width: 50px;
    }
  }
  .create-class {
    display: block;
    margin: 0;
  }
  .viewTitle {
    width: 100%;
    text-align: left;
  }
  .searchRow {
    margin-top: 18px;
    text-align: left;
  }
  .searchRow__input {
    width: 220px;
    float: right;
    border-radius: 16px;
  }
  .selectRow {
    width: 100%;
    text-align: justify;
    overflow: hidden;
    margin-top: 20px;
  }
  .selectRow__select {
    margin-right: 10px;
    width: 100px;
  }
  .selectRow__select, .searchRow__input {
    input {
      border-radius: 16px;
    }
  }
  .screen-btn {
    height: 32px;
    padding: 0 10px;
  }
  .search-button {
    margin-left: 15px;
  }
  .table_manage_column {
    width: 420px;
  }
}
</style>
