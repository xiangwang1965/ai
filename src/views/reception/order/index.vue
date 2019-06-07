<template>
  <div class="order-list-wrap" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="billContent">
      <div style="display:flex;justify-content:space-between;">
        <Tab :tabHeader="tabHeader" :tabIndex="tabIndex" @handleTabChange="handleTab"></Tab>
        <el-input class="searchInput" placeholder="请输入商品名称" size="small" @keyup.enter.native="getOrderData(1, true)" v-model.trim="key">
          <i class="el-icon-search el-input__icon" slot="suffix" @click="getOrderData(1, true)"></i>
        </el-input>
      </div>
      <div class="order-list">
        <div class="order-list-header">
          <span v-for="item in tableHeader" :key="item.id" :class="item.class">{{item.label}}</span>
        </div>
        <ul class="order-list-content"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
          <li class="order-list-item" v-for="(item) in orderListCom" :key="item.id">
            <div class="order-list-item-title">
              <div class="order-list-item-title-num">
                <span>订单编号：</span>
                <span>{{item.order_code}}</span>
              </div>
              <div class="order-list-item-title-time">
                <span>下单时间：</span>
                <span>{{item.order_time}}</span>
              </div>
            </div>
            <div class="order-list-item-content">
              <div class="order-list-item-content-detail order-list-header-row1">
                <img class="avatar" :src="item.goods[0].goods_icon" alt="">
                <div class="order-list-item-content-desc">
                  <Tip :content="item.goods[0].goods_name" :size="54" :width="width">
                    <span slot="order" class="content-desc-type">{{item.goods[0].goods_type}}</span>
                  </Tip>
                  <ul class="">
                    <!-- <li v-for="it in item.goodsNew" :key="it.id">
                      <span>{{it.label}}:&nbsp;</span>
                      <Tooltip :content="it.value" :width="150" :class="customClass"></Tooltip>
                    </li> -->
                     <li>
                      <span>班级名称：</span>
                      <span>{{item.goods[0].class_name}}</span>
                    </li>
                    <li>
                      <span>主讲：</span>
                      <span>{{item.goods[0].main_teacher}}</span>
                    </li>
                    <li>
                      <span>辅导：</span>
                      <span>{{item.goods[0].tutor_teacher}}</span>
                    </li>
                    <li>
                      <span>日期：</span>
                      <span>{{item.goods[0].date_span}}</span>
                    </li>
                    <div v-if="item.showFlag">
                      <li>
                        <span>时间：</span>
                        <span>{{item.goods[0].time_span}}</span>
                      </li>
                      <li>
                        <span>校区：</span>
                        <span>{{item.goods[0].campus_name}}</span>
                      </li>
                      <li>
                        <span>教室：</span>
                        <span>{{item.goods[0].room_name}}</span>
                      </li>
                      <li>
                        <span>讲次：</span>
                        <span>共{{item.goods[0].lesson_counts}}讲/剩余{{item.goods[0].remain_lesson_counts}}讲</span>
                      </li>
                      <li>
                        <span>退费说明：</span>
                        <span>{{item.goods[0].goods_withdraw_ruler_type}}</span>
                      </li>
                    </div>
                  </ul>
                  <li style="cursor:pointer;color:#7A808D;font-weight:400;padding-top:2px;">
                    <span v-if="item.showFlag" @click="item.showFlag=!item.showFlag">收起更多<i class="el-icon-caret-top"></i></span>
                    <span v-else @click="item.showFlag=!item.showFlag">展开更多<i class="el-icon-caret-bottom"></i></span>
                  </li>
                </div>
              </div>
              <div class="order-list-item-content-price order-list-header-row2">
                <span>{{item.goods[0].goods_unit_price | twoFloatFormat}}<span> 元</span></span>
              </div>
              <div class="order-list-item-content-student order-list-header-row3">
                <ul>
                  <li>
                    <span>ID: </span>
                    <span>{{item.student_id}}</span>
                  </li>
                  <li>
                    <span>姓名: </span>
                    <span>{{item.student_name}}</span>
                  </li>
                  <li>
                    <span>电话: </span>
                    <span>{{item.student_phone}}</span>
                  </li>
                </ul>
              </div>
              <div class="order-list-item-content-status order-list-header-row4">
                <span v-if="item.pay_status==2">交易成功</span>
                <span v-if="item.pay_status==3" style="color:#FF8D41">交易关闭</span>
                <span v-if="item.pay_status==1" style="color:#FF8D41">等待买家付款</span>
                <span v-if="item.pay_status==4" style="color:#FF8D41">交易失败</span>
              </div>
              <div class="order-list-item-content-get order-list-header-row5">
                <div class="order-list-item-content-get-num">
                  <span>{{item.pay_all_price | twoFloatFormat}}</span>
                  <span>元</span>
                </div>
                <div class="order-list-item-content-get-type" :style="{'padding-top' : item.pay_method!=0 ? '8px' : '0'}">
                  <span v-if="item.pay_method!=0">{{item.pay_method}}</span>
                </div>
                <div style="padding-top:14px;"  @click="handleEditPrice(item)">
                   <el-button v-if="item.price_has_changed" class="clearfix cac-button-two create-button" round size="mini" style="min-width:72px;">
                     <span>详情</span>
                   </el-button>
                  <el-button v-if="(item.pay_status==1 || item.pay_status==2) && (!item.price_has_changed && item.pay_status==1)" class="clearfix cac-button-two create-button" round size="mini" style="min-width:72px;">
                     <span>修改价格</span>
                   </el-button>
                </div>
              </div>
            </div>
            <!-- <div class="order-list-item-footer">
              <div class="order-list-item-footer-book">
                <span>书本费&nbsp;&nbsp; </span>
                <span>(退费说明: {{item.goods[0].option_withdraw_ruler_type}})</span>
              </div>
              <div>{{item.origin_option_fee | twoFloatFormat}} 元</div>
            </div> -->
            <BookPrice :rulerType="item.goods[0].option_withdraw_ruler_type" :optionFee="item.origin_option_fee" />
          </li>
        </ul>
        <div v-if="orderList.length===0" class="empty-data">
          暂无数据
        </div>
      </div>
      <Pagination :config="pageConfig" @change="getOrderData"></Pagination>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="priceDialogVisible"
        width="30%"
        :before-close="handleClose"
        center>
        <el-form :model="editPrice" :rules="rules" ref="editPrice">
            <ul class="dialog-table">
              <li>
                <span>商品名称</span>
                <span>实际单价(元)</span>
                <span>修改价格(元)</span>
              </li>
              <li>
                <span style="word-break:break-all;" v-if="dialogItem">{{dialogItem.goods[0].goods_name}}</span>
                <span v-if="dialogItem">{{dialogItem.origin_class_fee}}</span>
                <span v-if="dialogItem && dialogItem.price_has_changed === 1">{{dialogItem.class_fee}}</span>
                <span v-if="dialogItem && dialogItem.price_has_changed != 1">
                  <el-form-item prop="class_fee">
                    <InputNumber v-model.trim="editPrice.class_fee" :min="0" :isFloat="true"  :width="'120px'" :height="'30px'" ></InputNumber>
                  </el-form-item>
                </span>
              </li>
              <li class="dialog-book-price">
                <span>书本费</span>
                <span v-if="dialogItem">{{dialogItem.origin_option_fee}}</span>
                <span v-if="dialogItem && dialogItem.price_has_changed === 1">{{dialogItem.option_fee}}</span>
                <span v-if="dialogItem && dialogItem.price_has_changed != 1">
                  <el-form-item prop="option_fee">
                    <InputNumber v-model.trim="editPrice.option_fee" :min="0" :isFloat="true"  :width="'120px'" :height="'30px'" ></InputNumber>
                  </el-form-item>
                </span>
              </li>
            </ul>
        </el-form>
        <span v-if="dialogItem && dialogItem.price_has_changed != 1" slot="footer" class="dialog-footer">
          <el-button class="cac-button-two dialog_cancel_button is-round" @click="handleCancel">取 消</el-button>
          <el-button :loading="editPriceLoad" class="cac-button-one dialog_confirm_button is-round" type="primary" @click="handlePriceSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Tab from '@/components/tab/tab.vue'
// import Tooltip from '@/components/tooltip/tooltip.vue'
import Tip from '@/components/order/tip.vue'
import BookPrice from '@/components/order/bookPriceCom.vue'
import InputNumber from '@/components/inputNumber.vue'
import Pagination from '@/components/pagination'
import orderApi from '@/services/reception/order'
import { twoFloatFormat, requireAgainPage } from '@/utils'

export default {
  data () {
    let checkClassFee = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入修改价格'))
      } else {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (/^\./.test(value)) {
            callback(new Error('请输入数字'))
          }
          if (value > 9999999.99) {
            callback(new Error('最大只能为9999999.99'))
          }
          if (value < 0) {
            callback(new Error('最小只能为0'))
          }
          callback()
        }
      }
    }
    return {
      loading: false,
      priceDialogVisible: false,
      editPriceLoad: false,
      dialogTitle: '修改价格',
      dialogItem: '',
      tabIndex: 0,
      key: '',
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      editPrice: {
        class_fee: '',
        option_fee: ''
      },
      tabHeader: [
        { id: 0, label: '全部订单' },
        { id: 1, label: '等待买家付款' },
        { id: 2, label: '成功的订单' }
      ],
      tableHeader: [
        { id: 1, label: '商品名称', class: 'order-list-header-row1' },
        { id: 2, label: '单价', class: 'order-list-header-row2' },
        { id: 3, label: '学生信息', class: 'order-list-header-row3' },
        { id: 4, label: '交易状态', class: 'order-list-header-row4' },
        { id: 5, label: '实收', class: 'order-list-header-row5' }
      ],
      orderList: [],
      rules: {
        class_fee: [
          { validator: checkClassFee, trigger: 'blur' }
        ],
        option_fee: [
          { validator: checkClassFee, trigger: 'blur' }
        ]
      },
      customClass: 'custom-class',
      width: {
        width: '200px'
      }
    }
  },
  components: {
    Tab,
    // Tooltip,
    Tip,
    BookPrice,
    InputNumber,
    Pagination
  },
  computed: {
    orderListCom () {
      return this.orderList.map((item, index) => {
        switch (item.goods[0].goods_type) {
          case 1:
            item.goods[0].goods_type = '双师'
            break
          case 4:
            item.goods[0].goods_type = 'AI'
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
        }

        switch (item.goods[0].goods_withdraw_ruler_type) {
          case 1:
            item.goods[0].goods_withdraw_ruler_type = '根据未上讲次退费'
            break
          case 2:
            item.goods[0].goods_withdraw_ruler_type = '报名后不退'
            break
          case 3:
            item.goods[0].goods_withdraw_ruler_type = '开课后不退'
            break
          case 4:
            item.goods[0].goods_withdraw_ruler_type = `前${item.goods[0].goods_withdraw_ruler_amount}讲退班，全额退费`
            break
          case 5:
            item.goods[0].goods_withdraw_ruler_type = `后${item.goods[0].goods_withdraw_ruler_amount}讲退班，不退费用`
            break
        }

        switch (item.goods[0].option_withdraw_ruler_type) {
          case 0:
            item.goods[0].option_withdraw_ruler_type = '报名后不退'
            break
          case 1:
            item.goods[0].option_withdraw_ruler_type = '开课后不退'
            break
        }
        this.$set(item, 'showFlag', false)
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
  methods: {
    // 初始化
    init () {
      this.getOrderData()
    },
    // 获取订单列表数据
    getOrderData (page, queryFlag = false, loadFlag = true) {
      this.loading = loadFlag
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page
      let params = {
        pay_status: this.tabIndex,
        key: this.key,
        page: this.pageConfig.page,
        page_size: this.pageConfig.per_page
      }

      orderApi.queryOrderList(params).then(res => {
        this.loading = false
        if (res.status_code === 200) {
          this.orderList = res.data.list
          this.pageConfig.total = res.data.total_count
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getOrderData()
          }
        } else {
          this.$message.error('获取数据失败, 请稍后重试')
        }
      })
    },
    // tab切换
    handleTab (id) {
      this.tabIndex = id
      this.key = ''
      this.getOrderData(1)
    },
    // 修改价格或者查看详细价格
    handleEditPrice (val) {
      this.dialogItem = val
      if (val.price_has_changed) {
        this.dialogTitle = '详细价格'
      } else {
        this.dialogTitle = '修改价格'
      }
      this.priceDialogVisible = true
    },
    // 提交修改价格表单或详情时关闭弹窗
    handlePriceSubmit () {
      if (this.dialogItem.price_has_changed) {
        this.priceDialogVisible = false
        return false
      }
      this.$refs['editPrice'].validate((valid) => {
        if (valid) {
          this.editPriceLoad = true
          let params = {
            order_code: this.dialogItem.order_code
          }
          orderApi.postChangePrice(Object.assign(params, this.editPrice)).then(res => {
            this.editPriceLoad = false
            if (res.status_code === 200) {
              this.$refs['editPrice'].resetFields()
              this.priceDialogVisible = false
              this.$message({
                message: '恭喜你，修改价格成功!',
                type: 'success'
              })
              this.getOrderData(false, false, false)
            } else {
              if (res.status_code === 400) {
                this.$message.error(res.message)
                return false
              }
              this.$message.error('修改失败, 请稍后重试')
            }
          })
        }
      })
    },
    // 处理点击取消按钮
    handleCancel () {
      this.priceDialogVisible = false
      this.$refs['editPrice'].resetFields()
    },
    // 关闭对话框前置空表单
    handleClose (done) {
      this.$refs['editPrice'].resetFields()
      done()
    }
  }
}
</script>
<style lang="less" scoped>
.order-list-wrap {
  width: 100%;
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
  .billContent {
    /deep/ .el-input__inner {
      border-radius: 15px !important;
    }
    .order-list {
      padding-top: 30px;

      .empty-data {
        width: 100%;
        height: 100px;
        line-height: 200px;
        text-align: center;
        color: #909399;
      }
      .order-list-header {
        width: 100%;
        height: 50px;
        background: #F9FBFC;
        font-size: 13px;
        color: #7A808D;
        display: inline-flex;
        align-items: center;
        text-align: center;
        padding: 0 20px;
      }
      .order-list-header-row1 {
        text-align: left;
        flex: 32%;
      }
      .order-list-header-row2 {
        flex: 20%;
      }
      .order-list-header-row3 {
        text-align: left;
        padding-left: 30px;
        flex: 20%;
      }
      .order-list-header-row4 {
        flex: 20%;
      }
      .order-list-header-row5 {
        flex: 20%;
      }
      .order-list-content {
        width: 100%;

        .order-list-item {
          padding-bottom: 40px;

          // &:hover {
          //   background: #f5f7fa;
          // }
          .order-list-item-title {
            font-size: 12px;
            font-weight: 500;
            color: #3E434C;
            padding: 0 20px;
            height: 40px;
            display: flex;
            align-items: center;
            background: #F4FAFF;

            .order-list-item-title-num {
              margin-right: 40px;
            }
            span {
              font-weight: 500;
            }
          }
        }
        .avatar {
          width: 80px;
          height: 80px;
          background: lightgray;
          border-radius: 3px;
          margin-right: 20px;
          display: block;
          flex-shrink: 0;
        }
        .order-list-item-content {
          display: flex;
          padding: 20px 20px 0 20px;
          text-align: center;
          color: #3E434C;
          font-size: 13px;

          .order-list-item-content-detail {
            display: flex;

            .order-list-item-content-desc {
              font-size: 12px;
              color: #ABB9C6;

              .content-desc-type {
                display: inline-block;
                width: 32px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                background: #58E0AC;
                border-radius: 4px;
                color: #fff;
                margin-right: 4px;
              }
              .content-desc-title {
                font-size: 13px;
                font-weight: 500;
                color: #3E434C;
                // display: inline-block;
                width: 180px;
                // padding-top: 3px;
                word-break: break-all;
              }
              > p {
                margin-bottom: 12px;
              }
              > ul {
                li {
                  // display: inline-flex;
                  padding-bottom: 2px;
                  line-height: 16px;
                }
              }
            }
          }
          .order-list-item-content-student {
            text-align: left;
            padding-left: 30px;
            line-height: 18px;
            font-weight: 400;

            > ul
            {
              > li {
                padding-bottom: 4px;
              }
            }
          }
          .order-list-item-content-get {
            .order-list-item-content-get-num {
              font-size: 14px;
              font-weight: 600;
              // padding-bottom: 8px;
            }
            .order-list-item-content-get-type {
              color: #7A808D;
              font-size: 12px;
              font-weight: 400;
              // margin-top: 8px;
            }
          }
          .order-list-item-content-desc-default {
            height: 80px;
            overflow: hidden;
          }
          .order-list-item-content-desc-active {
            height: auto;
          }
        }
        .order-list-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FAFCFD;
          width: 390px;
          height: 61px;
          margin: 15px 0 0 120px;
          padding: 0 20px;
          position: relative;

          &:before {
            display: block;
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-bottom: 5px solid #FAFCFD;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            top: -5px;
            left: 38px;
          }
          .order-list-item-footer-book {
            span {
              &:last-child {
                color: #7A808D;
              }
            }
          }
        }
      }
    }
  }
  .dialog-table {
    width: 100%;
    > li {
      min-height: 60px;
      line-height: 20px;
      display: flex;
      align-items: center;
      padding: 0 30px;

      span {
        width: 30%;
        display: inline-block;
        text-align: center;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          width: 40%;
          text-align: right;
        }
      }
      &:first-child {
        color: #7A808D;
        background: #F9FBFC;
        text-align: left;
      }
      &:last-child {
        // width: 40%;
        text-align: right;
      }
    }
    .dialog-book-price {
      padding-top: 20px;
    }

  }
  .custom-class {
    margin-bottom: 2px;
  }
  .inputNumber input {
    height: 20px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
