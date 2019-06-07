<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">主讲班</el-breadcrumb-item>
      </el-breadcrumb>
      <a>
        <el-button type="primary" class="clearfix cac-button-one create-button" @click="createClass">创建班级</el-button>
      </a>
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="classTable" border size="mini" height="370">
        <el-table-column :resizable="false" width="90" align="center" label="序号" type="index" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="班级名称" prop="class_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="学科" prop="subject_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="年级" prop="grade_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" label="主讲老师" prop="teacher_name" show-overflow-tooltip></el-table-column>
        <el-table-column :resizable="false" align="center" prop="status" label="班级状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">未开课</span>
            <span v-if="scope.row.status==2">已开课</span>
            <span v-if="scope.row.status==3">已结课</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="margin-right:10px;" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button :disabled="scope.row.is_deletable==0 || scope.row.status==3 || scope.row.status==4 || scope.row.status==2" size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'

export default {
  data () {
    return {
      loading: false,
      params: {
        page: Number(this.$route.query.page) || 1,
        per_page: 20,
        total: 0
      },
      classTable: [
        {
          class_name: '',
          subject_name: '',
          grade_name: '',
          teacher_name: '',
          status: '',
          put_away: ''
        }
      ]
    }
  },
  components: {},
  created () {
    this.getData()
  },
  methods: {
    createClass () {
      this.$router.push({ name: 'createTeacherClass' })
    },
    handleDelete (index, item) {
      this.$confirm('删除主讲班级后不可恢复, 是否确认删除?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        let params = {
          class_id: item.id
        }
        teacherClassApi.deleteClass(params).then(res => {
          if (res.ok) {
            this.classTable.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
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
    // 获取列表
    getData () {
      this.loading = true
      teacherClassApi.ClassList(this.params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.ok) {
          this.classTable = res.data.data
          this.params.total = res.data.total
        }
      })
    },
    // 详情
    handleDetail (index, row) {
      this.$router.push({ name: 'teacherClassDetail', query: { class_id: row.id } })
    },
    handleCurrentChange (val) {
      // this.$router.push({name:'classdetail',query:this.params.page})
      this.params.page = val
      this.getData()
    }
  }
}
</script>
<style scoped>
.tableWrapper {
  text-align: center;
}
.viewTitle {
  width: 100%;
  text-align: left;
}
.searchRow {
  margin-top: 18px;
}
.searchRow {
  text-align: left;
}
.searchRow__input {
  width: 220px;
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
</style>
