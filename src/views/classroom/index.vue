<template>
  <div id="classContainer" class="classContainer">
    <div class="left">
      <h1 class="tit">班级管理</h1>
      <div class="round"></div>
      <p class="p">当前班级</p>
      <p class="btn">历史班级</p>
      <div class="sideContainer" style="z-index:100">
        <div class="item">
          <div class="classTitle orange" @click="getData(1)">
            <p class="txt orange">Scratch</p>
          </div>
          <el-collapse-transition>
            <ul class="classList one" v-show="show1">
              <li :class="{active:currentClass == item.id}" v-for="(item,index) in courseList.course1" :key="index" @click="getStudent(item,index)">
                <div class="top" style="height:50%">
                  <span class="one">{{item.name}}</span>
                  <span class="two orange">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                </div>
                <div class="bottom" style="height:50%;">
                  <span class="three orange">{{item.courseName}}</span>
                  <span class="four orange">{{item.teacherName}}</span>
                </div>
              </li>
              <div class="nodata" v-show="nodata1">暂无数据</div>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="item">
          <div class="classTitle green" @click="getData(2)">
            <p class="txt green">Python</p>
          </div>
          <el-collapse-transition>
            <ul class="classList two" v-show="show2">
              <li :class="{active:currentClass == item.id}" v-for="(item,index) in courseList.course2" :key="index" @click="getStudent(item,index)">
                <div class="top" style="height:50%">
                  <span class="one green">{{item.name}}</span>
                  <span class="two green">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                </div>
                <div class="bottom" style="height:50%;">
                  <span class="three green">{{item.courseName}}</span>
                  <span class="four green">{{item.teacherName}}</span>
                </div>
              </li>
              <div class="nodata" v-show="nodata2">暂无数据</div>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="item">
          <div class="classTitle red" @click="getData(3)">
            <p class="txt red">NOIP</p>
          </div>
          <el-collapse-transition>
            <ul class="classList three" v-show="show3">
              <li :class="{active:currentClass == item.id}" v-for="(item,index) in courseList.course3" :key="index" @click="getStudent(item,index)">
                <div class="top" style="height:50%">
                  <span class="one">{{item.name}}</span>
                  <span class="two red">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                </div>
                <div class="bottom" style="height:50%;">
                  <span class="three red">{{item.courseName}}</span>
                  <span class="four red">{{item.teacherName}}</span>
                </div>
              </li>
              <div class="nodata" v-show="nodata3">暂无数据</div>
            </ul>
          </el-collapse-transition>
        </div>
        <div class="item">
          <div class="classTitle purple" @click="getData(4)">
            <p class="txt purple">AI</p>
          </div>
          <el-collapse-transition>
            <ul class="classList four" v-show="show4">
              <li :class="{active:currentClass == item.id}" v-for="(item,index) in courseList.course4" :key="index" @click="getStudent(item,index)">
                <div class="top" style="height:50%">
                  <span class="one">{{item.name}}</span>
                  <span class="two purpe">{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</span>
                </div>
                <div class="bottom" style="height:50%;">
                  <span class="three purpe">{{item.courseName}}</span>
                  <span class="four purpe">{{item.teacherName}}</span>
                </div>
              </li>
              <div class="nodata" v-show="nodata4">暂无数据</div>
            </ul>
          </el-collapse-transition>
        </div>
      </div>
      <el-button type="default" @click="handleManage1" style="z-index:999" class="cac-button-one">管理</el-button>
    </div>
    <div class="content2">
      <div class="content_title">SCRATCH初级编程1班</div>
      <div class="right_content">
        <div class="tab">
          <ul>
            <li class="tab_item">班级</li>
            <li class="tab_item tab_active">学员管理</li>
          </ul>
        </div>
         <div class="classInfo" id="classInfo">
        <div class="classInfoItem student_management">
          <div class="search_position">
            <div class="search_box" style="float:right">
                <el-input placeholder="搜索姓名/ID" size="mini" prefix-icon="el-icon-search" class="search_btn" v-model="searchData">
                <el-button slot="append" class="search_btn1" @click="search"> 搜索</el-button>
            </el-input>
            </div>
          </div>
          <div class="class_infomation">
            <div class="item1">班级信息</div>
            <div class="item2">
              <span>{{startDate}}</span>
              <span>{{startTime}}-{{endTime}}</span>
              <span>时间</span>
            </div>
            <div class="item3">
              <span class="item_num">{{level}}</span>
              <span class="item_txt">等级</span>
            </div>
            <div class="item3">
              <span class="item_num">{{stuCnt}}</span>
              <span class="item_txt">班级人数</span>
            </div>
          </div>
          <div class="person_List">
            <div class="person_box" v-for="(item,i) in studentsList" :key="i">
              <div class="person_name">{{item.name}}</div>
              <div class="person_handle">
                <div class="icon1"></div>
                <div class="icon2"></div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="btn_124 personManagement_btn" id='showPersonDialog' @click="handleManage2">管理</div>
    </div>
 <el-dialog center append-to-body title="学生管理" width="80%" :visible.sync="showManage2">
       <studentManage :currentType="currentType" ref="studentsManage" :currentClass="current" :studentlist="studentsList"></studentManage>
    </el-dialog>
    <el-dialog center append-to-body title="班级管理" :visible.sync="showManage1">
       <classManage v-on:refresh="refresh" ref="classManage" :currentIndex="currentIndex" :datalist="currentList"></classManage>
    </el-dialog>
  </div>
</template>
<script>
import classApi from "@/services/classroom";
import studentManage from './studentManage';
import classManage from './classManage';
export default {
  data() {
    return {
      activeNames: ["1"],
      courseList: {
        course1: [],
        course2: [],
        course3: [],
        course4: []
      },
      studentsList:[],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      nodata1:false,
      nodata2:false,
      nodata3:false,
      nodata4:false,
      classTitle:'',
      startDate:'',
      startTime:'',
      endTime:'',
      level:'',
      stuCnt:'',
      isFirst:true,
      currentClass:'',
      showManage1:false,
      showManage2:false,
      currentIndex:'',
      currentList:[],
      currentType:'',
      searchData:''
    };
  },
  computed:{
    current(){
      return this.courseList['course' + this.currentType][this.currentIndex];
    }
  },
  created() {
    this.getData(1);
  },
  mounted(){
    let that = this;
    window.addEventListener('scroll',function(e){
      if(this.showManage1 || this.showManage2){
        e.preventDefault();
      }
    },false)
  },
  components:{
    studentManage,
    classManage
  },
  methods: {
    handleChange(val) {
    },
    handleManage1(){
      this.showManage1 = true;
      if(this.$refs.classManage){
         this.$refs.classManage.setRight(this.currentList[this.currentIndex]);
      }
    },
    handleManage2(){
      this.showManage2 = true;
      if(this.$refs.studentsManage){
         this.$refs.studentsManage.setClass();
         this.$refs.studentsManage.getCodeList(this.currentClass);
      }
    },
    search(){
      let params = {
        clsId:this.currentClass,
        searchTxt:this.searchData
      }
      classApi.search(params).then(res => {
        this.studentsList = res.data;
      })
    },
    refresh(data){
      this.courseList['course' + this.currentType] = Object.assign({},data);
      this.getStudent(data[0],0);
    },
    getData(typeId) {
      let params = {
        schoolId: 1,
        typeId: typeId
      };
      let that = this;
      for(let i = 1; i <= 4;i++){
        if(typeId !== i){
          this['show' + i] = false;
        }
      }
      this.currentType = typeId;
      this["show" + typeId] = !this["show" + typeId];
      if (!this.courseList['course'+ typeId.length]) {
        classApi.getData(params).then(res => {
          if (res.data && res.data.length) {
            this.courseList["course" + typeId] = Object.assign({}, res.data);
            this.currentList = res.data;
            if(this.isFirst){
              this.getStudent(res.data[0],0);
              this.currentClass = res.data[0].id;
              this['nodata' + typeId] = false;
            }
          } else {
            this.courseList["course" + typeId] = [];
            this.currentList = [];
            this['nodata' + typeId] = true;
          }
        });
      } else {
        this.currentList = this.courseList['course'+ typeId.length];
      }
    },
    getStudent(item,index) {
      this.classTitle = item.name;
      this.startDate = item.startDate;
      this.beginTime = item.beginTime;
      this.endTime = item.endTime;
      this.level = item.level;
      this.stuCnt = item.stuCnt;
      this.currentClass = item.id;
      this.currentIndex = index;
      let params = {
        clsId: item.id,
        searchTxt:''
      };
      classApi.getStudent(params).then(res => {
        this.studentsList = res.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@orange:#ffc151;
@green:#6edbef;
@red:#ff696c;
@purpe:#8b90ff;
.classContainer {
  padding:20px 20px;
  .left {
    width: 513px;
    position: relative;
    left:-3vw;
    height: 100%;
    .el-button {
      position: absolute;
      left: 16vw;
      top: 85vh;
    }
    .tit {
      position: absolute;
      left: 18px;
    }
    .round {
      width: 10px;
      height: 10px;
      border: 2px solid #4592fe;
      border-radius: 50%;
      position: absolute;
      top: 43px;
    }
    .p {
      position: absolute;
      left: 26px;
      top: 40px;
      font-family: "HYQiHei-EES";
      font-size: 15px;
      color: #4592fe;
      letter-spacing: 1.5px;
    }
    .btn {
      background: #4592fe;
      border-radius: 5px;
      font-family: "HYQiHei-EES";
      font-size: 15px;
      color: #ffffff;
      letter-spacing: 1.5px;
      width: 70px;
      height: 23px;
      line-height: 23px;
      position: absolute;
      left: 307px;
      top: 40px;
      padding: 0 2px;
    }
    .sideContainer {
      position: absolute;
      width: 413px;
      height: 50vh;
      left: 0px;
      top: 60px;
      .item {
        margin:15px 0px;
        .classTitle {
          width: 450px;
          height: 36px;
          .txt {
            width: 115px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            font-family: "HYQiHei-GZS";
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            border-radius: 6px 6px 0px 0px;
            &.orange {
              background: @orange;
            }
            &.green {
              background: @green;
            }
            &.red {
              background: @red;
            }
            &.purple {
              background: @purpe;
            }
          }
          &.orange {
            border-bottom: 3px solid @orange;
          }
          &.green {
            border-bottom: 3px solid @green;
          }
          &.red {
            border-bottom: 3px solid @red;
          }
          &.purple {
            border-bottom: 3px solid @purpe;
          }

        }
        .nodata{
          width:100%;
          height:50px;
          line-height: 50px;
          text-align: center;
          color:#ccc
        }
        .classList {
          overflow: auto;
          &.one{
            li{
              &.active{
                background:@orange;
              }
            }
          }
          &.two{
            li{
              &.active{
                background:@green;
              }
            }
          }
          &.three{
            li{
              &.active{
                background:@red;
              }
            }
          }
          &.four{
            li{
              &.active{
                background:@purpe;
              }
            }
          }
          li{
            width:100%;
            height:58px;
            background:#fff;
            border-radius: 20px;
            padding:10px 20px;
            margin:10px 0px;
            div{
              &.bottom{margin-top:3px;}
              .one{
              font-family: HYQiHei-GZS;
              font-size: 16px;
              letter-spacing: 0;
              float:left;
              }
            .two{
              float:right;
              font-size:14px;
              &.orange{color:@orange}
              &.green{color:@green}
              &.red{color:@red}
              &.purpe{color:@purpe}
            }
            .three{
              float:left;
              font-size:14px;
              &.orange{color:@orange}
              &.green{color:@green}
              &.red{color:@red}
              &.purpe{color:@purpe}
            }
            .four{
              float:right;
              font-size:12px;
              font-family: HYQiHei-FZS;
              font-size: 14px;
              color: @orange;
              letter-spacing: 0;
              &.orange{color:@orange}
              &.green{color:@green}
              &.red{color:@red}
              &.purpe{color:@purpe}
            }
            }
            &.active{
              div > .one{color:#fff}
              div > .two{color:#fff}
              div > .three{color:#fff}
              div > .four{color:#fff}
            }
          }
        }
      }
    }
  }
  .center {
    width: 1px;
    height: 400px;
    background: #b6b6b6;
    position: absolute;
    top: 20vh;
    left: 500px;
  }
  .right {
    position: relative;
    left: 520px;
    width:40vw;
    height:100vh;
    top: 0;
    .h3 {
      font-family: HYQiHei-GZS;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 10px;
      left: 0px;
    }
    .search_btn {
      float:right;
      margin-right:130px;
      margin-top:20px;
    }
    .el-input {
      width: 18vw;
    }
    .manage2{
      position:absolute;
      top:85vh;
      left:150px;
    }
    .tabs {
      width:30vw;
      height: 80px;
      float:left;
      border-bottom: 3px solid #ffc151;
      div {
        float:left;
        margin-top:45px;
        span {
          display: inline-block;
          background: #ffd893;
          border-radius: 6px 6px 0px 0px;
          font-family: "HYQiHei-GZS";
          font-size: 14px;
          color: #ffffff;
          width: 80px;
          height: 35px;
          letter-spacing: 0;
          text-align: center;
          line-height: 35px;
          &.active {
            background: #ffc151;
          };
          &:last-child{margin-left:-5px;}
        }
      }
    }
    .rightInfo{
      float:left;
      width:428px;
      height:104px;
      background:#ffffff;
      padding:10px 0;
      border-radius: 20px;
      margin-top:20px;
      li{
        float:left;
        width:107px;
        height:84px;
        line-height: 64px;
        border-right:1px solid #b9b9b9;
        p{
          display: inline;
          color:#9B9B9B;
          font-family: HYQiHei-GZS;
          font-size: 12px;
          letter-spacing: 0;
          text-align: center;
          &.big{font-size:24px;}
        }
        &:last-child{border-right:none}
      }
    }
    .students{
      width:428px;
      float:left;
      li{
        margin-top:20px;
        height:66px;
        border:none;
        border-radius: 42px;
        background:#ffffff;
        width:100%;
      }
    }

  }
}
</style>
