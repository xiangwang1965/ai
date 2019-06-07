<template>
  <div class="check-bill-wrap" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">账单核对</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <a :href="handleDownload()">  -->
        <el-button @click="handleDownload" type="primary" icon="el-icon-download" class="cac-button-one import-data-button" size="small" round>
          <span>下载</span>
        </el-button>
      <!-- </a> -->
    </div>
    <div class="selectRow">
      <el-select
        class="selectRow__select"
        v-model="queryParam.course_type"
        placeholder="形式"
        size="small"
        clearable>
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="queryParam.pay_method"
        placeholder="支付方式"
        size="small"
        clearable
        filterable>
        <el-option v-for="item in payOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select
        class="selectRow__select"
        v-model="queryParam.use"
        placeholder="类型"
        size="small"
        clearable
        filterable>
        <el-option v-for="item in useOptions" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        size="small"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-button style="vertical-align:top;min-width:80px;margin-left:17px;" type="primary" icon="el-icon-search" class="cac-button-one" size="small" @click="getCheckbillData(1, true)" round >筛选</el-button>
    </div>
    <div class="orderContent">
      <el-table
        :data="checkbillListCom"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading">
        <el-table-column align="left" label="订单编号" min-width="120" prop="order_code" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="学生ID" prop="student_id" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="姓名" prop="student_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="手机号" min-width="120" prop="student_phone" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="形式" prop="course_type" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="商品名称" min-width="140" prop="goods_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="班级名称" min-width="140" prop="class_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="主讲" min-width="100" prop="main_teacher" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="辅导" min-width="100" prop="tutor_teacher" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="课程单价" prop="goods_unit_price" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="书本费单价" min-width="100" prop="option_unit_price" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="需付" prop="fix_price" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="实收" prop="amount" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="支付方式" prop="pay_method" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="类型" prop="use" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="日期时间" min-width="160" prop="created_at" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="count-all">
        <ul>
          <li>
            <span class="count-all-name">收入：</span>
            <span class="count-all-value"><span class="count-all-value-first">{{this.income | twoFloatFormat}}</span> 元</span>
          </li>
          <li>
            <span class="count-all-name">退费：</span>
            <span class="count-all-value"><span class="count-all-value-first">{{this.refund | twoFloatFormat}}</span> 元</span>
          </li>
          <li>
            <span class="count-all-name">合计营收：</span>
            <span class="count-all-value"><span class="count-all-value-first" style="font-size:18px">{{this.incomeCount | twoFloatFormat}}</span> 元</span>
          </li>
        </ul>
      </div>
      <pagination :config="pageConfig" @change="getCheckbillData"></pagination>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/pagination'
  import checkbillApi from '@/services/reception/checkbill'
  import { twoFloatFormat, handleQueryNull, formatDay } from '@/utils'
  import { API_URL } from '../../../config.js'
  import util from '@/services/auth/utils'

  export default {
    data () {
      return {
        time: '',
        queryParam: {
          course_type: '',
          pay_method: '',
          use: '',
          start_time: '',
          end_time: ''
        },
        queryParamCopy: {},
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        typeOptions: [
          { id: '1', name: '双师' },
          { id: '4', name: 'AI' }
        ],
        payOptions: [
          { id: '1', name: '银联' },
          { id: '2', name: '支付宝' },
          { id: '3', name: '微信' },
          { id: '4', name: '现金' },
          { id: '5', name: '自动支付' }
        ],
        useOptions: [
          { id: '1', name: '补费' },
          { id: '2', name: '退费' },
          // { id: '3', name: '抵扣转入' },
          // { id: '4', name: '抵扣转出' },
          { id: '5', name: '第一次缴费' }
        ],
        loading: false,
        checkbillList: [],
        refund: '',
        income: '',
        downloadUrl: API_URL + '/phoenix/order/bill_download'
      }
    },
    components: {
      pagination
    },
    computed: {
      incomeCount () {
        return this.income - this.refund
      },
      checkbillListCom () {
        return this.checkbillList.map(item => {
          switch (item.course_type) {
            case 1:
              item.course_type = '双师'
              break
            case 4:
              item.course_type = 'AI'
              break
          }

          switch (item.pay_method) {
            case 1:
              item.pay_method = '银联'
              break
            case 2:
              item.pay_method = '支付宝'
              break
            case 3:
              item.pay_method = '微信'
              break
            case 4:
              item.pay_method = '现金'
              break
            case 5:
              item.pay_method = '自动支付'
              break
            default:
              item.pay_method = '无'
          }

          item.fix_price = item.use === 2 ? '无' : item.fix_price
          switch (item.use) {
            case 1:
              item.use = '补费'
              item.amount = Number(item.amount) === 0 ? item.amount : '+' + item.amount
              break
            case 2:
              item.use = '退费'
              item.amount = Number(item.amount) === 0 ? item.amount : '-' + item.amount
              break
            case 3:
              item.use = '抵扣转入'
              item.amount = Number(item.amount) === 0 ? item.amount : '+' + item.amount
              break
            case 4:
              item.use = '抵扣转出'
              item.amount = Number(item.amount) === 0 ? item.amount : '-' + item.amount
              break
            case 5:
              item.use = '第一次缴费'
              item.amount = Number(item.amount) === 0 ? item.amount : '+' + item.amount
              break
          }

          return item
        })
      }
    },
    filters: {
      twoFloatFormat
    },
    created () {
      this.init()
    },
    watch: {
      time (oldVal) {
        this.handleSelectTime(oldVal)
      }
    },
    methods: {
      // 初始化
      init () {
        this.handleDefaultTime()
        this.getCheckbillData(false, true)
      },
      // 获取账单列表数据
      getCheckbillData (page, queryFlag = false) {
        // this.handleSelectTime()
        this.loading = true
        this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

        if (queryFlag) {
          for (let key in this.queryParam) {
            this.queryParamCopy[key] = this.queryParam[key]
          }
        }

        let params = Object.assign({ page: this.pageConfig.page, page_size: this.pageConfig.per_page }, this.queryParamCopy)

        checkbillApi.queryCheckbillList(handleQueryNull(params)).then(res => {
          this.loading = false
          if (res.status_code === 200) {
            let data = res.data

            this.checkbillList = data.list
            this.refund = data.refund
            this.income = data.income
            this.pageConfig.total = data.total_count
          } else {
            this.$message.error('获取数据失败, 请稍后重试')
          }
        })
      },
      // 默认当前时间
      handleDefaultTime () {
        let time = formatDay((new Date()).valueOf())

        this.time = [time, time]
        this.handleSelectTime(this.time)
      },
      // 选择时间的处理
      handleSelectTime (time) {
        if (time) {
          this.queryParam.start_time = time[0]
          this.queryParam.end_time = time[1]
        } else {
          this.queryParam.start_time = ''
          this.queryParam.end_time = ''
        }
      },
      // 下载的URL拼接
      downloadUrlCom () {
        this.handleSelectTime()
        let queryString = `${this.downloadUrl}?api_token=${util.getToken()}`
        let queryObj = handleQueryNull(this.queryParamCopy)
        if (Object.keys(queryObj).length > 0) {
          for (let key in queryObj) {
            queryString += `&${key}=${queryObj[key]}`
          }
        }

        return queryString
      },
      // 处理下载
      handleDownload () {
        if (this.checkbillList.length > 0) {
          window.open(this.downloadUrlCom(), '_self')
        } else {
          this.$message({
            message: '没有可以下载的账单',
            type: 'warning'
          })
        }
      }
    }
  }
</script>
<style lang="less">
  .check-bill-wrap {
    text-align: left;
    width: 100%;
    padding: 0 5px;

    .cac-button-one {
      min-width: 84px;
    }
    /deep/ .el-icon-download {
      font-size: 14px;
    }
    .selectRow {
      width: 100%;
      overflow: hidden;
      margin-top: 20px;
      .selectRow__select {
        margin-right: 10px;
        width: 100px;
      }
      input, .el-date-editor {
        border-radius: 16px !important;
      }
      .el-date-editor {
        width: 240px;
      }
      .searchRow__input {
        width: 220px;
        float: right;
      }
    }
    .orderContent {
      margin-top: 20px;
    }
    .count-all {
      padding-top: 19px;
      text-align: right;

      li {
        padding-bottom: 8px;
        color: #7A808D;
        font-size: 13px;

        .count-all-name {
          font-weight: 500
        }
        .count-all-value {
          display: inline-block;
          margin-left: 20px;
          min-width: 100px;

          .count-all-value-first {
            color: #3E434C;
            font-weight: 500;
          }
        }
      }
    }
    /deep/ .el-table th {
      background-color: #F9FBFC;
    }
    /deep/ .el-table td, .el-table th.is-leaf {
      border-bottom: 1px solid #f9f9f9;
    }
  }
</style>
