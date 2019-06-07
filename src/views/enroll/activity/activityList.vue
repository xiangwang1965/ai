<!-- 所有类型活动列表页 -->
<template>
  <div class="activity-list">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button v-if="false" type="primary">导出全部</el-button>
      <el-input class="search__name" placeholder="请输入活动名称" size="small" @keyup.enter.native="getData(1)" v-model="queryParam.name">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getData(1)"></i>
      </el-input>
    </div>
    <div class="consult-list-Table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="activityList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="activity_name" label="活动名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="grade_name" label="年级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="subject_name" label="学科" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="type_name" label="活动类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="teacher_name" label="负责人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="start_time" label="开始时间" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="end_time" label="结束时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="student_count" label="参与人数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit">
          <template slot-scope="scope">
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="goDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="getData"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import activityApi from '@/services/enroll/activity'
import util from '@/services/auth/utils'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'

export default {
  data () {
    return {
      breadcrumbTitle: '运营活动管理',
      loading: false,
      queryParam: {
        name: '',
        school_id: ''
      },
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      activityList: []
    }
  },
  created () {
    this.init()
  },
  components: {
    pagination
  },
  methods: {
    // 初始化
    init () {
      this.getData()
    },
    // 获取所有活动列表数据
    getData (page) {
      this.loading = true
      this.queryParam.school_id = util.getUser().school_id
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

      let params = Object.assign(this.queryParam, { page: this.pageConfig.page, per_page: this.pageConfig.per_page })
      activityApi.queryActivityList(params).then(res => {
        this.loading = false
        if (res.status_code === 200) {
          this.activityList = res.data.data
          this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getData()
          }
        }
      })
    },
    // 翻页
    goPage (val) {
      this.getData(val)
    },
    // 查看详情
    goDetail (item) {
      let name = item.type === 1 ? 'attendanceList' : 'lectureList'

      this.$router.push({ name: name, query: { id: item.activity_id, type: item.type } })
    }
  }
}
</script>

<style lang="less">
.activity-list {
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
  .consult-list-Table {
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
    margin-bottom: 20px;
    width: 204px;
    float: left;
    border-radius: 16px;
  }
}
</style>
