<template>
  <div id="teacherView" class="feedback">
    <div class="content1">
      <p class="content_title">FAQ</p>
      <div class="left_content" style="height: 6.67rem;background: #fff;border-radius: 0.2rem;">
        <el-collapse v-model="activeNames" @change="handleChange" class='faqList'>
          <el-collapse-item :title="item.question" :name="index" v-for="(item,index) in faqInfo" :key="index">
            <div>{{item.answer}}</div>
          </el-collapse-item>
          <!-- <el-collapse-item title="反馈 Feedback" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item> -->
        </el-collapse>
      </div>
    </div>
    <div class="content2">
      <div class="content_title">问题反馈</div>
      <!-- <div class="right_content teacher_info" style="height: 6.67rem;position:relative;">
 <iframe src="http://web.wisetechai.com/userInfo/index.html" frameborder="0" width="100%" height="100%" id="childFrame" style="border-radius:0.2rem;position:relative;" v-scrollBar></iframe>
      </div> -->
      <div class="right_content teacher_info" style="height: 6.87rem;position:relative;overflow: auto;padding: 0.2rem;box-sizing: border-box;">
          <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="您的姓名：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入您的姓名"></el-input>
          </el-form-item>
          <el-form-item label="您的电话：" prop="photo">
            <el-input v-model="ruleForm.photo" placeholder="请输入您的电话"></el-input>
          </el-form-item>
          <el-form-item label="您的邮箱：" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入您的邮箱"></el-input>
          </el-form-item>
          <el-form-item label="反馈问题：" prop="content" 
            :rules="[
              { required: true, message: '请输入反馈问题', trigger: 'blur' },
            ]"
          >
            <el-input type="textarea" v-model="ruleForm.content" :rows="6" placeholder="请输入反馈问题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" style="width:2rem;margin-top:0.2rem">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  
</template>
<script>

import reportApi from "@/services/teacher";
export default {
  data() {
    return {
      faqInfo:[],
      activeNames: ['1'],
      ruleForm: {
          name: '',
          phont:'',
          email:'',
          content: ''
        },
    }
  },
  created(){
    this.getFaq()
  },
  methods:{
    getFaq(){
      reportApi
          .queryFaq({})
          .then(res => {
            if (res.code == "001") {
              this.faqInfo = res.data
            }
          });
    },
    handleChange(val) {
        //console.log(val);
    },
    submitForm(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          reportApi
          .queryFeedBack(this.ruleForm)
          .then(res => {
            if (res.code == "001") {
              this.$alert('问题反馈提交成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              });
              self.$refs[formName].resetFields();
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }

};
</script>
<style lang='less'>
  .feedback{
    .el-collapse-item__header{
      height: auto;
    }
  }
</style>

<style lang="less" scoped>
#teacherView {
  display: flex;
  flex: 1;
  .faqList{
    padding-left:0.3rem;
    padding-top:0.3rem;
    border: none;
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