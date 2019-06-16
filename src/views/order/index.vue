<template>
  <div class="classContainer">
    <div class="left">
      <h1 class="title">我的订单</h1>
      <div class="sideContainer">
        <div class="item">
          <div class="tabs">
            <div>
              <span :class="{active:activeTab == item.id}" :key="t" v-for="(item,t) in tabList" @click="tabHandle(item.id)">{{item.name}}</span>
            </div>
          </div>
          <div class="classList">
              <div class="order" :key="i" v-for = "(item,i) in list" @click="getOrderDetail(item.orderNo)">
                <div class="num">
                  <p class="orderNum">
                    订单编号：
                    <span>{{item.orderNo}}</span>
                  </p>
                  <p class="state" v-if="item.status == '0'">进行中</p>
                    <p class="state" v-else-if="item.status == '2'">作废</p>
                      <p class="state" v-else>已完成</p>
                    <div class="clearfix"></div>
                </div>
                <div class="orderContent">
                  <img class="contentPic" :src="url" alt>
                  <div class="contentL">
                    <p class="class">{{item.courseName}}</p>
                    <p class="school">校区：{{item.schoolName}}</p>
                    <p class="school"><span>课时：{{item.hourNum}}</span><span class="right">合计：<i>￥{{item.totlaPic}}</i></span></p>
                    <p style="text-align:right" class="time">交易时间：{{ item.tradeTime }}</p>
                    <div class="clearfix"></div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right show" v-if="orderDetail.isShow">
        <div class="orderDetailContent">
            <div class="orderNo">订单号：{{ orderDetail.orderNo }}</div>
            <div class="courseName">课程：{{ orderDetail.courseName }}</div>
            <div class="hourName">{{ orderDetail.hourName }}</div>
        </div>
    </div>
    <div class="right" v-else>
        <!-- TODO 图片的地址有问题-->
        <img class="orderImg" src="../../../static/img/minipic.png" alt="">
        <p class="orderTip">选择订单查看详情</p>
    </div>
  </div>
</template>
<script>
import orderApi from "@/services/order";
export default {
  data() {
    return {
        tabList: [
        {
            id: '1',
            name: '全部订单'
        },
        {
            id: '2',
            name: '进行订单'
        },
        {
            id: '3',
            name: '历史订单'
        }],
        activeTab: '1',
        list: [],
        url: require("../../../static/img/minipic.png"), // TODO 图片的地址有问题
        orderDetail: {
            isShow: false
        }
    };
  },
  created () {
    this.getData();
  },
  methods: {
    getData (index) {
        let params = {
            typeid: index || '1'
        };
        orderApi.queryOrders(params).then(res => {
          if (res.code === '001') {
              res.data.forEach(item => {
                  item.tradeTime = this.formatDate(item.tradeTime);
              });
              this.list = res.data;
              this.orderDetail.isShow = false;
          }
        });
    },
    tabHandle (index) {
        this.activeTab = index;
        this.getData(index);
    },
      getOrderDetail (orderNo) {
        const params = {
            typeid: '4',
            orderNo
        };
        orderApi.queryOrders(params).then(res => {
            if (res.code === '001') {
                this.orderDetail = res.data;
                this.orderDetail.isShow = true;
            }
        });
    },
      formatDate: function (tradeTime) {
          if (tradeTime && tradeTime.length === 14) {
              return `${tradeTime.substr(0, 4)}-${tradeTime.substr(4, 2)}-${tradeTime.substr(6, 2)} ${tradeTime.substr(8, 2)}:${tradeTime.substr(10, 2)}`;
          }
          return '未完成';
      }
  }
};
</script>
<style lang="less" scoped>
.classContainer {
    display: flex;
    text-align: left;
    height: 100%;
    overflow: auto;
    .left {
        width: 5.12rem;
        position: relative;
        border-right: 1px solid #ccc;
        .sideContainer {
            width: 4.5rem;
            .tabs {
                margin: 0.2rem 0;
                border-bottom: .03rem solid #4592fe;
                div {
                    span {
                        display: inline-block;
                        width: 1.02rem;
                        height: .44rem;
                        line-height: .44rem;
                        text-align: center;
                        color: #fff;
                        background-color: #aacdff;
                        border-radius: 0.06rem 0.06rem 0 0;
                        cursor: pointer;
                        &.active {
                            background-color: #4592fe;
                        }
                    }
                }
            }
            .classList {
                max-height: 6rem;
                overflow: auto;
                .order {
                    margin-top: .2rem;
                    width: 100%;
                    border-radius: .15rem;
                    background-color: #fff;
                    cursor: pointer;
                    &:nth-child(1) {
                        margin-top: 0;
                    }
                    .num {
                        padding: 0 .1rem;
                        height: .26rem;
                        line-height: .26rem;
                        border-bottom: 1px solid #d8d8d8;
                        .orderNum {
                            float: left;
                        }
                        .state {
                            float: right;
                        }
                    }
                    .orderContent {
                        padding: .1rem .1rem .15rem;
                        position: relative;
                        .contentPic {
                            position: absolute;
                            top: 50%;
                            left: .1rem;
                            margin-top: -.37rem;
                            width: .74rem;
                            height: .74rem;
                        }
                        .contentL {
                            padding-left: .84rem;
                            font-size: .12rem;
                            .class {
                                font-size: .16rem;
                                font-weight: bold;
                            }
                            .school{
                                .right {
                                    float: right;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .right {
        margin-left: .3rem;
        flex: 1;
        text-align: center;
        &.show {
            text-align: left;
            border-radius: .3rem;
            background-color: #fff;
        }
        .orderImg {
            margin-top: 2.5rem;
            width: 1.14rem;
            height: 1.22rem;
        }
        .orderTip {
            font-size: .3rem;
            color: #d8d8d8;
        }
        .orderDetailContent {
            padding: .4rem;
            .orderNo {
                margin-bottom: .3rem;
                font-size: .18rem;
                font-weight: bold;
            }
            .courseName {
                margin-bottom: .1rem;
                line-height: .3rem;
                font-size: .16rem;
            }
            .hourName {
                padding: .1rem;
                border: 1px solid #c6c6c6;
            }
        }
    }
}
</style>
