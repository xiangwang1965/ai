<template>
  <div class="report">
    <p class="report_title">
      <img src="../../../static/image/course_icon.png">
      <span>课程总览</span>
    </p>
    <div class="collapse">
      <el-collapse>
        <el-collapse-item
          v-for="(overview, key, index) in overviews"
          :key="index"
          :title="key + '编程'"
          :name="index + 1"
        >
          <div class="collapse_child" v-for="(item, cindex) in overview" :key="cindex">
            <h4>Level {{ item.level }}</h4>
            <p>{{ item.desc }}</p>
            <router-link
              tag="button"
              v-if="item.id"
              :to="/overview/ + item.id + '?level=' + item.level"
            >查看详情</router-link>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import reportApi from "@/services/report";
const groupBy = (arr, fn) =>
  arr
    .map(typeof fn === "function" ? fn : val => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});

export default {
  data() {
    return {
      overviews: {}
    };
  },

  created() {
    reportApi.getAllCourses().then(res => {
      if (res.code === "001" && res.data.length > 0) {
        this.overviews = groupBy(res.data, "typeName");
      }
    });
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="less">
.report {
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

  .collapse {
    width: 10.78rem;

    .el-collapse {
      border: none;
    }

    .el-collapse-item {
      margin-bottom: 0.3rem;

      .el-collapse-item__header {
        height: 0.6rem;
        padding-left: 0.2rem;

        color: #fff;
        line-height: 0.6rem;
        background: #ffc151;
        border-radius: 0.06rem 0.06rem 0px 0px;

        .el-collapse-item__arrow {
          width: 0.16rem;
          height: 0.24rem;
          margin-right: 0.3rem;

          background: url("../../../static/image/icon-right.png") no-repeat;
          background-size: cover;

          &::before {
            content: " ";
          }
        }
      }

      .el-collapse-item__wrap {
        background: transparent;
        border: none;

        .el-collapse-item__content {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 0;
        }
      }
    }

    .el-collapse-item:nth-child(2) {
      .el-collapse-item__header {
        background: #6edbef;
      }
    }

    .el-collapse-item:nth-child(3) {
      .el-collapse-item__header {
        background: #ff696c;
      }
    }

    .el-collapse-item:nth-child(4) {
      .el-collapse-item__header {
        background: #8b90ff;
      }
    }

    .collapse_child {
      width: 2.5rem;
      min-height: 1.94rem;
      margin-right: 0.27rem;
      margin-top: 0.2rem;
      padding: 0.3rem;

      background: #ffffff;
      border-radius: 0.1rem;

      h4 {
        margin-bottom: 0.2rem;

        line-height: 1;
      }

      p {
        margin-bottom: 0.2rem;

        font-size: 0.1rem;
        color: #000;
      }

      button {
        width: 0.96rem;
        height: 0.26rem;

        background: #ffc151;
        border-radius: 0.15rem;

        line-height: 0.26rem;
        text-align: center;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;

        border: none;
        cursor: pointer;
      }
    }
  }
}
</style>