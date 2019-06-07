 <!-- 打卡活动详情 -->
<template>
  <div class="attendance-list">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/activityList' }">运营活动管理</router-link>
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-button type="primary">导出全部</el-button> -->
    </div>
    <div class="basic-info">
      <!-- <h5>基本信息</h5> -->
      <p class="basic-info-title">{{activity.activity_name}}</p>
      <div class="basic-info-option">
        <div class="basic-info-option-item">
          <div class="basic-info-option-item-first">老师</div>
          <div>{{activity.teacher_name}}</div>
        </div>
         <div class="basic-info-option-item">
          <div class="basic-info-option-item-first">活动时间</div>
          <div>{{activity.time}}</div>
        </div>
      </div>
    </div>
    <div class="consult-list-Table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="attendanceList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="nickname" label="学生微信昵称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="tel" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="apply_time" label="首次参与时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="submit_count" label="打卡提交次数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="checked_count" label="老师批改次数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit" width="250">
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
// import util from '@/services/auth/utils'
import pagination from '@/components/pagination'

export default {
  data () {
    return {
      breadcrumbTitle: '活动详情',
      loading: false,
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      activity: {},
      attendanceList: []
    }
  },
  created () {
    this.getData()
  },
  components: {
    pagination
  },
  methods: {
    // 获取打卡活动列表数据
    getData (page) {
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page
      this.loading = true

      let params = {}
      params.activity_id = this.$route.query.id
      // params.page = this.pageConfig.page
      // params.per_page = this.pageConfig.per_page

      activityApi.getAttendanceList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.status_code === 200) {
          this.activity = res.data.activity
          this.attendanceList = res.data.students
          // this.pageConfig.total = res.data.total
        }
      })
    },
    // 翻页
    goPage (val) {
      this.getData(val)
    },
    // 查看详情
    goDetail (item) {
      this.$router.push({ name: 'studentActivityDetail', query: { aId: item.activity_id, sId: item.student_id } })
    }
  }
}
</script>

<style lang="less">
.attendance-list {
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
    width: 204px;
    float: right;
    border-radius: 16px;
  }
  .basic-info {
    text-align: left;

    h5 {
      font-size: 20px;
      font-weight: bold;
    }
    .basic-info-title {
      font-size: 18px;
      font-weight: bold;
      padding: 0 0 20px 0;
    }
    .basic-info-option {
      display: flex;
      font-size: 12px;

      .basic-info-option-item {
        margin-right: 60px;

        .basic-info-option-item-first {
          color: #7A808D;
          padding-bottom: 6px;
        }
      }
    }
  }
}
</style>
