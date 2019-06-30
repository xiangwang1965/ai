<template>
  <section class="report-detail" v-loading="loading">
    <p class="report_title">
      <img src="../../../static/image/course_icon.png">
      <span>课程总览</span>
    </p>

    <section class="report-detail-header" >
      <img :src="icons.arrowLeft" @click="goBack">
      <span>{{ detail.name }} </span>
    </section>

    <section class="report-detail-content" >
      <div v-if="detail.desc">
        <h4 class="report-detail-title">简介</h4>
        <p class="report-detail-desc">{{ detail.desc }}</p>
      </div>

      <!-- <div>
        <h4 class="report-detail-title">课程简介</h4>
        <p class="report-detail-desc">{{ detail.desc }}</p>
      </div> -->

      <div>
        <!-- <h4 class="report-detail-title">课时列表</h4> -->
        <div class="class_infomation">
          <div class="item3">
            <span class="item_txt">课程对象</span>
            <span class="item_num">{{ detail.teaching }}</span>
          </div>
          <div class="item3">
            <span class="item_txt">上课形式</span>
            <span class="item_num">{{ detail.learntype }}</span>
          </div>
          <div class="item3">
            <span class="item_txt">学习时长</span>
            <span class="item_num">{{ detail.learntime }}</span>
          </div>
        </div>
        <img src="../../../static/image/detail_title.png" alt="" class="detaill_titleimg">
        <div class="report-title">课程大纲</div>
        <div class="line_boxs">
          <div class="line_boxs_item_01"></div>
          <div class="line_boxs_item_02"></div>
          <div class="line_boxs_item_03"></div>
        </div>
        <div class="report-list">
          <div class="report-list-child report-list-title">
            <span>序号</span>
            <span>课程主题</span>
            <span>课程内容</span>
            <span>知识点</span>
            <!-- <span>基本指令</span> -->
          </div>
          <div class="report-list-child" v-for="(item, index) in detail.list" :key="index">
            <span>{{ index+1 }}</span>
            <span>{{ item.name }}</span>
             <span>{{ item.content }}</span>
              <span v-html="item.point"></span>
              <!-- <span>{{ item.detail }}</span> -->
          </div>
        </div>
      </div>
      <div>
        <h4 class="report-detail-title">课程集锦</h4>
        <template>
          <el-carousel :interval="4000" type="card" height="200px" style="margin-top:0.4rem">
           <el-carousel-item v-for="(it,index) in imgList" :key="index">
              <img :src="it" alt="" style="width:100%;height:100%;display:block">
            </el-carousel-item>
          </el-carousel>
        </template>
      </div>
    </section>
  </section>
</template>



<script>
import reportApi from "@/services/report";

export default {
  data() {
    return {
      level: 1,
      detail: {},
      loading: true,
      icons: {
        arrowLeft: require("../../../static/image/arrow_fff.png")
      },
      imgList:[
        require('../../../static/image/show1.jpeg'),
        require('../../../static/image/show2.jpeg'),
        require('../../../static/image/show1.jpeg'),
        require('../../../static/image/show2.jpeg'),
      ]
    };
  },
  created() {
    let pathParams = this.$route.params;
    let queryParams = this.$route.query;
    this.level = queryParams.level || this.level;
    
    reportApi
      .getCoursesDetail({
        sourseId: pathParams.id
      })
      .then(res => {
        console.log(res)
        if (res.code == "001") {
          this.loading = false;
          this.detail = res.data;
        }
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.report-detail {
  width: 100%;
  padding:0.27rem;
  .report_title {
    display: flex;
    justify-items: center;
    height: 0.3rem;
    margin-bottom: 0.5rem;
    line-height: 0.3rem;

    img {
      width: 0.3rem;
      height: 0.3rem;
    }

    span {
      margin-left: 6px;
      line-height: inherit;
    }
  }

  .report-detail-header {
    // width: 10.75rem;
    height: 0.6rem;
    margin-bottom: 0.1rem;
    padding-left: 0.2rem;

    text-align: left;
    line-height: 0.6rem;
    font-size: 0.17rem;
    color: #fff;

    background: #4B92F8;
    border-radius: 0.06rem 0.06rem 0px 0px;
    box-sizing: border-box;

    img {
      width: 0.3rem;
      height: 0.17rem;
      margin-right: 0.2rem;

      transform: rotate(90deg);
      transform-origin: center;

      cursor: pointer;
    }
  }

  .report-detail-content {
    overflow: scroll;
    //width: 10.75rem;
    height: 5.5rem;
    padding: 0.3rem 0.5rem;

    background: #fff;
    border-radius: 0.06rem;
    box-sizing: border-box;

    .report-detail-title {
      width: 2.6rem;

      text-align: left;
      line-height: 0.2rem;
      font-size: 0.18rem;
      color: #4B92F8;
      letter-spacing: 0.05rem;

      border-bottom: 0.02rem solid #4B92F8;
    }

    .report-detail-desc {
      margin-top: 0.08rem;
      margin-bottom: 0.36rem;

      text-align: left;
      font-size: 0.17rem;
      color: #000;
      letter-spacing: 0;
    }

    .report-list {
      margin-top: 0.3rem;
      margin-bottom: 0.36rem;
      text-align: left;
      box-sizing: border-box;
      border: solid 0.01rem #dcdcdc;
      padding: 0.24rem 0.30rem 0.35rem 0.3rem;
      .report-list-child {
        display: flex;
        span {
          padding:0.1rem;
          display: inline-block;
          line-height: 0.26rem;
          font-size: 0.18rem;
          // margin:0.05rem;
          color:rgb(102,102,102);
          display: flex;
          align-items: center;
        }

        span:nth-child(1) {
          width: 0.4rem;
        }
        span:nth-child(2) {
          width: 1.28rem;
        }
        span:nth-child(3) {
          flex:1;
        }
        span:nth-child(4) {
          // width: 1.28rem;
           width: 3rem;
        }
        // span:nth-child(5) {
        //   flex: 1;
        // }

      }
      .report-list-child:nth-child(2n+1) {
        span{
          background-color: #f8f8f8;

        }
      } 
      .report-list-title{
        span{
          // background-color: rgb(34, 132, 241) !important;
          background-color:#4B92F8 !important;
          color:#fff;
          font-weight: 600;
          font-size: 0.15rem;
          text-align: center;
        }
      }
    }
    .class_infomation {
      height: 1.04rem;
      //border-radius: 0.2rem;
      background: #fafafa;
      width: 100%;
      padding: 0.19rem 0;
      box-sizing: border-box;
      display: flex;
      margin-top: 0.3rem;
      div {
        flex: 1;
        justify-content: center;
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .item1 {
        font-size: 0.15rem;
        color: #4B92F8;
      }
      .item2 {
        span {
          font-size: 0.12rem;
          color: #9b9b9b;
        }
      }
      .item3 {
        .item_num {
          font-size: 0.16rem;
          color: rgb(102,102,102);
        }
        .item_txt {
          color: #666;
          font-size: 0.24rem;
          font-weight: 600;
        }
      }
    }
  }
  .detaill_titleimg{
    width: 2.4rem;
    display: block;
    margin: 0.4rem auto 0.1rem;
  }
  .report-title{
      margin: 0rem auto 0rem;;
      font-size: 0.3rem;
      color:#333;
      display: inline-block;
    }
  .line_boxs{
    width: 1.94rem;
    margin: 0 auto 0.5rem;
    display: flex;
    justify-content: space-around;
    .line_boxs_item_01 {
      width: 0.43rem;
      height: 0.03rem;
      background-color: #ffd400;
    }
    .line_boxs_item_02 {
        width: 1rem;
        height: 0.03rem;
        background-color: #2284f1;
    }
    .line_boxs_item_03 {
        width: 0.43rem;
        height: 0.03rem;
        background-color: #ff3838;
    }
  }

}
</style>
