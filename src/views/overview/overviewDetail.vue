<template>
  <section class="report-detail">
    <p class="report_title">
      <img src="../../../static/image/course_icon.png">
      <span>课程总览</span>
    </p>

    <section class="report-detail-header" v-if="detail[0]">
      <img :src="icons.arrowLeft" @click="goBack">
      <span>{{ detail[0].courseName }} · Level {{ level }}</span>
    </section>

    <section class="report-detail-content" v-if="detail[0]">
      <div>
        <h4>简介</h4>
        <p>{{ detail[0].courseDesc }}</p>
      </div>

      <div></div>

      <div></div>
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
    width: 10.75rem;
    height: 5.5rem;

    background: #fff;
    border-radius: 0.06rem;
  }
}
</style>