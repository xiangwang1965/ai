<template>
  <section class="report-detail">
    <p class="report_title">
      <img src="../../../static/image/course_icon.png">
      <span>课程总览</span>
    </p>

    <section class="report-detail-header" v-if="detail.length > 0">
      <img :src="icons.arrowLeft" @click="goBack">
      <span>{{ detail[0].courseName }} · Level {{ level }}</span>
    </section>

    <section class="report-detail-content" v-if="detail.length > 0">
      <div v-if="detail[0].courseDesc">
        <h4 class="report-detail-title">简介</h4>
        <p class="report-detail-desc">{{ detail[0].courseDesc }}</p>
      </div>

      <div>
        <h4 class="report-detail-title">课程简介</h4>
        <p class="report-detail-desc">{{ detail[0].typeDesc }}</p>
      </div>

      <div>
        <h4 class="report-detail-title">课时列表</h4>
        <div class="report-list">
          <div class="report-list-child" v-for="(item, index) in detail" :key="index">
            <span>{{ item.hourName }}</span>
            <span>{{ item.courseName }}</span>
          </div>
        </div>
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
      detail: [],
      icons: {
        arrowLeft: require("../../../static/image/arrow_fff.png")
      }
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
        if (res.code == "001") {
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
    width: 10.75rem;
    height: 0.6rem;
    margin-bottom: 0.1rem;
    padding-left: 0.2rem;

    text-align: left;
    line-height: 0.6rem;
    font-size: 0.17rem;
    color: #fff;

    background: #ffc151;
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
    width: 10.75rem;
    height: 5.5rem;
    padding: 0.3rem 0.5rem;

    background: #fff;
    border-radius: 0.06rem;
    box-sizing: border-box;

    .report-detail-title {
      width: 2.6rem;

      text-align: left;
      line-height: 0.2rem;
      font-size: 0.13rem;
      color: #ffc151;
      letter-spacing: 0.05rem;

      border-bottom: 0.02rem solid #ffc151;
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
      padding-left: 1rem;

      text-align: left;
      box-sizing: border-box;

      .report-list-child {
        span {
          display: inline-block;
          height: 0.36rem;

          line-height: 0.36rem;
          font-size: 0.13rem;

          border: 0.01rem solid #ffc151;
        }

        span:first-child {
          width: 1.28rem;

          text-align: center;
        }

        span:last-child {
          width: 5.14rem;
          padding-left: 0.4rem;

          text-align: left;

          box-sizing: border-box;
        }
      }
    }
  }
}
</style>