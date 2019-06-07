<template>
  <div class="studentView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">学生管理</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{name: 'createStudent', query: {create: 'create'}}">
        <el-button type="primary" size="small" class="cac-button-one" round icon="el-icon-plus">创建学生</el-button>
      </router-link>
      <!-- <router-link :to="{name: 'studentEdit', query: {create: 'create'}}">
        <el-button type="primary" size="small" class="cac-button-two" round>导入学生</el-button>
      </router-link> -->
      <el-input
        class="selectRow__input"
        v-model="params.key"
        placeholder="请输入学生姓名、ID、手机号"
        @keyup.enter.native="doSelect"
        size="small">
        <i slot="suffix" class="el-icon-search el-input__icon" @click="doSelect"></i>
      </el-input>
    </div>
    <!-- <div class="selectRow">
      <el-select v-model="params.grade" placeholder="年级" class="selectRow__select" clearable>
        <el-option v-for="item in optionGrade" :key="item.key" :label="item.value" :value="item.value">
        </el-option>
      </el-select>
      <span class="selectRow__total">学生总数&nbsp;{{params.total}}</span>
      <el-button type="primary" icon="el-icon-search" class="selectRow__button cac-button-two" @click="doSelect"> 筛选</el-button>
    </div> -->
    <div class="tableWrapper">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        size="mini">
        <el-table-column v-if="source !== 'teaching'" :resizable="false" align="center" label="学生ID" prop="id" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="left" label="姓名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="所属校区" prop="campus_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="已报课程" prop="all_course_count" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="source !== 'teaching'" :resizable="false" align="center" label="学生性别" prop="gender" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="source !== 'teaching'" :resizable="false" align="center" label="学生年级" prop="grade" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="source !== 'teaching'" :resizable="false" align="center" label="创建时间" prop="created_at" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" width="180">
          <template slot-scope="scope">
              <el-button size="mini" class="cac-button-two" round @click="handleDetail(scope.$index, scope.row)">详情</el-button>
              <el-button size="mini" class="cac-button-two" round @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-tooltip content="详情" placement="top" :open-delay="500">
              <i class="el-icon-view cac-icon-button" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit cac-icon-button" @click="handleEdit(scope.$index, scope.row)"></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="params" @change="refresh"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import studentApi from '@/services/student'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  props: [ 'source' ],
  data () {
    return {
      loading: false,
      tableData: [],
      params: {
        page: 1,
        per_page: 8,
        total: 0,
        grade: '',
        key: '',
        mute: true
      },
      optionGrade: [
        { value: '一年级', key: 1 },
        { value: '二年级', key: 2 },
        { value: '三年级', key: 3 },
        { value: '四年级', key: 4 },
        { value: '五年级', key: 5 },
        { value: '六年级', key: 6 },
        { value: '初一', key: 7 },
        { value: '初二', key: 8 },
        { value: '初三', key: 9 },
        { value: '高一', key: 10 },
        { value: '高二', key: 11 },
        { value: '高三', key: 12 }
      ],
      optionStudentStatus: [
        { value: '有课', key: 1 },
        { value: '无课', key: 2 }
      ],
      page: 1,
      per_page: 20,
      genders: ['未知', '男', '女', '未知'],
      addStudentConfig: {
        visible: true
      }
    }
  },
  components: {
    pagination
  },
  created () {
    this.refresh()
  },
  methods: {
    refresh (index) {
      this.params.page = (index && typeof index === 'number') ? index : this.params.page
      this.loading = true
      studentApi.query(this.params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.ok) {
          this.tableData = res.data.data
          this.params.total = res.data.total
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.refresh()
          }
          this.tableData.forEach(item => {
            item.gender = this.genders[item.gender]
          })
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm('是否确定删除该学生?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    handleEdit (index, row) {
      this.$router.push({ name: 'createStudent', query: { create: 'edit', id: row.id } })
    },
    handleDetail (index, row) {
      this.$router.push({ name: 'studentDetail', query: { id: row.id } })
    },
    doSelect () {
      this.params.page = 1
      this.refresh(this.params)
    }
    // ,
    // goPage (val) {
    //   this.params.page = val
    //   this.refresh(this.params)
    // }
  }
}
</script>
<style lang="less">
.studentView {
  .cac-bread-bar {
    .el-button {
      width: 100px;
    }
  }
  .selectRow {
    margin-top: 20px;
    text-align: left;
    overflow: hidden;
  }
  .selectRow__select {
    width: 13%;
    margin-right: 1%;
  }
  .selectRow__input {
    width: 225px;
    float: right;
  }
  .selectRow__button {
    vertical-align: top;
  }
  .selectRow__total {
    float: right;
    width: 100px;
    line-height: 40px;
    text-align: right;
  }
  .tableWrapper {
    height: auto;
  }
}
</style>
