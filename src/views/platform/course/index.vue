<template>
  <div class="courseView">
    <div class="cac-bread-bar courseHeader" style="height:auto;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">课程</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" class="clearfix cac-button-one create-button create-course" size="small" round icon="el-icon-plus" @click="viewChooseTypeDialog">{{createCourseBtnName}}</el-button>
      <el-input v-if="source !== 'platform'" placeholder="请输入课程名称" size="small" @keyup.enter.native="getList()" v-model="searchKey">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="getList()"></i>
      </el-input>
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData.list"
        size="mini"
        row-class-name="courseTableRow">
        <!-- <el-table-column :resizable="false" align="center" width="52" label="序号" type="index" show-overflow-tooltip></el-table-column> -->
        <el-table-column :resizable="false" align="left" label="课程名称" prop="base_class_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="课程类型" prop="course_type_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="学科" prop="subject_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="年级" prop="grade_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="学期" prop="term_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="班型" prop="class_level_name" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.class_level_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="source !== 'platform'" :resizable="false" align="center" label="校区" prop="" show-overflow-tooltip>
          <template slot-scope="scope">
           <span>{{scope.row.campus_name[0].campus_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="状态" prop="valid" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-text="scope.row.valid==0?'已禁用':'已启用'"></div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button class="cac-button-two" size="mini" round @click="goDetail(scope.$index, scope.row)">详情</el-button>
            <el-button class="cac-button-two admin-able" size="mini" round @click="handleDisable(scope.$index, scope.row)">{{scope.row.valid==0?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="goPage"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.page_size" :current-page="params.page" background layout="prev, pager, next" :total="tableData.total">
      </el-pagination> -->
    </div>
    <el-dialog class="createCourseDialog tipDialog" top="38vh" :title="createCourseBtnName + '类型'" :visible.sync="showCourseType" width="560px">
      <el-form size="mini" :model="form" :rules="formRules" ref="form">
        <el-form-item prop="type_id">
          <el-select v-model.trim="form.type_id" style="width: 80%" placeholder="请选择课程">
            <el-option v-for="item in courseTypeList" :key="item.id" :label="item.course_type_name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showCourseType = false" class="cac-button-two cancel-button dialog_cancel_button" round>取 消</el-button>
        <el-button type="primary" size="small" @click="createSchool('form')" class="cac-button-one conform-button dialog_confirm_button" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import courseApi from '@/services/platform/course'
import receptionApi from '@/services/reception'
import authUtil from '@/services/auth/utils'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  props: [ 'source' ],
  data () {
    return {
      loading: false,
      tableData: {
        list: [],
        total: 0
      },
      params: {
        page: Number(this.$route.query.page) || 1,
        page_size: 8
      },
      searchKey: '',
      pageConfig: {
        page: Number(this.$route.query.page) || 1,
        per_page: 8,
        total: 0
      },
      showCourseType: false,
      courseTypeList: [
        {
          base_class_name: '',
          course_type_name: '',
          subject_name: '',
          grade_name: '',
          term_name: '',
          class_level_name: '',
          valid: 1,
          zip: 123
        }
      ],
      form: {
        type_id: ''
      },
      formRules: {
        type_id: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ]
      },
      schoolId: '',
      classTypeList: []
    }
  },
  components: {
    pagination
  },
  created () {
    receptionApi.getOptionsList().then(res => {
      this.classTypeList = res.data.class_type
      this.getList()
    })
    this.getCourseTypeList()
  },
  computed: {
    createCourseBtnName () {
      if (this.source === 'platform') {
        return '创建课程'
      }
      if (this.source === 'teaching') {
        return '创建面授课程'
      }
      if (this.source === 'wisroom') {
        return '创建课程'
      }
      return '创建课程'
    }
  },
  methods: {
    goDetail (index, item) {
      if (this.source === 'teaching') {
        this.$router.push({ name: 'courseDetail', query: { base_class_id: item.id } })
      }
      if (this.source === 'platform') {
        this.$router.push({ name: 'platformCourseDetail', query: { base_class_id: item.id } })
      }
    },
    viewChooseTypeDialog () {
      if (this.source === 'platform') {
        this.showCourseType = true
      } else if (this.source === 'wisroom') {
        this.$router.push({name: 'createWisroomCourse', query: {type_id: this.form.type_id}})
      } else {
        this.$router.push({name: 'createCourse', query: {type_id: this.form.type_id}})
      }
    },
    handleDisable (index, item) {
      let text = item.valid === 1 ? '禁用' : '启用'
      this.$confirm('是否确定' + text + '该课程?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.loading = true
        let params = {
          base_class_id: item.id,
          valid: item.valid === 1 ? 0 : 1
        }
        if (this.source === 'platform') {
          courseApi.courseDisable(params).then(res => {
            this.loading = false
            if (res.ok) {
              item.valid = item.valid === 1 ? 0 : 1
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        } else {
          courseApi.validCourse(params).then(res => {
            this.loading = false
            if (res.ok) {
              item.valid = item.valid === 1 ? 0 : 1
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + text,
          center: true
        })
      })
    },
    getCourseTypeList () {
      receptionApi.getOptionsList().then(res => {
        this.courseTypeList = res.data.course_types
        this.form.type_id = res.data.course_types[0].id
      })
    },
    createSchool (formName) {
      this.showCourseType = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({name: 'platformCreateCourse', query: {type_id: this.form.type_id}})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户列表
    getList (flag) {
      this.loading = true
      this.pageConfig.page = flag ? this.pageConfig.page : 1
      var params = {
        page: this.pageConfig.page,
        page_size: this.pageConfig.per_page,
        school_id: authUtil.getUser().school_id
      }
      if (this.searchKey) {
        params.base_class_name = this.searchKey
      }
      if (this.source === 'platform') {
        courseApi.queryCourseList(params).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.ok) {
            this.tableData.list = res.data.list
            this.tableData.total = res.data.total_count
            this.pageConfig.total = res.data.total_count
            if (requireAgainPage(this.pageConfig) > 0) {
              this.pageConfig.page = requireAgainPage(this.pageConfig)
              this.getList()
            }
          }
        })
      } else {
        courseApi.faceCourseList(params).then(res => {
          this.loading = false
          if (res.ok) {
            res.data.list.map((v, i) => {
              if (this.classTypeList.length > 0) {
                this.classTypeList.map((o, j) => {
                  if (v.class_type_id === o.class_level_id) {
                    v.class_level_name = o.class_level_name
                  }
                })
              }
            })
            this.tableData.list = res.data.list
            this.tableData.total = res.data.total
            this.pageConfig.total = res.data.total
            if (requireAgainPage(this.pageConfig) > 0) {
              this.pageConfig.page = requireAgainPage(this.pageConfig)
              this.getList()
            }
          }
        })
      }
    },
    // 详情
    handleDetail (index, row) {
      this.$router.push({ name: 'classDetail', query: { class_id: row.class_id, class_type: row.class_type } })
    },
    handleCurrentChange (val) {
      // this.$router.push({name:'classdetail',query:this.params.page})
      this.params.page = val
      this.getList()
    },
    goPage (val) {
      this.pageConfig.page = val
      this.getList(true)
    }
  }
}
</script>
<style lang="less">
.courseView {
  .courseHeader {
    position: relative;
    .el-input {
      position: absolute;
      right: 0;
      bottom: 10px;
      width: 204px;
    }
    .viewTitle {
      width: 100%;
      text-align: left;
    }
  }
  .searchRow {
    margin-top: 18px;
    text-align: left;
  }
  .searchRow__input {
    width: 204px;
    float: right;
  }
  .selectRow {
    width: 100%;
    text-align: justify;
    overflow: hidden;
    margin-top: 20px;
  }
  .selectRow__select {
    margin-right: 10px;
  }
  .search-button {
    margin-left: 15px;
  }
}
</style>
