<template>
  <div id="classContainer" class="classContainer">
    <div class="content1">
      <p class="content_title">
        <img :src="icons.class" />
        <span>我的课程</span>
      </p>
      <div class="left_content">
        <div class="class_changeTitle">
          <div class="title_left">
            <span></span>
            当前课程
          </div>
        </div>
        <div class="class_title_list">
          <div class="class_title class_S" @click="getCurrentCourses(1)"></div>
          <el-collapse-transition>
            <ul class="class_list" v-show="show1">
              <li
                :class="{class_dis:currentClass == item.id}"
                class="class_item class_item_yellow"
                v-for="(item,index) in courseList.course1"
                :key="index"
                @click="getList(item,index)"
              >
                <div class="class_fixed"></div>
                <div class="class_text">
                  <p class="class_text_row">
                    <span class="class_name">{{item.name}}</span>
                    <span class="class_time">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                  </p>
                  <p class="class_text_row">
                    <span class="class_level">{{item.courseName}}</span>
                    <span class="class_teacher">{{item.teacherName}}</span>
                  </p>
                </div>
              </li>
              <div class="nodata" v-show="nodata1">暂无数据</div>
            </ul>
          </el-collapse-transition>
          <div class="class_title class_P" @click="getCurrentCourses(2)"></div>
          <el-collapse-transition class="class_list">
            <ul class="class_list" v-show="show2">
              <li
                :class="{class_dis:currentClass == item.id}"
                class="class_item class_item_blue"
                v-for="(item,index) in courseList.course2"
                :key="index"
                @click="getList(item,index)"
              >
                <div class="class_fixed"></div>
                <div class="class_text">
                  <p class="class_text_row">
                    <span class="class_name">{{item.name}}</span>
                    <span class="class_time">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                  </p>
                  <p class="class_text_row">
                    <span class="class_level">{{item.courseName}}</span>
                    <span class="class_teacher">{{item.teacherName}}</span>
                  </p>
                </div>
              </li>
              <div class="nodata" v-show="nodata2">暂无数据</div>
            </ul>
          </el-collapse-transition>
          <div class="class_title class_N" @click="getCurrentCourses(3)"></div>
          <el-collapse-transition>
            <ul class="class_list" v-show="show3">
              <li
                :class="{class_dis:currentClass == item.id}"
                class="class_item class_item_red"
                v-for="(item,index) in courseList.course3"
                :key="index"
                @click="getList(item,index)"
              >
                <div class="class_fixed"></div>
                <div class="class_text">
                  <p class="class_text_row">
                    <span class="class_name">{{item.name}}</span>
                    <span class="class_time">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                  </p>
                  <p class="class_text_row">
                    <span class="class_level">{{item.courseName}}</span>
                    <span class="class_teacher">{{item.teacherName}}</span>
                  </p>
                </div>
              </li>
              <div class="nodata" v-show="nodata3">暂无数据</div>
            </ul>
          </el-collapse-transition>
          <div class="class_title class_A" @click="getCurrentCourses(4)"></div>
          <el-collapse-transition>
            <ul class="class_list" v-show="show4">
              <li
                :class="{class_dis:currentClass == item.id}"
                class="class_item class_item_purple"
                v-for="(item,index) in courseList.course4"
                :key="index"
                @click="getList(item,index)"
              >
                <div class="class_fixed"></div>
                <div class="class_text">
                  <p class="class_text_row">
                    <span class="class_name">{{item.name}}</span>
                    <span class="class_time">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                  </p>
                  <p class="class_text_row">
                    <span class="class_level">{{item.courseName}}</span>
                    <span class="class_teacher">{{item.teacherName}}</span>
                  </p>
                </div>
              </li>
              <div class="nodata" v-show="nodata4">暂无数据</div>
            </ul>
          </el-collapse-transition>
        </div>
      </div>
    </div>
    <div class="content2">
      <div class="content_title">{{classTitle}}</div>
      <div class="right_content">
        <div class="classInfo" id="classInfo">
          <div class="classInfoItem class_management">
            <div class="step_wrap">
              <p  :style="colorClassList.tab.itemFontColor">课程总进度</p>
              <div class="step_line">
                <div :class="colorClassList.tab.stepLineClass">{{curCourProcess}}%</div>
                <div class="step_line_bg"></div>
                <div class="step_line_width" :class="curClass" :style="{width:curCourProcess+'%'}"></div>
              </div>
            </div>
            <div class="lesson_step_list">
              <div
                @click="item.locked!=1?practiceHandle(item):''"
                :class="{lesson_item: true, locked: item.locked==1 }"
                :key="c"
                v-for="(item,c) in coursePlanData.list"
              >
                <div class="lesson_item_icon">
                  <div :class="item.pointclass"></div>
                </div>
                <div class="lesson_box">
                  <div class="lesson_name">{{item.name}}</div>
                  <div class="lesson_info">
                    <div v-if="item.locked==1">
                      <div class="lesson_step_lable">
                        <img src="../../../static/img/password.png" alt />
                      </div>
                      <div class="lesson_step">
                        <div class="lesson_step_width" :style="{width:'0%'}"></div>
                        <div class="lesson_step_bg"></div>
                      </div>
                    </div>
                    <div v-else>
                      <div class="lesson_step_lable" v-if="item.status == 0">未开始</div>
                      <div
                        class="lesson_step_lable lesson_step_lable_ing"
                        v-if="item.status == 1"
                      >进行中</div>
                      <div class="lesson_step_lable" v-if="item.status == 2">{{item.plan}}%</div>
                      <div class="lesson_step">
                        <div class="lesson_step_width" :class="curClass" :style="{width:item.plan+'%'}"></div>
                        <div class="lesson_step_bg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import classApi from "@/services/classroom";
import authUtils from "@/services/auth/utils";
export default {
  data() {
    return {
      icons: {
        class: require("../../../static/image/my_class_blue.png")
      },
      courseList: {
        course1: [],
        course2: [],
        course3: [],
        course4: []
      },
      studentsList: [],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      nodata1: false,
      nodata2: false,
      nodata3: false,
      nodata4: false,
      classTitle: "",
      isFirst: true,
      currentClass: "",
      courseId: "",
      showCourseReport: false,
      currentIndex: "",
      currentList: [],
      currentType: "",
      userInfo: {},
      /** 右侧tab显示模块 */
      coursePlanData: {},
      curCourProcess: "0",
      curStudent: {},
      hourInfo: {},
      // 颜色切换 数组
      curClass:'bg_y',
      colorList: ["#FFC151", " #6EDBEF", "#FF696C", "#8B90FF"],
      colortabItem: ["#FFD893", " #6eebef7d", "#ff696cad", "#8b90ff80"],
      bgsufix: ["y", "b", "r", "p"],
      colorClassList: {
        bg: {
          1: "bg_y",
          2: "bg_b",
          3: "bg_r",
          4: "bg_p"
        },
        tab: {
          itemFontColor: {
            color: "#FFC151"
          },
          stepLineClass: "step_line_label_y",
          dianIconUp: "dian_icon_up_r"
        }
      }
    };
  },
  computed: {
    current() {
      return this.courseList["course" + this.currentType][this.currentIndex];
    }
  },
  created() {
    this.userInfo = authUtils.getUser();
    this.getCurrentCourses(1);
  },
  components: {},
  methods: {
    practiceHandle(item) {
      this.$router.push({
        name: "practice",
        query: {
          hourid: item.hour_id,
          clsid: item.class_id
        }
      });
    },
    getList(item, index) {
      if (!item) {
        return false;
      }
      this.classTitle = item.name;
      this.currentClass = item.clsId;
      this.courseId = item.courseId;
      this.currentIndex = index;
      console.log(index);
      console.log(item);
      this.getCoursePlan();
    },
    getCoursePlan() {
      let params = {
        clsId: this.currentClass,
        courseId: this.courseId
      };
      classApi.getCoursePlan(params).then(res => {
        if (res.code === "001") {
          this.coursePlanData = res.data;
          this.curCourProcess = Math.ceil(this.coursePlanData.point);
          if (this.coursePlanData.list.length) {
            this.hourInfo = this.coursePlanData.list[0];
            this.coursePlanData.list.forEach((item, index) => {
               this.coursePlanData.list[index].pointclass =
                item.status == 0 ? this.colorClassList.tab.dianIconUp : this.colorClassList.tab.dianIcon;
              if (index == this.coursePlanData.list.length - 1) {
                this.coursePlanData.list[index].pointclass += " dian_icon_last";
              }
            });
          }
        }
      });
    },

    refresh(data) {
      this.courseList["course" + this.currentType] = Object.assign({}, data);
      this.getList(data[0], 0);
    },

    getCurrentCourses(typeId) {
        this.curClass = this.colorClassList.bg[typeId];

        this.colorClassList.tab.itemFontColor.color = this.colorList[typeId-1];

        this.colorClassList.tab.stepLineClass = 'step_line_label_'+this.bgsufix[typeId-1];
        this.colorClassList.tab.dianIconUp = 'dian_icon_up_'+this.bgsufix[typeId-1];
        this.colorClassList.tab.dianIcon = 'dian_icon_'+this.bgsufix[typeId-1];
      let params = {
        typeId: typeId
      };
      for (let i = 1; i <= 4; i++) {
        if (typeId !== i) {
          this["show" + i] = false;
        }
      }
      this.currentType = typeId;
      this["show" + typeId] = !this["show" + typeId];
      if (!this.courseList["course" + typeId.length]) {
        classApi.getCurrentCourses(params).then(res => {
          if (res.data && res.data.length) {
            this.courseList["course" + typeId] = Object.assign({}, res.data);
            this.currentList = res.data;
            if (this.isFirst) {
              this.getList(res.data[0], 0);
              this.currentClass = res.data[0].clsId;
              this["nodata" + typeId] = false;
            }
          } else {
            this.currentList = [];
            this.coursePlanData = {};
            this.curCourProcess = "0";
            this.courseList["course" + typeId] = [];
            this.currentList = [];
            this["nodata" + typeId] = true;
          }
        });
      } else {
        this.currentList = this.courseList["course" + typeId.length];
      }
    },
    getHisCourses(typeId) {
      let params = {
        typeId: typeId
      };
      for (let i = 1; i <= 4; i++) {
        if (typeId !== i) {
          this["show" + i] = false;
        }
      }
      this.currentType = typeId;
      this["show" + typeId] = !this["show" + typeId];
      if (!this.courseList["course" + typeId.length]) {
        classApi.getHisCourses(params).then(res => {
          if (res.data && res.data.length) {
            this.courseList["course" + typeId] = Object.assign({}, res.data);
            this.currentList = res.data;
            if (this.isFirst) {
              this.getList(res.data[0], 0);
              this.currentClass = res.data[0].id;
              this["nodata" + typeId] = false;
            }
          } else {
            this.courseList["course" + typeId] = [];
            this.currentList = [];
            this["nodata" + typeId] = true;
          }
        });
      } else {
        this.currentList = this.courseList["course" + typeId.length];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.classContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  .content1 {
    .content_title {
      display: flex;
      justify-items: center;
      height: 0.28rem;
      margin-bottom: 0.2rem;

      img {
        width: 0.34rem;
        height: 0.27rem;
      }

      span {
        margin-left: 0.07rem;
        line-height: 0.28rem;
        font-size: 0.15rem;
        color: #4592fe;
        letter-spacing: 1.5px;
      }
    }
    .left_content {
      .class_title_list {
        .class_list {
          .class_item {
            width: 4.47rem;
            height: 0.68rem;
            background: #fff;
            box-shadow: 0 0 0.01rem 0 rgba(0, 0, 0, 0.5);
            border-radius: 0.2rem;
            font-size: 0.16rem;
            box-sizing: border-box;
            margin-left: 0.02rem;
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
              width: 4rem;
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
                  color: #ffc151;
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
      }
    }
  }
  .content2 {
    float: left;
    .right_content {
      height: 6.27rem;
      .classInfo {
        flex: 1;
        .classInfoItem {
          display: flex;
          flex-direction: column;
        }
      }
    }
    .step_wrap {
      background: #fff;
      border-radius: 0.2rem;
      height: 1.04rem;
      margin: 0.16rem 0 0.19rem 0;
      p {
        text-align: left;
        font-size: 0.16rem;
        padding: 0.17rem 0 0 0.25rem;
        color: #ffc151;
      }
      .step_line {
        margin: 0.3rem 0.25rem 0 1.24rem;
        height: 0.06rem;
        position: relative;
        .step_line_bg {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.28;
          background: #979797;
          height: 0.06rem;
          z-index: 1;
          width: 100%;
        }
        .step_line_width {
          position: absolute;
          top: 0;
          left: 0;
          background: #ffc151;
          //   width: curCourProcess;
          height: 0.06rem;
          z-index: 10;
        }
        .step_line_label_y {
          width: 0.67rem;
          height: 0.42rem;
          background: url("../../../static/image/step_label.png");
          background-size: 100%;
          text-align: center;
          line-height: 0.38rem;
          position: absolute;
          top: -0.52rem;
          left: 50%;
          margin-left: -0.33rem;
          color: #fff;
          font-size: 0.16rem;
        }

        .step_line_label_b {
          width: 0.67rem;
          height: 0.42rem;
          background: url("../../../static/image/step_label_b.png");
          background-size: 100%;
          text-align: center;
          line-height: 0.38rem;
          position: absolute;
          top: -0.52rem;
          left: 50%;
          margin-left: -0.33rem;
          color: #fff;
          font-size: 0.16rem;
        }
        .step_line_label_r {
          width: 0.67rem;
          height: 0.42rem;
          background: url("../../../static/image/step_label_r.png");
          background-size: 100%;
          text-align: center;
          line-height: 0.38rem;
          position: absolute;
          top: -0.52rem;
          left: 50%;
          margin-left: -0.33rem;
          color: #fff;
          font-size: 0.16rem;
        }
        .step_line_label_p {
          width: 0.67rem;
          height: 0.42rem;
          background: url("../../../static/image/step_label_p.png");
          background-size: 100%;
          text-align: center;
          line-height: 0.38rem;
          position: absolute;
          top: -0.52rem;
          left: 50%;
          margin-left: -0.33rem;
          color: #fff;
          font-size: 0.16rem;
        }


      }
    }
    .lesson_step_list {
      height: 4.43rem;
      overflow: auto;
      .lesson_item {
        display: flex;
        width: 100%;
        margin-bottom: 0.25rem;

        &.locked {
          .lesson_box {
            background-color: #e7eeff;
          }
        }
        .lesson_item_icon {
          width: 0.9rem;
          .dian_icon_y {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_done_y.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_y {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_up_y.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_y:after,
          .dian_icon_y:after {
            content: "";
            height: 0.78rem;
            width: 0.02rem;
            background: #ffc55e;
            position: absolute;
            bottom: -0.83rem;
            right: 0.11rem;
          }
          .dian_icon_b {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_done_b.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_b {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_up_b.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_b:after,
          .dian_icon_b:after {
            content: "";
            height: 0.78rem;
            width: 0.02rem;
            background: #6EDBEF;
            position: absolute;
            bottom: -0.83rem;
            right: 0.11rem;
          }
        .dian_icon_r {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_done_r.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_r {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_up_r.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_r:after,
          .dian_icon_r:after {
            content: "";
            height: 0.78rem;
            width: 0.02rem;
            background: #FF696C;
            position: absolute;
            bottom: -0.83rem;
            right: 0.11rem;
          }
          .dian_icon_p {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_done_p.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_p {
            width: 0.25rem;
            height: 0.25rem;
            background: url("../../../static/image/step_up_p.png");
            background-size: 100%;
            position: relative;
            margin: 0.3rem auto;
            position: relative;
          }
          .dian_icon_up_p:after,
          .dian_icon_p:after {
            content: "";
            height: 0.78rem;
            width: 0.02rem;
            background: #8B90FF;
            position: absolute;
            bottom: -0.83rem;
            right: 0.11rem;
          }
          .dian_icon_last:after {
            content: "";
            height: 0;
            width: 0;
          }
        }
        .lesson_box {
          flex: 1;
          height: 0.8rem;
          border-radius: 0.42rem;
          background: #fff;
          display: flex;
          .lesson_name {
            width: 1.48rem;
            color: #5c5c5c;
            font-size: 0.16rem;
            text-align: center;
            padding-top: 0.25rem;
          }
          .lesson_info {
            flex: 1;
            .lesson_step_lable {
              text-align: right;
              font-size: 0.13rem;
              color: #c1c1c1;
              margin-right: 0.25rem;
              margin-top: 0.14rem;
              img {
                width: 0.22rem;
                height: 0.2rem;
              }
            }
            .lesson_step_lable_ing {
              color: #ffc151;
            }
            .lesson_step {
              margin: 0.1rem 0.25rem 0 0rem;
              height: 0.03rem;
              position: relative;
              .lesson_step_bg {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0.28;
                background: #979797;
                height: 0.03rem;
                z-index: 1;
                width: 100%;
              }
              .lesson_step_width {
                position: absolute;
                top: 0;
                left: 0;
                background: #ffc151;
                width: 0%;
                height: 0.03rem;
                z-index: 10;
                position: relative;
              }
              .lesson_step_width.bg_y:after {
                content: "";
                width: 0.08rem;
                height: 0.08rem;
                border-radius: 100%;
                position: absolute;
                right: -0.04rem;
                top: -0.02rem;
                background: #ffc151;
              }
              .lesson_step_width.bg_b:after {
                content: "";
                width: 0.08rem;
                height: 0.08rem;
                border-radius: 100%;
                position: absolute;
                right: -0.04rem;
                top: -0.02rem;
                background:#6EDBEF;
              }
              .lesson_step_width.bg_r:after {
                content: "";
                width: 0.08rem;
                height: 0.08rem;
                border-radius: 100%;
                position: absolute;
                right: -0.04rem;
                top: -0.02rem;
                background: #ff696c;
              }
              .lesson_step_width.bg_p:after {
                content: "";
                width: 0.08rem;
                height: 0.08rem;
                border-radius: 100%;
                position: absolute;
                right: -0.04rem;
                top: -0.02rem;
                background:#8B90FF;
              }
            }
          }
        }
      }
    }
    .student_management {
      .class_infomation {
        height: 1.04rem;
        border-radius: 0.2rem;
        background: #fff;
        width: 100%;
        padding: 0.19rem 0;
        box-sizing: border-box;
        display: flex;
        div {
          flex: 1;
          justify-content: center;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .item1 {
          font-size: 0.15rem;
          color: #ffc151;
        }
        .item2 {
          span {
            font-size: 0.12rem;
            color: #9b9b9b;
          }
        }
        .item3 {
          .item_num {
            font-size: 0.3rem;
            color: #9b9b9b;
          }
          .item_txt {
            font-size: 0.13rem;
            color: #787878;
          }
        }
      }
      .person_List {
        padding-top: 0.19rem;
        height: 3.9rem;
        overflow: auto;
        .person_box {
          width: 100%;
          height: 0.66rem;
          line-height: 0.66rem;
          border-radius: 0.425rem;
          background: #fff;
          display: flex;
          justify-content: space-between;
          color: #5c5c5c;
          font-size: 0.16rem;
          margin-bottom: 0.14rem;
          .person_name {
            padding-left: 0.51rem;
          }
          .person_handle {
            padding-right: 0.44rem;
            display: flex;
            align-items: center;
            .icon1 {
              width: 0.23rem;
              height: 0.22rem;
              display: inline-block;
              background: url("../../../static/image/personHandle1.png");
              background-size: 100%;
              margin-right: 0.3rem;
            }
            .icon2 {
              width: 0.23rem;
              height: 0.22rem;
              display: inline-block;
              background: url("../../../static/image/personHandle2.png");
              background-size: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
