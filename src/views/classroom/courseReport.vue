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
            </div>
            <div style="width:100%;margin:0.29rem auto">
                    <el-select v-model="form.hour_id" placeholder="请选择课时" style="margin-right:0.1rem;" @change="getReportInfo">
                    <el-option :key="i" v-for="(item,i) in courseList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
            </div>
          </div>
            <el-form ref="form" :label-position="formalign" :model="form" class="dialog_rig" label-width="2rem" size="mini">
            <ul class="form dialog_form">
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
            </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
export default {
  props: ["curStudent", 'curClsId','studentlist','courseList','currentClass'],
  data() {
    return {
        formalign:'left',
      showManage: true,
      defaultImg: require("../../../static/img/student.png"),
      tInfo: {
        avatar:  require("../../../static/image/person_background.png"),
        nameIcon:  require("../../../static/image/name_icon.png")
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
          hour_id:'',
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
      this.getReportInfo();
  },
  methods: {
    getReportInfo(hourId) {
        let params = {
            clsId:this.curClsId,
            studentId:this.curStudent.id,
            hourId: hourId || this.courseList[0].id
        }
        classApi.courseReportInfo(params).then(res=>{
            if (res.code === '001') {
                if (res.data) {
                    this.form = res.data;
                } else {
                    this.form = {
          studentId:1,
          classId:1,
          courseId:1,
          value:'',
          task:'',
          feedback:'',
          behavior:'',
          hour_id:'',
          operation:'',
          innovate:'',
          exchange:'',
          team:'',
          createDate:'',
          resist:'',
          createId:''
      }
                }
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
    color: #4A4A4A;
    font-size: 0.2rem;
  }
  .id {
    font-size: 0.16rem;
    color: #9B9B9B;
  }
  }

</style>


