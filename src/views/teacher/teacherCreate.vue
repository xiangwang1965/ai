<template>
<div class="dialog_wrap" id="addteacher">

    <div class="dialog_content">
        <div class="dialog_center">
            <el-form ref="form" class="dialog_form"  :rules="formRules" :model="form" size="mini" label-position="left" label-width="80px" >
                <ul class='form'>
                    <el-form-item label-width="120px" prop="name" label-position="left" class="form_box" label="姓名">
                        <el-input style="width:2rem" placeholder="请输入姓名" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex" label-width="120px">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label-position="center" prop="birthday" label-width="120px" label="出生年月">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label-position="center" prop="phone" label-width="120px" label="手机号">
                        <el-input v-model="form.phone" style="width:176px;"></el-input>
                    </el-form-item>
                    <el-form-item label-position="center" prop="passwd" label-width="120px" label="密码">
                        <el-input type="password" v-model="form.passwd" style="width:176px;"></el-input>
                    </el-form-item>
                    <el-form-item label-position="center" prop="verificode"  label-width="120px" label="验证码">
                        <el-input v-model="form.verificode" style="width:176px;">
                        </el-input>
                        <el-button style="border:none" type="default" @click="getCode">{{codeTxt}}</el-button>
                    </el-form-item>
                </ul>
            </el-form>
        </div>
        <div class="dialog_footer">
            <div class="btn_172" id="submit_form" @click="submit">保存</div>
        </div>
    </div>
         <el-dialog :visible.sync="showSucBox" custom-class="dialog_result" center append-to-body  width="30%" id="dialog_result">
            <div class="dialog_center">
                <img :src="sucImg" class="result_icon">
                <p class="result_txt">创建成功！</p>
            </div>

    </el-dialog>
</div>
</template>
<script>
import teacherApi from '../../services/teacher'
import classApi from '../../services/classroom'
import utils from '../../utils'
export default {
    props:['currentType','currentClass','codeOptions'],
    data(){
        return {
            showSucBox:false,
            sucImg: require('../../../static/image/result_success.png'),
            showSucBox:false,
            value:'',
            value1:'',
            showConfirm:false,
            code:'',
            form:{
                sex:1,
                name:'',
                phone:'',
                birthday:'',
                verificode:'',
                passwd:'',
            },
            timer:'',
            codeTime:60,
            codeTxt:'获取验证码',
            classTime:'',
            formRules:{
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                sex:[
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                phone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                birthday:[
                    { required: true, message: '请选择出生日期', trigger: 'blur' }
                ],
                verificode:[
                    { required: true, message: '请填写验证码', trigger: 'blur' }
                ],
                passwd:[
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            }
        }

    },
    created(){
    },
    methods:{
        reset(){
            this.form = {
                sex:1,
                name:'',
                phone:'',
                birthday:'',
                verificode:''
            }
            this.$refs.form.resetFields();
        },
        setCodeOptions(data){
            debugger;
            this.codeOptions = data;
        },
        getCode(){
          if(this.timer){
              return;
          }
          this.$refs.form.validateField('phone',valid=>{
              if(!valid){
                  let params = {
                      phone:this.form.phone
                  }
                  classApi.getVerificode(params).then(res => {
                    if(res.code === '001'){
                        this.$message({
                            message: '发送验证码成功，请查收！',
                            type: 'success'
                        });
                        this.timer = setInterval(() => {
                            this.codeTime--;
                            this.codeTxt= this.codeTime + 's后重新发送';
                            if(this.codeTime === 0){
                                clearInterval(this.timer);
                                this.timer = '';
                                this.codeTime = 60;
                                this.codeTxt = '重新发送';
                            }
                        }, 1000);
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                  }).catch(err => {
                      this.$message({
                            message: '发送验证码失败，请重试！',
                            type: 'error'
                        });
                  })
              }else{
                  return false;
              }
          })
        },
        submit(){
            this.$refs.form.validate(valid => {
                if(valid){
                    this.createTeacher();
                }else{
                    return false;
                }
            })
        },
        createTeacher(){
            teacherApi.addTeacher(this.form).then(res => {
                if(res.code === '001'){
                    this.showSucBox = true;
                    this.$emit('refresh');
                    // this.$message({
                    //     message: '创建教师信息成功！',
                    //     type: 'success'
                    // });
                    // this.$router.push('/class');
                }else{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
                console.log(res);
            }).catch(err => {
                this.$message({
                    message: '创建教师信息失败！',
                    type: 'error'
                });
            })
        }

    }
}
</script>
<style lang="less" scoped>
//表单
.el-form-item {
    margin-bottom:0.39rem;
}
.form{
    text-align: left;
    padding:0.26rem 0.34rem 0 0.34rem;
    .form_row{
        color:#4A4A4A;
        display: flex;
        padding:0 0.34rem;
        font-size: 0.18rem;
        margin-bottom: 0.39rem;
        .form_lable{
            width: 2.17rem;
        }
        .form_box{
            flex: 1;
            input{
                border:0.01rem solid #D8D8D8;
                width: 1.64rem;
                height: 0.3rem;
                padding-left:0.07rem;
            }
            .select1_98{
                width: 0.98rem;
                margin-left: 0.24rem
            }
            .password{
                width: 1.98rem;
            }
            .code{
                width: 2.44rem;
                padding-right:0.68rem;
                box-sizing: border-box;
            }
            .key{
                width: 2.44rem;
            }

        }

    }
}
.dialog_wrap .dialog_content .dialog_footer {
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.01rem solid #979797;
}

.dialog_result{
        height:3.61rem;
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


