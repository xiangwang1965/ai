<template>
  <div id="teacherView">
    <div class="row-bg">
      <h3>教师档案</h3>
      <div>
        <div style="margin-top: 15px;">
          <el-input
            size="mini"
            placeholder="搜索姓名/ID"
            v-model="params.searchTxt"
            prefix-icon="el-icon-search"
          >
            <el-button slot="append" @click="getData" type="warning">搜索</el-button>
          </el-input>
          <dl>
            <dd :key="i" v-for="(item,i) in list" @click="queryTeacherInfo(item.id)">
              <el-image style="width: 100px; height: 100px" :src="url"></el-image>
              <span class="demonstration">{{item.name}}</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="row-bg">
      <h3>教师信息</h3>
      <div class="t_info">
        <div class="info">
          <div class="info_box">
            <div class="infoImg">
              <div class="myPic">
                <img :src="url" alt>
              </div>
            </div>
            <p>{{tInfo.name}}</p>
            <p>ID:{{tInfo.id}}</p>
            <p>{{tInfo.level}}</p>
          </div>
        </div>
        <div class="count">
          <div class="countNum">
            <h5 id="studentNum">{{tInfo.totalStu}}</h5>
            <p>培训学生总数</p>
          </div>
          <i></i>
          <div class="countNum">
            <h5 id="courseNum">{{tInfo.totalCourse}}</h5>
            <p>培训课程总数</p>
          </div>
          <i></i>
          <div class="countNum">
            <h5 id="totalNum">{{tInfo.totalDay}}</h5>
            <p>上课总天数</p>
          </div>
        </div>
        <div class="course">
          <div class="classify scratch">
            <div class="flex_title">
              <div class="flex">
                <p class="title">scratch</p>
              </div>
            </div>
            <div class="flex_content">
              <div class="flex">
                <div class="lock Unlock">
                  <p>level1</p>
                  <p>初级课程</p>
                </div>
              </div>
              <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
              <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
            </div>
          </div>
          <div class="classify python">
            <div class="flex_title">
              <div class="flex">
                <p class="title">PYTHON</p>
              </div>
            </div>
            <div class="flex_content">
              <div class="flex">
                <div class="lock Unlock">
                  <p>level1</p>
                  <p>初级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
            </div>
          </div>
          <div class="classify NOIP">
            <div class="flex_title">
              <div class="flex">
                <p class="title">NOIP</p>
              </div>
            </div>
            <div class="flex_content">
              <div class="flex">
                <div class="lock Unlock">
                  <p>level1</p>
                  <p>初级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
            </div>
          </div>
          <div class="classify AI">
            <div class="flex_title">
              <div class="flex">
                <p class="title">AI</p>
              </div>
            </div>
            <div class="flex_content">
              <div class="flex">
                <div class="lock Unlock">
                  <p>level1</p>
                  <p>初级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
                </div>
              </div>
               <i></i>
              <div class="flex">
                <div class="lock lockup">
                  <p>level2</p>
                  <p>中级课程</p>
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
      list: [],
      url: "../../static/img/default_avatar.png",
      tInfo: {},
      teachId: "",
      dateOption: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      params: {
        searchTxt: ""
      }
    };
  },
  created() {
    this.getData();
    this.queryTeacherInfo();
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
    getData() {
      teacher.querylist(this.params).then(res => {
        if (res.code === "001") {
          this.list = res.data;
        }
      });
    },
    queryTeacherInfo(id) {
        var p = {

        };
        p.teacherId = id || '1';
      teacher.queryTeacherInfo(p)
        .then(res => {
          if (res.code === "001") {
            this.tInfo = res.data;
          }
        });
    },
    getGradeList() {
      let params = {
        school_id: this.schoolId
      };
      courseApi.getGradeList(params).then(res => {
        this.optionGrade = res;
      });
    },
    getStudent() {
      let params = {
        student_id: this.student_id
      };
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.params = res.data;
          this.params.telephone = Number(this.params.telephone);
          // 家长电话只为数字类型
          this.params.parent_telephone =
            this.params.parent_telephone === ""
              ? ""
              : Number(this.params.parent_telephone);
          // gender后台返回0时显示未知
          !this.params.gender && (this.params.gender = 3);
        }
      });
    },
    handleAllDate(val) {},
    handleAddClass() {
      this.$dialog.open("classTypeChoose");
    },
    handleDelete(index, row) {
      this.$confirm("是否确定删除该学生?", "提示", {
        confirmButtonText: "确 定",
        confirmButtonClass: "cac-button-one dialog_confirm_button is-round",
        cancelButtonText: "取 消",
        cancelButtonClass: "cac-button-two dialog_cancel_button is-round"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            center: true
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true
          });
        });
    },
    doCreate(formName) {
      if (this.canSubmit) {
        this.canSubmit = false;
        this.loading = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = this.params;
            if (this.status === "create") {
              let loadingInstance = this.$loading({
                text: "创建中...",
                target: ".appMain"
              });
              studentApi.create(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close();
                }, 500);
                this.canSubmit = true;
                this.loading = false;
                if (res.ok) {
                  this.$router.back();
                }
              });
            } else {
              params.student_id = this.student_id;
              let loadingInstance = this.$loading({
                text: "修改中...",
                target: ".appMain"
              });
              studentApi.update(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close();
                }, 500);
                this.canSubmit = true;
                this.loading = false;
                if (res.ok) {
                  this.$router.back();
                }
              });
            }
          } else {
            this.canSubmit = true;
            this.loading = false;
            return false;
          }
        });
      }
    },
    doCancle() {
      this.$router.back();
    }
  }
};
</script>
<style lang="less" scoped>
#teacherView {
  width: 100vw;
  height: 100vh;
  dd {
    padding: 30px 0;
    text-align: center;
    display: inline-block;
    width: 30%;
    box-sizing: border-box;
    vertical-align: top;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-input {
    background: #e6e8ef;
    border-radius: 30px;
    width: 80%;
  }
}
#teacherView .row-bg {
  float: left;
  height: 100vh;
}
#teacherView .row-bg:first-child {
  width: 35%;
  border-right: 1px solid #eff2f6;
}
#teacherView .row-bg:last-child {
  width: 59%;
  padding: 0 20px;
}
.el-row {
  float: left;
  height: 100%;
  background-color: red;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.info {
  width: 100%;
  height: 230px;
}
.info_box {
  width: 190px;
  margin: auto;
  padding-top: 40px;
}
.info_box p {
  font-size: 18px;
  color: #072a5b;
  text-align: center;
  margin-top: 10px;
}
.infoImg {
  width: 100%;
  height: 114px;
}
.infoImg {
  width: 100%;
  height: 114px;
  position: relative;
}
.myPic {
  width: 100px;
  height: 100px;
  background: #fff;
  padding: 2px;
  border: 4px solid rgba(168, 215, 254, 0.6);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -50px;
  margin-top: -50px;
}
.myPic img {
  display: block;
  width: 100%;
}
.myPic img {
  border-radius: 50%;
}
.count {
  width: 90%;
  height: 120px;
  margin: auto;
  margin-top: 34px;
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 20px;
  width: 359px;
  height: 100px;
}
.count i {
  display: block;
  float: left;
  width: 1px;
  height: 50px;
  background: #e5e5e5;
  margin-top: 35px;
}
.countNum {
  width: 33%;
  height: 120px;
  float: left;
}
.countNum h5 {
  font-size: 24px;
  color: #072a5b;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 6px;
}
.countNum p {
  font-size: 14px;
  color: #8799bd;
  text-align: center;
}

.t_info {
  background: #ffffff;
  border-radius: 30px;
  height: 90%;
  width: 76%;
  margin-top: 20px;
}

.course {
  width: 359px;
  margin: auto;
  margin-top: 20px;
  position: relative;
}
.classify {
  width: 100%;
  height: 65px;
}
.flex_title {
  width: 25%;
  height: 54px;
  float: left;
  margin-top: 20px;
}
.flex_content {
  width: 75%;
  height: 54px;
  float: left;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 27px;
  border: 1px solid #ffc151;
}
.flex {
  float: left;
  width: 33%;
  height: 54px;
}
.title {
  width: 54px;
  height: 54px;
  color: #fff;
  line-height: 54px;
  border-radius: 50%;
  background: #ffc151;
  margin-left: 10%;
  font-family: HYQiHei-GZS;
  font-size: 10px;
  letter-spacing: 0;
  text-align: center;
}
.lock {
  width: 90%;
  height: 54px;
  position: relative;
  cursor: pointer;
}
.lock:last-child {
  margin-right: 0;
}
.lock p {
  font-family: HYQiHei-GZS;
  font-size: 10px;
  color: #8799bd;
  letter-spacing: 0;
  text-align: center;
}
.lock p:first-child {
  padding-top: 18px;
}
.lock_mask {
  background: #fff;
  //box-shadow: 0px 0px 0px 0px #fff;
}
.lock_mask p {
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #cbe1ff;
  /*color: #f63b3e;*/
}
.lock_mask p:first-child {
  padding-top: 18px;
}

.flex_content i {
  display: block;
  float: left;
  width: 1px;
  height: 50px;
  background: #e5e5e5;
}
.scratch .lock {
}
.python .lock {
}
.NOIP .lock {
}
.AI .lock {
}
.lock_mask {
  width: 100%;
  height: 80px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 5px;
  display: none;
}
// .lock_mask i{
// 	display: block;
// 	width: 18px;
// 	height: 22px;
// 	position: absolute;
// 	left: 50%;
// 	top: 50%;
// 	margin-left: -9px;
// 	margin-top: -11px;
// 	background: url(../images/personal/yellow.png);
// }
// .scratch .lock_mask i{
// 	background: url(../images/personal/yellow.png);
// }
// .python .lock_mask i{
// 	background: url(../images/personal/ss.png);
// }
// .NOIP .lock_mask i{
// 	background: url(../images/personal/hs.png);
// }
// .AI .lock_mask i{
// 	background: url(../images/personal/ls.png);
// }
</style>