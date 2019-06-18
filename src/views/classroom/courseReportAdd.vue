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
            <el-form ref="form" :label-position="formalign" :model="form"  @keyup.enter.native="handleSub" class="dialog_rig" label-width="2rem" size="mini">
            <ul class="form dialog_form">
                <el-form-item label="· 课时选择:">
                    <el-select v-model="form.hourId" placeholder="请选择课时">
                    <el-option :key="i" v-for="(item,i) in courseList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="· 学习内容:" prop="value">
                    <el-input type="textarea" v-model="form.value" :rows="4" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="· 课后作业:" prop="task">
                    <el-input type="textarea" v-model="form.task" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="· 课堂表现:" prop="feedback">
                    <el-input type="textarea" v-model="form.feedback" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="· 老师反馈:" prop="behavior">
                    <el-input type="textarea" v-model="form.behavior" :rows="4"></el-input>
                </el-form-item>
              <li class="form_row">
                <div class="form_lable">· 课堂评估:</div>
                <div class="form_box">
                  <p>打分制度为从低到高</p>
                  <div class="radio_group">
                     <el-form-item label="操作能力">
                          <el-radio-group v-model="form.operation" size="mini">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="创新能力">
                          <el-radio-group v-model="form.innovate" size="mini">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="交流能力">
                          <el-radio-group v-model="form.exchange" size="mini">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="团队能力">
                          <el-radio-group v-model="form.team" size="mini">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="抗挫折能力">
                          <el-radio-group v-model="form.resist" size="mini">
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
            <div class="dialog_bottom">
              <div class="btn_124" @click="handleSub" id="submit_s">保存</div>
            </div>
            </el-form>
        </div>
      </div>

      <el-dialog :visible.sync="showSucBox" custom-class="dialog_result" center append-to-body  width="30%" id="dialog_result">
            <div class="dialog_center">
                <img :src="sucImg" class="result_icon">
                <p class="result_txt">保存成功！</p>
            </div>

    </el-dialog>
    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
export default {
  props: ["curStudent",'studentlist','courseList','curClsId'],
  data() {
    return {
    showSucBox:false,
      formalign:'left',
      showManage: true,
      defaultImg: require("../../../static/img/student.png"),
      sucImg: require('../../../static/image/result_success.png'),
      tInfo: {
        avatar: require("../../../static/image/person_background.png"),
        nameIcon: require("../../../static/image/name_icon.png")
      },
      currentStudent: "",
      codeList: [],
      showCreate: false,
      stuInfo:{},
      form:{
          studentId:this.curStudent.id,
          classId:this.curClsId,
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
    console.log(this);
  },
  methods: {
      getCoursePlan(currentClass) {
      let params = {
        clsId: this.curStudent.id,
      };
        classApi.getCoursePlan(params).then(res => {
            if (res.code === '001') {
                this.courseList = res.data.list;
            }

      })
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
    this.$emit('toggleReportAdd');
      classApi
        .courseReportAdd(this.form)
        .then(res => {
          if (res.code === "001") {
            // this.$message({
            //   message: "提交成功",
            //   type: "success"
            // });
            this.showSucBox = true;
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
    .dialog_center {
        overflow:hidden;
    }
    .dialog_form {
        .el-form-item {
            margin-left:0.34rem;
            margin-right:0.34rem
        }
        .form_row{
            .el-form-item {
                margin:auto;
            }
    }

    .dialog_result{
        height:3.61rem;
    }
    }
    #dialog_result {
       .dialog_center {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 0;
        text-align:center;
        overflow:auto;
         .result_icon {
            width: 1.1rem;
            height: 1.14rem;
            display: block;
        }
       .result_txt {
            text-align: center;
            color: #4A4A4A;
            font-size: 0.25rem;
            margin-top: 0.27rem;
       }
       }
    }
</style>


