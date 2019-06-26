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
    <div class="content2" style="width:6rem;">
        <div class="content_title">
            课程列表
        </div>
        <div class="right_content" style="height: 6.47rem;display: block;overflow: hidden;padding-bottom: 0.2rem;">
                <div class="tab_blue">
                    <ul>
                        <li class="tab_item" :class="{tab_active:queryCourseType == item.id}" :key="t" v-for="(item,t) in righttabList" @click="courseInfoHandle(item.id)">
                            {{item.name}}
                        </li>
                    </ul>
                </div>
                <div class="class_list" style="display: block" v-scrollBar>
                <div class="class_item" :key="i" v-for = "(item,i) in courseList">
                    <div class="class_text">
                        <p class="class_text_row">
                            <span class="class_level">{{item.name}}</span>
                            <span class="class_teacher">使用数量：{{item.cnt}}</span>
                        </p>
                    </div>
                </div>
            </div>
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
       righttabList:[
          {
              id:'1',
              name:'已使用'
          },
          {
              id:'0',
              name:'未使用'
          }
      ],
      activeTab:'1',
      list:[],
      url: require("../../../static/img/minipic.png"),
      courseList:[],
    };
  },
  created() {
    this.getData();
    this.queryCourseInfo(this.queryCourseType);
  },
  methods: {
    courseInfoHandle(id) {
        this.queryCourseType = id;
        this.queryCourseInfo(this.queryCourseType);
    },
    queryCourseInfo(state) {
        let params = {
            state:state
        }
        courseApi.queryCourseInfo(params).then(res=>{
           this.courseList = res.data;
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
   .right_content {
       display:block;
   }
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
    .center_img{
        width: 2.64rem;
        height: 1.67rem;
        display: block;
    }
}
}

        .class_list {
          position: relative;
          margin-top:0.2rem;
          .class_item {
            // width: 4.35rem;
            height: 0.68rem;
            background: #fff;
            box-shadow: 0 0 0.01rem 0 rgba(0, 0, 0, 0.5);
            border-radius: 0.2rem;
            font-size: 0.16rem;
            box-sizing: border-box;
            margin-left: 0.02rem;
            margin-right: 0.02rem;
            margin-bottom: 0.21rem;
            overflow: hidden;
            position: relative;
            .fixed_lock {
              position: absolute;
              width: 0.21rem;
              height: 0.2rem;
              right: 0.33rem;
              top: 0.25rem;
            }
            .class_text {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 10;
              width: 90%;
              .class_text_row {
                display: flex;
                justify-content: space-between;
                width: 100%;
                .class_name {
                  font-size: 0.16rem;
                  color: #5c5c5c;
                }
                .class_time,
                .class_level,
                .class_teacher {
                  font-size: 0.14rem;
                  color:  #5c5c5c;
                }
              }
            }
          }
          .class_dis {
            background: #e7eeff;
          }
          .class_fixed {
            width: 1.2rem;
            height: 1.2rem;
            border-radius: 100%;
            position: absolute;
            top: -0.7rem;
            left: -0.5rem;
            z-index: 1;
          }
          .class_item_yellow {
            .class_fixed {
              background: #ffc96b;
              opacity: 0.4;
            }
          }
          .class_item_blue {
            .class_fixed {
              background: #a2efff;
              opacity: 0.4;
            }
            .class_text {
              .class_text_row {
                .class_time,
                .class_level,
                .class_teacher {
                  color: #6edbef;
                }
              }
            }
          }
          .class_item_red {
            .class_fixed {
              background: #ff696c;
              opacity: 0.4;
            }
            .class_text {
              .class_text_row {
                .class_time,
                .class_level,
                .class_teacher {
                  color: #ff696c;
                }
              }
            }
          }
          .class_item_purple {
            .class_fixed {
              background: #8b90ff;
              opacity: 0.4;
            }
            .class_text {
              .class_text_row {
                .class_time,
                .class_level,
                .class_teacher {
                  color: #8b90ff;
                }
              }
            }
          }
          .nodata {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            color: #ccc;
          }
        }
</style>
