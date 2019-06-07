<template>
  <div class="classroomView" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">主讲管理</el-breadcrumb-item>
      </el-breadcrumb>
      <a>
        <el-button type="primary" class="clearfix cac-button-one create-button create-teacher" size="small" icon="el-icon-plus" round @click="createTeacher('create')">创建主讲</el-button>
      </a>
      <el-input size="small" class="searchRow__input" placeholder="请输入姓名、手机号" @keyup.enter.native="getData" v-model="params.search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getData"></i>
      </el-input>
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table
        :data="teacherTable"
        fit
        style="width: 100%;font-size: 12px"
        v-loading="loading">
        <!-- <el-table-column :resizable="false" width="60" align="center" prop="date" label="序号" type="index" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column :resizable="false" align="left" prop="name" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="telephone" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="gender" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知'}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="campus_name" label="所属校区" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="" label="用户角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>双师主讲</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="is_active" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-text="scope.row.is_active==0?'已禁用':'已启用'"></div>
          </template>
        </el-table-column>
        <!-- <el-table-column :resizable="false" align="center" prop="created_at" label="创建日期" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column :resizable="false" align="center" prop="is_active" width="240" label="操作">
          <template slot-scope="scope">
            <el-button v-if="params.total>0" style="" size="mini" class="clearfix cac-button-two manage-button" round @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button v-if="params.total>0" size="mini" class="clearfix cac-button-two manage-button" round @click="createTeacher('edit', scope.row)">编辑</el-button>
            <el-button v-if="params.total>0" class="clearfix cac-button-two manage-button admin-able" round :class="{'admin-disabled':scope.row.is_active===1}" size="mini" @click="handleDisable(scope.$index, scope.row)">{{scope.row.is_active==0?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="params" @change="getData"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      params: {
        page: Number(this.$route.query.page) || 1,
        per_page: 8,
        total: 0
      },
      teacherTable: [
        {
          name: '',
          telephone: '',
          is_active: '',
          created_at: ''
        }
      ],
      queryString: '',
      loading: false
    }
  },
  components: {
    pagination
  },
  created () {
    this.getData()
  },
  methods: {
    getData (index) {
      this.params.page = index && typeof index === 'number' ? index : this.params.page
      let params = {
        page: this.params.page,
        per_page: this.params.per_page,
        key: this.params.search
      }
      this.loading = true
      teacherClassApi.queryLiveTeacher(params).then(res => {
        this.loading = false
        if (res.ok) {
          this.teacherTable = res.data.data
          this.params.total = res.data.total
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.getData()
          }
        }
      })
    },
    createTeacher (type, item) {
      var queryData = {
        type: type
      }
      if (item) {
        queryData.live_teacher_id = item.id
      }
      this.$router.push({ name: 'createPlatformTeacher', query: queryData })
    },
    handleDetail (index, item) {
      this.$router.push({ name: 'platformTeacherDetail', query: { live_teacher_id: item.id } })
    },
    handleDisable (index, item) {
      let text = item.is_active === 1 ? '禁用' : '启用'
      this.$confirm('是否' + text + '?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        var isActive = item.is_active === 1 ? 0 : 1
        let params = {
          live_teacher_id: item.id,
          is_active: isActive
        }
        teacherClassApi.activeLiveTeacher(params).then(res => {
          if (res.ok) {
            item.is_active = item.is_active === 1 ? 0 : 1
            this.$message({
              type: 'success',
              message: text + '成功',
              center: true
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + text,
          center: true
        })
      })
    },
    handleCurrentChange (val) {
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
.manage-button{
  height: 28px;
  padding: 0 15px;
}
.create-teacher{
  display: block;
  margin: 0;
}
</style>
