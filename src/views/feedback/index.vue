<template>
  <div id="teacherView">
    <div class="content1">
      <p class="content_title">教师档案</p>
      <div class="left_content">
        <div class="search_position">
          <div class="search_box" style="float:right">
            <el-input
              size="mini"
              placeholder="搜索姓名/ID"
              v-model="params.searchTxt"
              prefix-icon="el-icon-search"
            >
              <el-button slot="append" @click="getData" type="warning">搜索</el-button>
            </el-input>
          </div>
        </div>
        <div class="photo_list">
          <div class="item" :class="{class_dis:teachId == item.id}" :key="i" v-for="(item,i) in list" @click="queryTeacherInfo(item.id)">
            <img :src="url" alt class="item_img">
            <p>{{item.name}}</p>
          </div>
          <div class="item" id="updata" @click="handleTeacher">
                <img :src="updateImg" alt="" class="item_img">
          </div>
        </div>
      </div>
    </div>
    <div class="content2">
      <div class="content_title">教师信息</div>
      <div class="right_content teacher_info" style="height: 6.67rem">
        <div class="teacher_box">
          <img :src="url" alt class="photo">
          <p class="name">{{tInfo.name}}</p>
          <p class="id">ID:{{tInfo.id}}</p>
          <span class="grade">Level{{tInfo.level}}</span>
          <div class="statistics">
            <div class="item">
              <p class="num">{{tInfo.totalStu}}</p>
              <p class="txt">培训学生总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalCourse}}</p>
              <p class="txt">培训课程总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalDay}}</p>
              <p class="txt">上课总天数</p>
            </div>
          </div>
          <div class="lesson_lock">
            <div :class="item.class" class="lock_row" :key="i" v-for="(item,i) in levelsData">
              <div class="name">{{item.tit}}</div>
              <div class="lock_level">
                <div class="lock_item" :class="l.activeClass" :key="t" v-for="(l,t) in item.list">
                  <img :src="item.icon" v-if="tInfo.level < l.level" class="lock">
                  <p>Leverl {{l.level}}</p>
                  <p>{{l.name}}</p>
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
import teacher from "@/services/teacher";
export default {
  data() {
    return {
    teacherManage:false,
       levelsData: [
        {
          tit: "SCRATCH",
          icon: require("../../../static/image/lock_yellow.png"),
          class:'lock_row_y',
          list: [
            {
              level: 1,
              name: "初级编程",
              activeClass:'unlock_y',
            },
            {
              level: 2,
              name: "初级编程",
              activeClass:'unlock_y',
            }
          ]
        },
        {
          tit: "PYTHON",
           icon: require("../../../static/image/lock_blue.png"),
           class:'lock_row_b',
          list: [
            {
              activeClass:'unlock_blue',
              level: 3,
              name: "初级编程"
            },
            {
              activeClass:'unlock_blue',
              level: 4,
              name: "初级编程"
            },
            {
              level: 5,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "NOIP",
          icon: require("../../../static/image/lock_red.png"),
          class:'lock_row_r',

          list: [
            {
                activeClass:'unlock_red',
              level: 6,
              name: "初级编程"
            },
            {
                activeClass:'unlock_red',
              level: 7,
              name: "初级编程"
            },
            {
                activeClass:'unlock_red',
              level: 8,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "AI",
          icon: require("../../../static/image/lock_purple.png"),
          class:'lock_row_p',

          list: [
            {
                activeClass:'unlock_purple',
              level: 9,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 10,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 11,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 12,
              name: "初级编程"
            }
          ]
        }
      ],
      corlorImgUrl: {
        yellow: require("../../../static/image/lock_yellow.png"),
        blue: require("../../../static/image/lock_blue.png"),
        red: require("../../../static/image/lock_red.png"),
        purple: require("../../../static/image/lock_purple.png")
      },
      list: [],
      url: require("../../../static/img/default_avatar.png"),
      updateImg: require('../../../static/image/photo_updata.png'),
      tInfo: {
          level:0,
          name:'xxx'
      },
      teachId: '',
      dateOption: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      currentTeacher:{},
      params: {
        searchTxt: ""
      }
    };
  },
  created() {
    this.getData();
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/student") {
      to.meta.keepAlive = false;
      this.$destroy();
    } else {
      to.meta.keepAlive = true;
      this.$destroy();
    }
    next();
  },
  methods: {
    refresh() {
        this.teacherManage = false;
        this.getData();
    },
    getData() {
      teacher.querylist(this.params).then(res => {
        if (res.code === "001") {
            if (res.data.length) {
                this.list = res.data;
                this.queryTeacherInfo(this.list[0].id);
            }
        }
      });
    },
    queryTeacherInfo(id) {
      var p = {};
      p.teacherId = id;
      this.teachId = id;

      teacher.queryTeacherInfo(p).then(res => {
        if (res.code === "001") {
          this.tInfo = res.data;
          if (this.tInfo.level) {
              this.levelsData.forEach((item,i)=>{
                  item.list.forEach((it,t)=>{
                      if (this.tInfo.level < it.level) {
                          this.levelsData[i].list[t].activeClass = '';
                      }
                  })
              })
          }
        }
      });
    },
    handleTeacher(){
        this.teacherManage= true;
    }

  }
};
</script>
<style lang="less" scoped>
#teacherView {
  display: flex;
  flex: 1;
  .photo_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    overflow: auto;
    margin-top: 0.27rem;
    .item {
      width: 1.24rem;
      text-align: center;
      margin-bottom: 0.4rem;
      .item_img {
        width: 1.24rem;
        height: 1.24rem;
        padding-bottom: 0.1rem;
      }
      p {
        color: #5c5c5c;
        font-size: 0.15rem;
      }
    }
    .class_dis {
        background: #E7EEFF;
    }
  }
  .teacher_info {
    background: #fff;
    border-radius: 0.2rem;
  }
  .teacher_box {
    text-align: center;
    width: 3.6rem;
    margin: 0 auto;
    padding-top: 0.3rem;
    .photo {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      padding-bottom: 0.12rem;
    }
    .name {
      color: #4a4a4a;
      font-size: 0.2rem;
    }
    .id {
      font-size: 0.16rem;
      color: #9b9b9b;
    }
    .grade {
      background: #ffc151;
      border-radius: 6px;
      text-align: center;
      padding: 0.05rem 0.15rem;
      margin: 0.05rem 0 0.08rem 0;
      display: inline-block;
    }
    .phone {
      font-size: 0.12rem;
      color: #9b9b9b;
    }
    .statistics {
      height: 1rem;
      background: #ffffff;
      border: 0.01rem solid #979797;
      border-radius: 0.2rem;
      display: flex;
      padding: 0.21rem 0;
      margin: 0.18rem 0 0.09rem 0;
      box-sizing: border-box;
      .item {
        border-left: 0.01rem solid #c6c6c6;
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .num {
          font-size: 0.3rem;
          color: #9b9b9b;
        }
        .txt {
          font-size: 0.13rem;
          color: #787878;
          opacity: 0.4;
        }
      }
      .item:first-child {
        border-left: none;
      }
    }
    .lesson_lock {
      .lock_row {
        display: flex;
        margin-bottom: 0.12rem;
        .name {
          width: 0.54rem;
          height: 0.54rem;
          border-radius: 100%;
          text-align: center;
          font-size: 0.1rem;
          color: #fff;
          line-height: 0.54rem;
          margin-right: 0.2rem;
        }
        .lock_level {
          width: 2.76rem;
          height: 0.54rem;
          border-radius: 0.27rem;
          display: flex;
          box-sizing: border-box;
          overflow: hidden;
          .lock_item {
            padding: 0.09rem 0;
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            .lock {
              width: 0.21rem;
              height: 0.2rem;
              position: absolute;
              z-index: 10;
              top: 50%;
              margin-top: -0.1rem;
              left: 50%;
              margin-left: -0.1rem;
            }
            p {
              color: #d8d8d8;
              font-size: 0.1rem;
              opacity: 0.6;
            }
          }
          .lock_item:before {
            content: "";
            height: 0.36rem;
            width: 0.01rem;
            position: absolute;
            background: #c6c6c6;
            top: 0.09rem;
            left: 0.01rem;
          }
          .lock_item:first-child:before {
            content: "";
            height: 0.36rem;
            width: 0rem;
          }
          .unlock_y {
            background: #ffc151;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_blue {
            background: #6edbef;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_red {
            background: #ff696c;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_purple {
            background: #777dff;
            p {
              color: #fff;
              opacity: 1;
            }
          }
        }
      }
      .lock_row_y {
        .name {
          background: #ffc151;
        }
        .lock_level {
          border: 0.01rem solid #ffc151;
        }
      }
      .lock_row_b {
        .name {
          background: #6edbef;
        }
        .lock_level {
          border: 0.01rem solid #6edbef;
        }
      }
      .lock_row_r {
        .name {
          background: #ff696c;
        }
        .lock_level {
          border: 0.01rem solid #ff696c;
        }
      }
      .lock_row_p {
        .name {
          background: #777dff;
        }
        .lock_level {
          border: 0.01rem solid #777dff;
        }
      }
    }
  }
}
</style>