<!-- 咨询本列表主页面-->
<template>
  <div class="consult-list">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="import-data" v-if="importFlag">
        <a :href="importUrlCom">
          <el-button type="primary" class="cac-button-one import-data-button" size="small" round>
            <i class="import-iconfont"></i>
            <span>导出数据</span>
          </el-button>
        </a>
      </div>
      <el-select
        class="selectRow__select"
        v-model="queryParam.status"
        placeholder="请选择身份信息"
        size="middle"
        clearable>
        <el-option v-for="item in optionStatus" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-button style="" type="primary" class="cac-button-one query" size="small" icon="el-icon-search" round @click="getData(1, true)">
        筛选
      </el-button>
      <el-input v-model.trim="userName" class="search__name" :maxlength="30" placeholder="请输入学生姓名、手机号" size="small" @keyup.enter.native="getData(1, true)">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getData(1, true)"></i>
      </el-input>
    </div>
    <div class="consult-list-Table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="consultList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="orderId" label="序号" width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="student_name" label="学生姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="name" label="微信昵称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="tel" label="手机号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="status_name" label="身份状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="activity_count" label="参加活动次数" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="activity_time" label="首次活动时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit" width="250">
          <template slot-scope="scope">
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="goDetail(scope.row)">详情</el-button>
            <el-button class="clearfix cac-button-two create-button" :disabled="scope.row.cannotEdit" @click="editStaff(scope.row)" round size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="getData"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import consultApi from '@/services/enroll/consult'
import pagination from '@/components/pagination'
import { API_URL } from '../../../config.js'
import util from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'

export default {
  data () {
    return {
      breadcrumbTitle: '咨询本',
      loading: false,
      importFlag: false,
      queryFlag: false,
      importUrl: API_URL + '/advice/advice_export',
      queryParam: {
        status: '',
        tel: '',
        student_name: '',
        school_id: ''
      },
      queryStatusCopy: '',
      userName: '',
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      consultList: [],
      optionStatus: [
        {
          key: 1,
          value: '机构学生'
        }, {
          key: 2,
          value: '非机构学生'
        }
      ]
    }
  },
  watch: {
    queryParam: {
      handler (oldVal, newVal) {
        this.queryFlag = false
      },
      deep: true
    },
    userName () {
      this.queryFlag = false
    }
  },
  created () {
    this.init()
  },
  components: {
    pagination
  },
  computed: {
    importUrlCom () {
      let queryString = this.importUrl + '?api_token=' + util.getToken() + `&school_id=${this.queryParam.school_id}`
      if (this.queryParam.status) {
      // if (this.queryStatusCopy) {
        queryString += `&status=${this.queryParam.status}`
      }
      if (this.queryParam.tel) {
        queryString += `&tel=${this.queryParam.tel}`
      }
      if (this.queryParam.student_name) {
        queryString += `&student_name=${this.queryParam.student_name}`
      }
      return queryString
    }
  },
  methods: {
    // 初始化
    init () {
      this.getData()
      this.setImportFlag()
    },
    // 获取用户
    getData (page, flag = false) {
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page
      this.loading = true
      // if (flag) {
      //   this.queryFlag = true
      //   this.queryStatusCopy = this.queryParam.status
      // }
      this.getSchoolId()

      let params = {}
      if (/^[0-9]+$/.test(this.userName)) {
        this.queryParam.tel = this.userName
        this.queryParam.student_name = ''
      } else {
        this.queryParam.student_name = this.userName
        this.queryParam.tel = ''
      }
      params.school_id = this.queryParam.school_id
      params.page = this.pageConfig.page
      params.per_page = this.pageConfig.per_page

      // params = this.queryFlag ? Object.assign(params, this.queryParam) : params
      params = Object.assign(params, this.queryParam)

      consultApi.queryConsultList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.status_code === 200) {
          res.data.lists.forEach((item, index) => {
            item.orderId = (this.pageConfig.page - 1) * (this.pageConfig.per_page) + (index + 1)
          })
          this.consultList = res.data.lists
          this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.getData(requireAgainPage(this.pageConfig), true)
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
      this.$router.push({ name: 'consultDetail', query: { stId: item.student_id, scId: this.queryParam.school_id } })
    },
    // 编辑
    editStaff (item) {
      localStorage.setItem('times', item.activity_count)
      this.$router.push({ name: 'consultEdit', query: { stId: item.student_id, scId: this.queryParam.school_id } })
    },
    // 获取 school_id
    getSchoolId () {
      this.queryParam.school_id = util.getUser().school_id
    },
    // 判断是否是魔法双师
    setImportFlag () {
      if (util.getUser().brands && util.getUser().brands.indexOf('MS') >= 0) {
        this.importFlag = true
      }
    }
  }
}
</script>

<style lang="less">
.consult-list {
  .searchBar {
    margin-top: 20px;
    text-align: left;
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
  .import-data {
    margin-bottom: 30px;
  }
  .el-select {
    .el-input {
      width: 160px;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-input__icon {
      line-height: 32px;
    }
  }
  .query {
    vertical-align: middle;
    width: 80px;
    min-width: 80px;
    margin-left: 7px;
    border-radius: 15px;
  }
  .import-data {
    .import-data-button {
      box-sizing: border-box;
      width: 100px;
      min-width: 100px;
      height: 32px;
      > span {
        display: inline-flex;
      }
    }
    span {
      vertical-align: middle;
    }
    .import-iconfont {
      width: 14px;
      height: 14px;
      display: inline-block;
      margin-right: 5px;
      background: url(../../../../static/img/import_icon.png) center center;
    }
  }
}
</style>
