<template>
    <div class="dialog_content_big">
      <div class="dialog_center">
        <div class="dialog_l_r">
          <div class="dialog_left" style="width: 2.36rem">
            <div class="teacher_box" style="width: 100%;padding-top:0.59rem">
              <img :src="tInfo.avatar" alt class="photo">
              <p class="name">{{stuInfo.name}}</p>
              <p class="id">ID:{{stuInfo.id}}</p>
              <span class="grade">level:{{stuInfo.level}}</span>
              <p class="phone">联系电话：{{stuInfo.phone}}</p>
            </div>
            <div class="intr_box" style="width: 1.82rem">
              <div class="intr_row">
                <img :src="tInfo.nameIcon" alt style="width: 0.1rem;height: 0.13rem;;"> 机构：
                <span>{{stuInfo.shcoolName}}</span>
              </div>
            </div>
          </div>
            <el-form ref="form" :model="form"  @keyup.enter.native="handleSub" class="dialog_rig" style="padding:0 0.2rem;text-align: left;width:7.14rem">
            <ul class="form dialog_form">
                <el-form-item label="· 课时选择:">
                    <el-select v-model="form.hourId" placeholder="请选择课时">
                    <el-option :key="i" v-for="(item,i) in courseList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
            </el-form-item>
              <li class="form_row">
                <div class="form_lable">· 学习内容:</div>
                <div class="form_box">
                  <textarea v-model="form.value"></textarea>
                </div>
              </li>
              <li class="form_row">
                <div class="form_lable">· 课后作业:</div>
                <div class="form_box">
                  <textarea v-model="form.task"></textarea>
                  {{form.task}}
                </div>
              </li>
              {{form.task}}
              <li class="form_row">
                <div class="form_lable">· 课堂表现:</div>
                <div class="form_box">
                  <textarea v-model="form.feedback"></textarea>
                </div>
              </li>
              <li class="form_row">
                <div class="form_lable">· 老师反馈:</div>
                <div class="form_box">
                  <textarea  v-model="form.behavior"></textarea>
                </div>
              </li>

              <li class="form_row">
                <div class="form_lable">· 课堂评估:</div>
                <div class="form_box">
                  <p>打分制度为从低到高</p>
                  <div class="radio_group">
                     <el-form-item label="操作能力">
                          <el-radio-group v-model="form.operation">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="创新能力">
                          <el-radio-group v-model="form.innovate">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="交流能力">
                          <el-radio-group v-model="form.exchange">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="团队能力">
                          <el-radio-group v-model="form.team">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="抗挫折能力">
                          <el-radio-group v-model="form.resist">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                  </div>
                </div>
              </li>
            </ul>
            <!-- <div class="dialog_bottom">
              <div class="btn_124" @click="handleSub" id="submit_s">保存</div>
            </div> -->
            </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
export default {
  props: ["curStudent", 'curClsId','studentlist','courseList'],
  data() {
    return {
      showManage: true,
      defaultImg: require("../../../static/img/student.png"),
      tInfo: {
        avatar: require("../../../static/image/person_background.png"),
        nameIcon: require("../../../static/image/name_icon.png")
      },
      currentStudent: "",
      codeList: [],
      showCreate: false,
      stuInfo:{},
      form:{
          studentId:1,
          classId:1,
          courseId:1,
          value:'',
          task:'',
          feedback:'',
          behavior:'',
          hourId:'',
          operation:'',
          innovate:'',
          exchange:'',
          team:'',
          createDate:'',
          resist:'',
          createId:''
      }
    };
  },
  components: {
    createStudent
  },
  watch: {
    currentClass() {
      console.log(this.currentClass);
    }
  },
  created() {
      this.getStuInfo(this.curStudent.id);
  },
  methods: {
      getReportInfo() {
        let params = {
            clsId:this.curClsId,
            studentId:this.curStudent.id,
            hourId:this.courseList[0].id
        }
        classApi.courseReportInfo(params).then(res=>{
            if (res.code === '001') {
                this.form = res.data;
            }
            console.log(res.data);
        });
    },
    getStuInfo(stuId) {
      let params = {
        id: stuId
      };
      classApi.getStuInfo(params).then(res => {
          console.log(res);
          if (res.code === '001') {
              this.stuInfo = res.data;
          }
        // if (this.$refs.child) {
        //   this.$refs.child.setCodeOptions(this.codeList);
        // }
      });
    },
    deleteStudent(student) {
      this.$confirm("确定删除学生" + student.name + "吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      }).then(() => {
        let params = {
          clsId: this.currentClass.id,
          studentId: student.id
        };
        classApi
          .deleteStudent(params)
          .then(res => {
            if (res.code === "001") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$router.push({ path: "/class" });
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          });
      });
    },
    handleSub() {
      classApi
        .courseReportAdd(this.form)
        .then(res => {
          if (res.code === "001") {
            this.$message({
              message: "提交成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
    @bottom:1px solid #979797;
    .el-icon-delete{
        cursor: pointer;
        color:cornflowerblue;
    }
    .top{width:100%;height:5px;border-bottom:@bottom}
    .h3{
        width:100%;
        height:44px;
        line-height:44px;
        border-bottom:@bottom;
        color:#000;
        text-align: center;
    }
      .dialog_content_big{
        height: 98%;
        left:25%;
        top:1%;
        background: #fff;
        border-radius: 0.23rem;
        display: flex;
        .dialog_center{
            border-top: none;
            padding-top:0.23rem;
            box-sizing: border-box;
        }
        .dialog_bottom{
            .btn_124{
                margin: 0rem auto 0.4rem;
            }
        }

    }
    .dialog_header{
        height: 0.81rem;
        text-align: center;
        line-height: 0.81rem;
        color:#4A4A4A;
        font-size: 0.22rem;
        position: relative;
    }

    .dialog_center{
        flex: 1;
        border-top:0.01rem solid #979797;
        overflow: auto;
        text-align: center;
        .dialog_l_r{
            width: 100%;
            height: 100%;
            display: flex;
            .dialog_title{
                height: 0.5rem;
                line-height: 0.51rem;
                border-bottom:0.01rem solid #979797;
                font-size: 0.18rem;
                text-align: center;
                color:#4A4A4A;
            }
            .dialog_left{
                width: 2.55rem;
                border-right: 0.01rem solid #979797;
                .item_delete{
                    width: 0.11rem;
                    height: 0.13rem;
                    padding:0 0.23rem;
                }
                .dialog_l_top{
                    display: flex;
                    height: 2.86rem;
                    flex-direction: column;
                    .top_list{
                        flex:1;
                        .item{
                            width: 100%;
                            height: 0.51rem;
                            border-bottom: 0.01rem solid #979797;
                            display: flex;
                            align-items: center;
                            .item_photo{
                                width: 0.4rem;
                                height: 0.4rem;
                                display: block;
                                padding:0 0.1rem 0 0.17rem;
                            }
                            .item_center{
                                color:#4A4A4A ;
                                flex:1;
                                .name{
                                    font-size: 0.15rem;
                                    text-align: left;
                                }
                                .name_label{
                                    font-size: 0.12rem;
                                    text-align: left;
                                }
                            }

                        }
                    }
                    .dialog_l_btn{
                        height: 0.99rem;

                        .btn_172{
                            margin:0.11rem auto;
                            height: 0.33rem;
                            line-height: 0.33rem;
                        }
                    }
                }
                .dialog_l_bottom{
                    height: 2.6rem;
                    border-top:0.01rem solid #979797;
                    .bottom_list{
                        .item{
                            width: 100%;
                            height: 0.4rem;
                            border-bottom: 0.01rem solid #979797;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            span{
                                padding-left:0.2rem;
                            }
                        }
                    }
                }
            }
            .dialog_rig{
                flex: 1;
                display: flex;
                flex-direction: column;
                .dialog_r_top{
                    flex:1;
                }
                .dialog_r_bottom{
                    height: 1.11rem;
                    display: flex;
                    align-items: center;
                    border-top: 0.01rem solid #979797;
                    justify-content: center;
                }
            }
        }
    }
    .dialog_footer{
        height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content:center;
        border-top: 0.01rem solid #979797;
    }
</style>


