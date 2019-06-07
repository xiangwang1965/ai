<template>
  <div class="my-good-list" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="good-Content">
      <Tab :tabHeader="tabHeader" :tabIndex="tabIndex" @handleTabChange="handleTab"></Tab>
      <div class="good-list">
        <div class="good-query-form selectRow">
          <div>
            <el-select
              @change="handleSelectChange"
              class="selectRow-select"
              v-model="queryParam.course_type"
              placeholder="形式"
              size="small"
              clearable>
              <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-select
              @change="handleSelectChange"
              class="selectRow-select"
              v-model="queryParam.subject_id"
              placeholder="学科"
              size="small"
              clearable>
              <el-option v-for="item in allOptions.subject" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-select
              @change="handleSelectChange"
              class="selectRow-select"
              v-model="queryParam.grade_id"
              placeholder="年级"
              size="small"
              clearable>
              <el-option v-for="item in allOptions.grade" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
            <el-select
              @change="handleSelectChange"
              class="selectRow-select"
              v-model="queryParam.term_id"
              placeholder="学期"
              size="small"
              clearable>
              <el-option v-for="item in allOptions.term" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div class="good-total">
            <span>共有<span>{{pageConfig.total}}</span>件商品</span>
            <el-button @click="handleUp('batch')" class="clearfix cac-button-two create-button" round size="mini" :icon="statusIcon">{{statusDesc}}</el-button>
          </div>
        </div>
        <div class="good-table">
          <el-table
            ref="multipleTable"
            :data="goodListCom"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">
            <el-table-column type="selection" min-width="55" align="center" :selectable="handleSelectable"></el-table-column>
            <el-table-column align="left" label="商品名称" width="300" prop="order_code" >
              <template slot-scope="scope">
                <div class="good-name">
                  <div class="good-avatar-wrap">
                    <img class="good-name-avatar" :src="scope.row.goods_img" alt="">
                    <span :class="scope.row.statusClass" style="font-size:12px;text-align:center;"><span style="transform:scale(0.8);width:42px;height:18px;display:inline-block;">{{scope.row.status_text}}</span></span>
                  </div>
                  <div class="good-name-desc">
                    <!-- <Tooltip :content="scope.row.goods_name" :width="190" :class="customClass" :innerCustomStyle="innerCustomStyle"></Tooltip> -->
                    <Tip :content="scope.row.goods_name" :size="52" :width="width" />
                    <ul>
                      <li>
                        <span>形式: {{scope.row.course_type}}</span>
                      </li>
                      <li>
                        <span>学科: {{scope.row.subject_name}}</span>
                      </li>
                      <li>
                        <span>年级: {{scope.row.grade_name}}</span>
                      </li>
                      <li>
                        <span>退费说明: {{scope.row.withdraw_ruler || '无'}}</span>
                      </li>
                    </ul>
                    <BookPrice :rulerType="scope.row.option_withdraw_ruler" :optionFee="scope.row.option_price" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="班级名称" prop="class_name" min-width="90"></el-table-column>
            <el-table-column align="center" label="主讲" prop="main_teacher" min-width="80"></el-table-column>
            <el-table-column align="center" label="辅导" prop="tutor_teacher"></el-table-column>
            <el-table-column align="center" label="单价">
              <template slot-scope="scope">
                <div style="height:125px;">{{scope.row.unit_price}}</div>
                <!-- <div>{{scope.row.option_price}}</div> -->
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量" prop="number" min-width="60"></el-table-column>
            <el-table-column align="center" label="学生人数" prop="student_number" min-width="80"></el-table-column>
            <el-table-column align="center" label="发布时间" prop="publish_time" width="70"></el-table-column>
            <el-table-column align="center" label="操作" width="200" style="margin-left:12px;">
              <template slot-scope="scope">
                <div>
                  <el-button @click="handleGoDetail(scope.row)" class="clearfix cac-button-two create-button" round size="mini">详情</el-button>
                  <el-button :disabled="scope.row.is_valid===0" v-if="tabIndex==0" @click="handleGoEdit(scope.row)" style="margin-left:0;" class="clearfix cac-button-two create-button" round size="mini">编辑</el-button>
                  <el-button :disabled="scope.row.is_valid===0" @click="handleUp('single', scope.row)" style="margin-left:0;" class="clearfix cac-button-two create-button" round size="mini">{{statusDesc}}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <Pagination :config="pageConfig" @change="handlePageChange"></Pagination>
    </div>
  </div>
</template>
<script>
import Tab from '@/components/tab/tab.vue'
import Pagination from '@/components/pagination'
import goodApi from '@/services/goods/myGood'
// import Tooltip from '@/components/tooltip/tooltip.vue'
import Tip from '@/components/order/tip.vue'
import BookPrice from '@/components/order/bookPriceCom.vue'

export default {
  data () {
    return {
      loading: false,
      showFlag: true,
      tabIndex: 1,
      statusDesc: '下架',
      statusIcon: 'iconfont icondown',
      allOptions: '',
      typeList: [
        // { id: 1, name: '双师' },
        // { id: 4, name: 'AI' }
      ],
      tabHeader: [
        { id: 1, label: '上架中商品' },
        { id: 0, label: '未上架商品' }
      ],
      queryParam: {
        course_type: '',
        subject_id: '',
        grade_id: '',
        term_id: ''
      },
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      multipleSelection: [],
      goodList: [],
      customClass: 'custom-class',
      innerCustomStyle: {
        fontWeight: 500
      },
      width: {
        width: '180px'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (typeof from.query.from_good === 'number') {
      next(vm => {
        vm.tabIndex = Number(window.sessionStorage.getItem('tabIndex'))
        vm.handleChangeDown(vm.tabIndex)
        vm.getGoodData()
        // vm.pageConfig.page =  from.query.from_good
      })
    } else {
      next()
    }
  },
  components: {
    Tab,
    Pagination,
    Tip,
    // Tooltip,
    BookPrice
  },
  created () {
    this.init()
  },
  computed: {
    goodListCom () {
      let that = this
      return this.goodList.map(item => {
        switch (item.course_type) {
          case 1:
            item.course_type = '双师'
            break
          case 4:
            item.course_type = 'AI'
            break
        }
        if (that.allOptions) {
          for (let i = 0, len = that.allOptions.subject.length; i < len; i++) {
            let subItem = that.allOptions.subject[i]

            if (subItem.key === item.subject_id) {
              item.subject_name = subItem.value
              break
            }
          }
          for (let i = 0, len = that.allOptions.grade.length; i < len; i++) {
            let gradeItem = that.allOptions.grade[i]

            if (gradeItem.key === item.grade_id) {
              item.grade_name = gradeItem.value
              break
            }
          }
        }

        switch (item.status_text) {
          case '未开课':
            item.statusClass = 'good-name-status good-name-status-bg-yellow'
            break
          case '已开课':
            item.statusClass = 'good-name-status good-name-status-bg-green'
            break
          default:
            item.statusClass = 'good-name-status good-name-status-bg-gray'
            break
        }
        item.unit_price += '元'
        // item.option_price += '元'
        return item
      })
    }
  },
  methods: {
    // 初始化
    init () {
      this.getOptionsData()
    },
    // 获取下拉框数据
    getOptionsData () {
      goodApi.getOptions({ type: 1 }).then(res => {
        if (res.status_code === 200) {
          this.allOptions = res.data.options
          this.typeList = res.data.options.xs
        }
        this.getGoodData()
      })
    },
    // 获取商品列表数据
    getGoodData (page, loadFlag = true) {
      this.loading = loadFlag
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

      let params = Object.assign(this.queryParam, {
        on_sale: this.tabIndex,
        page: this.pageConfig.page,
        page_size: this.pageConfig.per_page
      })

      goodApi.queryGoodList(this.handleQueryNull(params)).then(res => {
        this.loading = false
        if (res.status_code === 200) {
          let data = res.data

          this.goodList = data.list
          this.pageConfig.total = data.total_count
        }
      })
    },
    // 下拉框变化时获取商品列表数据
    handleSelectChange () {
      this.getGoodData(1)
    },
    // 处理Tab的切换
    handleTab (id) {
      this.tabIndex = id
      this.$refs.multipleTable.clearSelection()
      window.sessionStorage.setItem('tabIndex', this.tabIndex)

      // 清空筛选项数据
      for (let key in this.queryParam) {
        this.queryParam[key] = ''
      }

      this.getGoodData(1)
      this.handleChangeDown(this.tabIndex)
    },
    // 上下架状态切换
    handleChangeDown (val) {
      switch (val) {
        case 0:
          this.statusDesc = '上架'
          this.statusIcon = 'iconfont iconup'
          break
        case 1:
          this.statusDesc = '下架'
          this.statusIcon = 'iconfont icondown'
          break
      }
    },
    // 多选框的禁用
    handleSelectable (row, index) {
      if (row.is_valid === 0) {
        return false
      } else {
        return true
      }
    },
    // 多选商品
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 批量或单个商品上下架处理
    handleUp (type = 'single', val) {
      let len = this.multipleSelection.length

      if (len === 0 && type === 'batch') {
        this.$message({
          message: `请先选择可以${this.statusDesc}的商品`,
          type: 'warning'
        })
      } else {
        let text = type === 'batch' ? `您确定${this.statusDesc}这${len}件商品吗` : `您确定${this.statusDesc}这件商品吗`

        this.$confirm(text, '提示', {
          confirmButtonText: '确 定',
          confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
        }).then(() => {
          let params = {}
          if (len !== 0 && type === 'batch') {
            let ary = this.multipleSelection.map(item => item.id)
            params.id = ary.join(',')
          } else {
            params.id = val.id
          }
          switch (this.tabIndex) {
            case 1:
              params.sale = 0
              break
            case 2:
              params.sale = 1
              break
          }
          goodApi.postUpOrDown(params).then(res => {
            if (res.status_code === 200) {
              this.$message({
                message: `恭喜你，${this.statusDesc}成功!`,
                type: 'success'
              })
              this.getGoodData(false, false)
            } else {
              if (res.status_code === 400) {
                this.$message.error(res.message)
                return false
              }
              this.$message({
                message: `${this.statusDesc}失败, 请稍后重试!`,
                type: 'error'
              })
            }
          })
        })
      }
    },
    // 操作-详情的跳转
    handleGoDetail (val) {
      this.$router.push({ name: 'MSClassDetail', query: { class_id: val.id, class_type: 2, from_good: 1 } })
    },
    // 操作-编辑的跳转
    handleGoEdit (val) {
      this.$router.push({ name: 'MSClassEdit', query: { create: 'edit', id: val.id, type: 2, from_good: 1 } })
    },
    // 处理参数为空字符串
    handleQueryNull (obj) {
      let newObj = {}
      for (let key in obj) {
        if (obj[key] !== '') {
          newObj[key] = obj[key]
        }
      }
      return newObj
    },
    // 处理翻页
    handlePageChange () {
      window.scrollTo(0, 0)
      this.getGoodData()
    }
  }
}
</script>
<style lang="less" scoped>
.my-good-list {
  width: 100%;
  padding: 0 5px;
  text-align: left;
  .cac-bread-bar {
    .searchInput {
      position: relative;
      width: 200px;
      left: 100%;
      margin-left: -200px;
    }
  }
  .searchInput {
    width: 204px;
  }
  .selectRow-select {
    margin-right: 10px;
    width: 100px;
  }
  /deep/ .el-table .cell {
    padding: 20px 0;
    color: #3E434C;
  }
  .good-Content {
    /deep/ .el-input__inner {
      border-radius: 15px !important;
    }
    /deep/ .el-table td, .el-table th {
      vertical-align: top;
    }
    /deep/ .el-table .disabled-row {
      color: blue!important;
    }
     /deep/ .el-table .has-gutter tr .cell {
       padding: 1px 0;
     }
    .good-list {
      padding-top: 30px;

      .good-query-form {
        padding-bottom: 30px;
        display: flex;
        justify-content: space-between;

        .cac-button-two {
          min-width: 54px;
        }
        .good-total {
          font-size: 12px;
          color: #3E434C;

          > span {
            margin-right: 17px;

            span {
              color: #3C75F6;
            }
          }
        }
      }
      /deep/ .el-button .iconfont {
        font-size: 12px!important;
      }
      .good-name {
        display: flex;
        padding-bottom: 65px;

        .good-avatar-wrap {
          position: relative;

          .good-name-avatar {
            display: block;
            width: 80px;
            height: 80px;
            background: #D8D8D8;
            border-radius: 3px;
          }
          .good-name-status {
            position: absolute;
            top: 0;
            left: 0;
            width: 42px;
            height: 18px;
            line-height: 18px;
            border-radius: 0px 0px 12px 0px;
            opacity: .9;
            font-size: 10px;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: #fff;
          }
          .good-name-status-bg-gray {
            background: #7A808D;
          }
          .good-name-status-bg-green {
            background: rgba(64, 217, 128, 0.8);
          }
          .good-name-status-bg-yellow {
            background: rgba(255, 118, 65, 0.8);
          }
        }
        .good-name-desc {
          font-size: 13px;
          width: 210px;
          padding-left: 20px;

          > p{
            margin-bottom: 12px;
          }
          > ul {

            li {
              margin-bottom: 5px;
              font-size: 12px;
              color: #ABB9C6;
            }
          }
        }
      }
    }
  }
  .not-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .custom-class {
    margin-bottom: 8px;
  }
  .inner-custom-class {
    font-weight: 500;
  }
  /deep/ .book-price-wrap {
    position: absolute;
    bottom: 20px;
    z-index: 1000;
  }
  /deep/ .el-table .cell {
    line-height: 18px;
  }
  /deep/ .book-price-wrap .order-list-item-footer {
    margin: 20px 0 0 0;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  /deep/ .el-checkbox {
    padding-right: 0;
  }
  /deep/ .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: hidden;
  }
  /deep/ .el-table .row {
    background: #fff !important;
  }
  /deep/ .el-table  .el-table__body  tr.hover-row>td {
    background: #fff!important
  }
}
</style>
