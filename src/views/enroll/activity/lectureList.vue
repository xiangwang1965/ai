<!-- 讲座活动或体验班活动详情页 -->
<template>
  <div class="lecture-list">
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
        :data="lectureList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="name" label="学生姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="nickname" label="学生微信昵称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="tel" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="(activityType == 2) || (activityType == 3) " :resizable="false" align="center" prop="apply_time" label="报名时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="(activityType == 4) || (activityType == 5)"  :resizable="false" align="center" prop="apply_time" label="报名时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="(activityType == 2) || (activityType == 3)" :resizable="false" align="center" prop="is_signed" label="是否签到" show-overflow-tooltip>
        </el-table-column>
         <!-- <el-table-column v-if="(activityType == 4) || (activityType == 5)" :resizable="false" align="center" prop="is_signed" label="是否入班" width="120" show-overflow-tooltip>
        </el-table-column> -->
      </el-table>
      <pagination :config="pageConfig" @change="getData"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import activityApi from '@/services/enroll/activity'
import pagination from '@/components/pagination'

export default {
  data () {
    return {
      loading: false,
      breadcrumbTitle: '活动详情',
      activityType: '',
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      activity: {},
      lectureList: []
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
      this.getActivityType()
    },
     // 获取活动类型(2,3: 讲座, 4,5: 体验版或短期班)
    getActivityType () {
      this.activityType = this.$route.query.type
    },
    // 获取用户
    getData (page) {
      this.loading = true
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

      let params = {}
      params.activity_id = this.$route.query.id
      // params.page = this.pageConfig.page
      // params.per_page = this.pageConfig.per_page

      activityApi.getLeatureList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.status_code === 200) {
          this.activity = res.data.activity
          let data = res.data.students.map((item) => {
            item.is_signed = item.is_signed === 1 ? '未签到' : item.sign_time + ' 签到'
            return item
          })
          this.lectureList = data
          // this.pageConfig.total = res.data.total
        }
      })
    },
    // 翻页
    goPage (val) {
      this.getData(val)
    }
  }
}
</script>

<style lang="less">
.lecture-list {
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
