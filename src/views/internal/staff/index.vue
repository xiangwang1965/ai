<!-- 老师管理主页面-->
<template>
  <div class="staffPage">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-link :to="{name: 'createStaff', query: {type: 'add'}}">
        <el-button type="primary" class="cac-button-one" size="small" round icon="el-icon-plus">创建员工</el-button>
      </router-link>
      <el-input class="search__name" placeholder="请输入姓名、手机号" size="small" @keyup.enter.native="getData(1)" v-model="userName">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getData(1)"></i>
      </el-input>
    </div>
    <!-- 筛选项 -->
    <!--<div class="searchBar">-->
      <!--<el-select v-model="role" placeholder="用户角色" class="searchBar__role" clearable>-->
        <!--<el-option v-for="item in rolesOptions" :key="item" :label="item" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-button type="primary" class="cac-button-two searchBar__button" @click="getData">筛选</el-button>-->
    <!--</div>-->
    <!-- 用户表格 -->
    <div class="userTable">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="userTable"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="left" prop="name" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="telephone" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.gender == 3 ? '未知' : scope.row.gender == 1 ? '男' : '女'}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="left" prop="" label="所属校区" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.campus_name ? scope.row.campus_name : scope.row.campus_id == 0 ? '全部校区' : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="left" prop="role_name" label="用户角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.role_name || '无'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :resizable="false" align="center" prop="created_at" label="创建时间" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column :resizable="false" align="center" prop="status" label="状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit" width="250">
          <template slot-scope="scope">
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="goDetail(scope.row)">详情</el-button>
            <!-- <router-link style="margin-right:10px;" :to=""> -->
            <el-button class="clearfix cac-button-two create-button" :disabled="scope.row.cannotEdit" @click="editStaff(scope.row)" round size="mini">编辑</el-button>
            <!-- </router-link> -->
            <el-button
              class="clearfix cac-button-two create-button"
              round
              :disabled="scope.row.cannotEdit"
              @click="handleDisabled(scope.row.id,scope.row.is_active)"
              size="mini">{{scope.row.is_active === 1 ? '禁用' : '启用'}}</el-button>
            <!-- <el-tooltip content="详情" placement="top" :open-delay="500">
              <i class="el-icon-view cac-icon-button" @click="goDetail(scope.row)"></i>
              <i class="el-icon-view cac-icon-button cac-icon-disabled"></i>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit cac-icon-button" @click="goEdit(scope.row.id)" v-if="scope.row.role_name.indexOf('校长')===-1"></i>
              <i class="el-icon-edit cac-icon-button cac-icon-disabled" v-if="scope.row.role_name.indexOf('校长')!==-1"></i>
            </el-tooltip> -->
            <!--<el-tooltip content="启用" placement="top" v-if="!scope.row.is_active" :open-delay="500">-->
              <!--<i class="el-icon-success cac-icon-button" @click="handleDisabled(scope.row.id,scope.row.is_active)"></i>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip content="禁用" placement="top" v-if="scope.row.is_active" :open-delay="500">-->
              <!--<i class="el-icon-remove cac-icon-button cac-icon-disabled" v-if="scope.row.role_name.indexOf('校长')!==-1"></i>-->
              <!--<i class="el-icon-remove cac-icon-button" v-if="scope.row.role_name.indexOf('校长')===-1" @click="handleDisabled(scope.row.id,scope.row.is_active)"></i>-->
            <!--</el-tooltip>-->
          </template>
          <!-- <template slot-scope="scope">
            <el-button size="small" type="info" @click="goDetail(scope.row.id)">详情</el-button>
            <el-button size="small" type="primary" @click="goEdit(scope.row.id)">编辑</el-button>
            <el-button size="small" type="danger" :disabled="scope.row.role_name.indexOf('校长')!==-1" v-if="scope.row.is_active" @click="handleDisabled(scope.row.id,scope.row.is_active)">禁用</el-button>
            <el-button size="small" type="success" v-if="!scope.row.is_active" @click="handleDisabled(scope.row.id, scope.row.is_active)">启用</el-button>
          </template> -->
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="getData"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="per_page" :current-page="page" background layout="prev, pager, next" :total="total">{{total}}
      </el-pagination> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import staffApi from '@/services/internal/staff'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      loading: false,
      breadcrumbTitle: '员工管理',
      userName: '',
      role: '',
      status: '',
      statusOptions: [{ label: '已禁用', value: 0 }, { label: '已启用', value: 1 }],
      userTable: [],
      queryParam: {},
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      }
    }
  },
  created () {
    this.getData()
  },
  components: {
    pagination
  },
  methods: {
    // 获取用户
    getData (page) {
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page
      this.queryParam = {}
      if (this.role) {
        this.queryParam.role = this.role
      }
      if (this.userName) {
        this.queryParam.key = this.userName
      }
      let params = this.queryParam
      params.page = this.pageConfig.page
      params.per_page = this.pageConfig.per_page
      params.mute = true
      this.loading = true
      staffApi.getStaffList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.status_code === 200) {
          this.userTable = res.data.data
          this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getData()
          }
          this.userTable.forEach(item => {
            let roleList = item.role_name.split(',')
            if (roleList.indexOf('校长') !== -1) {
              item.cannotEdit = true
            }
            var text = item.is_active === 0 ? '已禁用' : '已启用'
            this.$set(item, 'status', text)
          })
        }
      })
    },
    // 翻页
    goPage (val) {
      this.getData(val)
    },
    // 查看详情
    goDetail (item) {
      item.class_type = (item.role_name === '教师' || item.role_name === '教务,教师') ? 1 : 2
      this.$router.push({ name: 'staffDetail', query: { id: item.id, type: item.class_type } })
    },
    // 编辑
    editStaff (item) {
      this.$router.push({ name: 'createStaff', query: { type: 'edit', id: item.id } })
    },
    // 禁用
    handleDisabled (id, status) {
      let vm = this
      let text = status === 1 ? '禁用' : '启用'
      this.$confirm('是否确定' + text + '该用户?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      })
        .then(() => {
          status = !status
          let params = {
            is_active: status,
            user_id: id
          }
          staffApi.disabledStaff(params).then(res => {
            if (res.ok) {
              vm.getData()
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + text,
            center: true
          })
        })
    }
  }
}
</script>

<style lang="less">
.staffPage {
  .searchBar {
    margin-top: 20px;
    text-align: left;
  }
  .el-input {
    width: 200px;
  }
  .searchBar__create {
    float: right;
    margin-top: -40px;
  }
  .userTable {
    margin-top: 20px;
  }
  .userTable__page {
    margin-top: 30px;
  }
  .userTable__edit i {
    font-size: 20px;
    transform: translateX(10px);
    cursor: pointer;
    margin: 0 5px;
  }
  .searchBar__button {
    float: right;
    margin-left: 15px;
  }
  .search__name {
    width: 204px;
    float: right;
    border-radius: 16px;
  }
}
</style>
