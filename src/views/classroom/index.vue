<template>
  <div id="classContainer" class="classContainer">
    <div class="content1">
      <p class="content_title">班级管理</p>
      <div class="left_content">
        <div class="class_changeTitle">
          <div class="title_left">
            <span></span>
            当前班级
          </div>
          <div class="title_right">历史班级</div>
        </div>
        <div class="class_title_list">
          <div :key="i" v-for="(type,i) in typeList">
            <div style="cursor: pointer;" class="class_title" :class="type.titClass" @click="getClsListByTypeId(type.id)"></div>
            <el-collapse-transition>
              <ul class="class_list" v-show="type.listShow" v-scrollBar>
                <li style="cursor: pointer;" :class="curClassDetail.id == item.id ? 'class_dis '+ type.listItemClass :type.listItemClass"
                  class="class_item"
                  v-for="(item,index) in type.classList"
                  :key="index"
                  @click="getList(item,index)"
                >
                  <div class="class_fixed"></div>
                  <div class="class_text">
                    <p class="class_text_row">
                      <span class="class_name">{{item.name}}</span>
                      <span
                        class="class_time"
                      >{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                    </p>
                    <p class="class_text_row">
                      <span class="class_level">{{item.courseName}}</span>
                      <span class="class_teacher">{{item.teacherName}}</span>
                    </p>
                  </div>
                </li>
                <div class="nodata" v-show="type.nodata">暂无数据</div>
              </ul>
            </el-collapse-transition>
          </div>
        </div>
      </div>
      <div style="cursor: pointer;" type="default" @click="classHandle" class="btn_124 classManagement_btn">管理</div>
    </div>
    <div class="content2">
      <div class="content_title">{{curClassDetail.name}}</div>
      <div class="right_content">
        <div class="tab" :style="colorClassList.tab.bottomStyle">
          <ul>
              <li
              class="tab_item"
              :style="studentTabShow == false ? colorClassList.tab.tabItemActiveStyle:colorClassList.tab.tabItemStyle"
              @click="rightTabHandle(false)">课程</li>
             <li
              class="tab_item"
               :style="studentTabShow == true ? colorClassList.tab.tabItemActiveStyle:colorClassList.tab.tabItemStyle"
              @click="rightTabHandle(true)"
            >学员管理</li>
          </ul>
        </div>
        <div class="classInfo" id="classInfo">
          <div class="classInfoItem class_management" v-show="!studentTabShow">
            <div class="step_wrap">
              <p :style="colorClassList.tab.itemFontColor">课程总进度</p>
              <div class="step_line">
                <div :class="colorClassList.tab.stepLineClass">{{curCourProcess}}%</div>
                <div class="step_line_bg"></div>
                <div class="step_line_width" :class="curClass" :style="{width:curCourProcess+'%'}"></div>
              </div>
            </div>
            <div class="lesson_step_list">
              <div class="lesson_item" :key="c" v-for="(item,c) in coursePlanData.list">
                <div class="lesson_item_icon">
                  <div :class="item.pointclass"></div>
                </div>
                <div :class="item.locked == 1? 'lesson_box_active':'lesson_box'">
                  <div class="lesson_name">{{item.name}}</div>
                  <div class="lesson_info">
                    <div class="lesson_step_lable" v-if="item.locked == 1">
                      <img class="fixed_lock" :src="lockImg" alt>
                    </div>
                    <div class="lesson_step_lable lesson_step_lable_ing" v-if="item.status == 0 && item.locked != 1">未开始</div>
                     <div class="lesson_step_lable lesson_step_lable_ing" v-if="item.status == 1 && item.locked != 1">进行中</div>
                    <div class="lesson_step_lable" v-if="item.status == 2 && item.locked != 1">{{item.plan}}%</div>
                    <div class="lesson_step" v-if="item.locked != 1">
                      <div class="lesson_step_width" :class="curClass" :style="{width:item.plan+'%'}"></div>
                      <div class="lesson_step_bg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="classInfoItem student_management" v-show="studentTabShow">
            <div class="search_position">
              <div class="search_box" style="float:right">
                <el-input
                  placeholder="搜索姓名/ID"
                  size="mini"
                  prefix-icon="el-icon-search"
                  v-model="searchData"
                >
                  <el-button slot="append" class="search_btn" @click="search">搜索</el-button>
                </el-input>
              </div>
            </div>
            <div class="class_infomation">
              <div class="item1" :style="colorClassList.tab.itemFontColor">班级信息</div>
              <div class="item2">
                <span>{{curClassDetail.startTime}}-{{curClassDetail.endTime}}</span>
                <span>时间</span>
              </div>
              <div class="item3">
                <span class="item_num">{{curClassDetail.level}}</span>
                <span class="item_txt">等级</span>
              </div>
              <div class="item3">
                <span class="item_num">{{curClassDetail.stuCnt}}</span>
                <span class="item_txt">班级人数</span>
              </div>
            </div>
            <div class="person_List">
              <div class="person_box" v-for="(item,i) in studentsList" :key="i">
                <div class="person_name">{{item.name}}</div>
                <div class="person_handle">
                  <div style="cursor: pointer;" class="icon1" @click="courseReport(item)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="cursor: pointer;" class="btn_124 personManagement_btn" id="showPersonDialog" @click="handleStuManage">管理</div>
    </div>
    <el-dialog center append-to-body title="学生管理" class="el-dialog2" :visible.sync="showStuManage">
      <studentManage
        :currentType="currentType"
        ref="studentsManage"
        :currentClass="curClassDetail"
        :courseId="curClassDetail.courseId"
      ></studentManage>
    </el-dialog>
    <el-dialog center append-to-body title="班级管理" :visible.sync="showClassManage">
      <classManage
        v-on:refresh="refresh"
        ref="classManage"
        class="el-dialog1"
        :currentIndex="currentIndex"
      ></classManage>
    </el-dialog>

    <el-dialog
      center
      append-to-body
      title="学习报告"
      custom-class="el-dialog3"
      width="60%"
      :lock-scroll="lockScroll"
      top="1vh"
      :visible.sync="showCourseReportAdd"
    >
      <courseReportAdd
        :courseList="coursePlanData.list"
        ref="courseReportAdd"
        :curClsId="curClassDetail.id"
        v-on:toggleReportAdd="toggleReportAdd"
        :curStudent="curStudent"
        :studentlist="studentsList"
      ></courseReportAdd>
    </el-dialog>
    <el-dialog
      center
      append-to-body
      title="学习报告"
      custom-class="el-dialog3"
      :visible.sync="showCourseReport"
      width="60%"
      :lock-scroll="lockScroll"
      top="0"
    >
      <courseReport
        v-on:refresh="refresh"
        ref="courseReport"
        :curClsId="curClassDetail.id"
        :curStudent="curStudent"
        :courseList="coursePlanData.list"
        :currentClass="curClassDetail"
      ></courseReport>
    </el-dialog>
  </div>
</template>
<script>
import classApi from "@/services/classroom";
import studentManage from "./studentManage";
import classManage from "./classManage";
import authUtils from "@/services/auth/utils";
import courseReportAdd from "./courseReportAdd";
import courseReport from "./courseReport";
export default {
  data() {
    return {
      lockImg: require("../../../static/image/lock.png"),
      activeNames: ["1"],
      studentsList: [],
      typeList: [
        {
          id: 1,
          titClass: "class_S",
          listItemClass: "class_item_yellow",
          listShow: true,
          classList: [],
          nodata: false
        },
        {
          id: 2,
          titClass: "class_P",
          listItemClass: "class_item_blue",
          listShow: false,
          classList: [],
          nodata: false
        },
        {
          id: 3,
          titClass: "class_N",
          listItemClass: "class_item_red",
          listShow: false,
          classList: [],
          nodata: false
        },
        {
          id: 4,
          titClass: "class_A",
          listItemClass: "class_item_purple",
          listShow: false,
          classList: [],
          nodata: false
        }
      ],
      isFirst: true,
      showClassManage: false,
      showStuManage: false,
      currentIndex: "",
      currentList: [],
      currentType: "",
      searchData: "",
      /**右侧tab显示模块 */
      studentTabShow: false,
      coursePlanData: {},
      curCourProcess: "0%",
      showCourseReportAdd: false,
      showCourseReport: false,
      curStudent: {},
      lockScroll: true,
      // 当前显示课程信息
      curClassDetail:{},
      curClass:'bg_y',
      // 颜色切换 数组
      colorList:['#FFC151',' #6EDBEF','#FF696C','#8B90FF'],
      colortabItem:['#FFD893',' #6eebef7d','#ff696cad','#8b90ff80'],
      bgsufix:['y','b','r','p'],
      colorClassList:{
          bg:{
            1:'bg_y',
            2:'bg_b',
            3:'bg_r',
            4:'bg_p'
          },
          tab:{
             bottomStyle:{
                 borderBottomColor:'#FFC151'
             },
             tabItemStyle:{
                 background:'#FFD893'
             },
            tabItemActiveStyle:{
                 background:'#FFC151'
             },
             itemFontColor:{
                 color:'#FFC151'
             },
             stepLineClass:'step_line_label_y',
             dianIconUp:'dian_icon_up_r'
          }
      }
    };
  },
  created() {
    this.getClsListByTypeId(1);
  },
  mounted() {
    let that = this;
    window.addEventListener(
      "scroll",
      function(e) {
        if (this.showClassManage || this.showStuManage) {
          e.preventDefault();
        }
      },
      false
    );
  },
  components: {
    studentManage,
    classManage,
    courseReportAdd,
    courseReport
  },
  methods: {
    toggleReportAdd() {
      this.showCourseReportAdd = !this.showCourseReportAdd;
    },
    // 获取学生列表或者课程数据
    getList(item, index) {
      // 默认班级展示信息
      this.curClassDetail = item;
      this.currentIndex = index;
      if (this.isFirst) {
        this.getStudent();
        this.getCoursePlan();
      } else {
        if (this.studentTabShow) {
          this.getStudent();
        } else {
          this.getCoursePlan();
        }
      }
    },
    getCoursePlan() {
        if (!this.curClassDetail.id) {
            return false;
        }
      let params = {
        clsId: this.curClassDetail.id,
        courseId:this.curClassDetail.courseId
      };
      classApi.getCoursePlan(params).then(res => {
        if (res.code === "001") {
          this.coursePlanData = res.data;
          this.curCourProcess = Math.ceil(this.coursePlanData.point);
          if (this.coursePlanData.list.length) {
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
    rightTabHandle() {
      this.studentTabShow = !this.studentTabShow;
      if (!this.studentTabShow) {
        this.getCoursePlan();
      } else {
        this.getStudent();
      }
    },
    classHandle() {
      this.showClassManage = true;
      if (this.$refs.classManage) {
        this.$refs.classManage.gecurClassDetail(
          this.currentList[this.currentIndex]
        );
      }
    },
    handleStuManage() {
      this.showStuManage = true;
      if (this.$refs.studentsManage) {
        this.$refs.studentsManage.setClass();
        this.$refs.studentsManage.getCodeList(this.curClassDetail.id);
        this.$refs.studentsManage.setRight(this.$store.state.curClsStuList[0]);
      }
    },

    courseReport(item) {
      this.showCourseReport = true;
      this.curStudent = item;
      if (this.$refs.courseReport) {
        this.$refs.courseReport.getReportInfo();
        this.$refs.courseReport.getStuInfo(item.id);
      }
    },
    handleReportCreate(item) {
      this.showCourseReportAdd = true;
      this.curStudent = item;
      if (this.$refs.courseReportAdd) {
        this.$refs.courseReportAdd.getStuInfo(item.id);
      }
    },
    search() {
      let params = {
        clsId: this.curClassDetail.id,
        courseId: this.curClassDetail.courseId,
        searchTxt: this.searchData
      };
      classApi.search(params).then(res => {
        this.studentsList = res.data;
      });
    },
    refresh(data) {
      this.typeList[this.currentType-1].classList = this.$store.state.currentList;
      this.getList(this.typeList[this.currentType-1].classList[0], 0);
      this.showClassManage = false;
      this.showStuManage = false;
    },
    getClsListByTypeId(typeId) {
     this.curClass = this.colorClassList.bg[typeId];
     this.colorClassList.tab.bottomStyle.borderBottomColor = this.colorList[typeId-1];
     this.colorClassList.tab.itemFontColor.color = this.colorList[typeId-1];
     this.colorClassList.tab.tabItemStyle.background = this.colortabItem[typeId-1];
     this.colorClassList.tab.tabItemActiveStyle.background = this.colorList[typeId-1];
      this.colorClassList.tab.stepLineClass = 'step_line_label_'+this.bgsufix[typeId-1];
       this.colorClassList.tab.dianIconUp = 'dian_icon_up_'+this.bgsufix[typeId-1];
       this.colorClassList.tab.dianIcon = 'dian_icon_'+this.bgsufix[typeId-1];
      let params = {
        typeId: typeId
      };
      let that = this;
      this.typeList.forEach((type, i) => {
        if (type.id == typeId) {
          this.typeList[i].listShow = true;
        } else {
          this.typeList[i].listShow = false;
        }
      });
      this.currentType = typeId;
      if (!this.typeList[typeId - 1].classList.length) {
        classApi.queryClsListByTypeId(params).then(res => {
          if (res.data && res.data.length) {
            this.typeList[typeId - 1].classList = Object.assign({}, res.data);
            this.currentList = res.data;
            this.$store.state.currentList = this.currentList;
            console.log(this.$store.state);
            if (this.isFirst) {
              this.getList(res.data[0], 0);
              this.typeList[typeId - 1].nodata = false;
            }
          } else {
            this.currentList = [];
            this.coursePlanData = {};
            this.curCourProcess = "0";
            this.curClassDetail = {};
            this.$store.state.currentList = this.currentList;
            console.log(this.$store.state);
            this.typeList[typeId - 1].nodata = true;
          }
        });
      } else {
        this.currentList = this.typeList[typeId - 1].classList;
        this.$store.state.currentList = this.currentList;
      }
    },
    getStudent() {
      if (!this.curClassDetail.id) {
          return false;
      }
      let params = {
        clsId: this.curClassDetail.id,
        courseId: this.curClassDetail.courseId,
        searchTxt: ""
      };
      classApi.getStudent(params).then(res => {
        this.studentsList = res.data;
        this.$store.state.curClsStuList = this.studentsList;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-dialog1 {
  width: 10rem;
  height: 6rem;
  display: -ms-flexbox;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;
}
.el-dialog2 {
  display: -ms-flexbox;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;
}
.el-dialog3 {
  display: -ms-flexbox;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}
.el-dialog .el-dialog__body {
  padding: 0px;
}
.classContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  .content1 {
    .left_content {
      .class_title_list {
        .class_list {
          position: relative;
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
        //   background: #ffc151;
          //   width: curCourProcess;
          height: 0.06rem;
          z-index: 10;
        }
        .step_line_label_y {
          width: 0.67rem;
          height: 0.42rem;
          background: url("../../../static/image/step_label_y.png");
          background-size: 100%;
          text-align: center;
          line-height: 0.38rem;
          position: absolute;
          top: -0.52rem;
          left: 100%;
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
          left: 100%;
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
          left: 100%;
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
          left: 100%;
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
        .lesson_item_icon {
            margin-left:0.3rem;
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
        .lesson_box_active {
          background: #e7eeff;
        }
        .lesson_box {
          background: #fff;
        }
        .lesson_box,
        .lesson_box_active {
          flex: 1;
          height: 0.8rem;
          border-radius: 0.42rem;
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
              .fixed_lock {
                position: relative;
                width: 0.21rem;
                height: 0.2rem;
                top: 0.15rem;
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
                // background: #ffc151;
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
