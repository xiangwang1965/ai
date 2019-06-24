<template>
  <div class="classContainer content_right">
    <div class="content1">
        <p class="content_title">课程订单</p>
        <div class="left_content ">
            <div class="tab_blue">
                <ul>
                    <li class="tab_item" :class="{tab_active:activeTab == item.id}" :key="t" v-for="(item,t) in tabList" @click="tabHandle(item.id)">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <div class="orderListBox" id="orderListBox">
                <div class="orderList" style="display: block" v-scrollBar>
                    <div class="order_Item" :key="i" v-for = "(item,i) in list">
                        <div class='order_header'>
                            <span>订单号:{{item.orderNo}}</span>
                            <span v-if="item.status == 1">交易成功</span>
                            <span v-if="item.status == 0">待支付</span>
                            <span v-if="item.status == 2">作废</span>
                        </div>
                        <div class="order_con">
                            <div class="con_left">
                                SCRATH
                            </div>
                            <div class="con_right">
                                <div class="row" style="font-size: 0.12rem">
                                    <span>{{item.orderName}}</span>
                                </div>
                                <div class="row">
                                    <span>校区：{{item.schoolName}}</span>
                                </div>
                                <div class="row">
                                    <span>课时</span>
                                    <span>合计：￥{{item.totlaPic}}</span>
                                </div>
                                <div class="row">
                                    <span></span>
                                    <span>交易时间：{{item.tradeTime}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="content2">
        <div class="content_title">
            课程列表
        </div>
        <div class="right_content " style="height: 6.67rem">
            <!-- <img src="../img/order.png" alt="" class="center_img"> -->
        </div>
    </div>
  </div>
</template>
<script>
import courseApi from "@/services/course";
export default {
  data() {
    return {
    queryCourseType:1, // 0 wei'sh
    tabList:[
          {
              id:'1',
              name:'全部订单'
          },
          {
              id:'2',
              name:'进行订单'
          },
          {
              id:'3',
              name:'历史订单'
          }
      ],
      activeTab:'1',
      list:[],
      url: require("../../../static/img/minipic.png")
    };
  },
  created() {
    this.getData();
    this.queryCourseInfo(this.queryCourseType);
  },
  methods: {
    courseInfoHandle(flag) {
        this.queryCourseType = this.flag ? 1: 0;
        this.queryCourseInfo(this.queryCourseType);
    },
    queryCourseInfo(state) {
        let params = {
            state:state
        }
        courseApi.queryCourseInfo(params).then(res=>{
            console.log(res);
        })
    },
    getData(index) {
        let params ={
            typeid : index || '1'
        }
      courseApi.queryOrders(params).then(res => {
          if (res.code === '001') {
              this.list = res.data;
          }
      });
    },
    tabHandle(index) {
        this.activeTab = index;
        this.getData(index);
    }
  }
};
</script>
<style lang="less" scoped>
.classContainer {
  .orderListBox{
      height:100%;
    .orderList{
        height:100%;
        position:relative;
        .order_Item{
            width: 4.5rem;
            height: 1.26rem;
            border-radius: 0.15rem;
            background: #fff;
            margin-bottom: 0.21rem;
            margin-top:0.2rem;
            .order_header{
                height: 0.26rem;
                border-bottom: 0.01rem solid #D8D8D8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.12rem;
                color:#4A4A4A;
                span:nth-child(1){
                    padding-left:0.11rem;
                }
                span:nth-child(2){
                    padding-right: 0.18rem;
                }
            }
            .order_con{
                display: flex;
                padding:0.1rem 0.11rem 0 0.11rem;
                .con_left{
                    width: 0.74rem;
                    height: 0.74rem;
                    background: #FFC151;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color:#fff;
                    font-size: 0.12rem;
                }
                .con_right{
                    flex:1;
                    margin-left:0.09rem;
                    .row{
                        display: flex;
                        justify-content: space-between;
                        color:#9B9B9B;
                        font-size: 0.1rem;
                    }
                }
            }
        }
    }
}
.right_content{
    display: flex;
    align-items: center;
    justify-content: center;
    .center_img{
        width: 2.64rem;
        height: 1.67rem;
        display: block;
    }
}
}
</style>
