<template>
    <div class="studentWrape">
        <div class="top"></div>
         <el-dialog :visible.sync="showSucBox" custom-class="dialog_result" center append-to-body  width="30%" id="dialog_result">
            <div class="dialog_center">
                <img :src="sucImg" class="result_icon">
                <p class="result_txt">添加成功</p>
            </div>
        </el-dialog>
        <div class="dialog_content">
            <div class="dialog_center">
                <div class="dialog_form">
                    <div class="search_box" style="margin:0.33rem 0 0 0.36rem;">
                        <el-input
                            placeholder="搜索姓名/ID"
                            size="mini"
                            prefix-icon="el-icon-search"
                            v-model="searchData"
                        >
                            <el-button slot="append" class="search_btn" @click="search">搜索</el-button>
                        </el-input>
                    </div>
                    <el-form ref="form" :rules="formRules" :model="form" size="mini" class='form' :label-position="formalign" v-scrollBar>
                    <!-- <el-form-item label-width="120px" prop="name" label-position="center" label="姓名">
                            <el-input style="width:3rem" v-show="false" v-model="form.name"></el-input>
                             <el-autocomplete
                                class="inline-input"
                                v-model.trim="form.name"
                                :fetch-suggestions="stuInfo"
                                placeholder="请输入姓名"
                                @select="handleSelect"
                                clearable
                            ></el-autocomplete>
                        </el-form-item> -->
                        <el-form-item label-width="120px" label="姓名">
                            <el-select v-model="form.studentId" placeholder="请选择姓名">
                            <el-option  v-for="item in stuInfo"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label-position="center" prop="phone" label-width="120px" label="手机号">
                            <el-input v-model="form.phone" style="width:3rem;"></el-input>
                        </el-form-item>
                        <el-form-item label-position="center" prop="verificode"  label-width="120px" label="验证码">
                            <el-input v-model="form.verificode" style="width:2rem;">
                            </el-input>
                            <el-button style="border:none" type="default" @click="getCode">{{codeTxt}}</el-button>
                        </el-form-item>
                        <el-form-item label-position="center" prop="is_cdk" label-width="120px" label="激活码">
                            <el-input v-show="false" v-model="form.is_cdk"></el-input>
                            <el-autocomplete
                                class="inline-input"
                                v-model.trim="form.cdk"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                @select="handleSelect"
                                clearable
                            ></el-autocomplete>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="dialog_footer">
                <div class="btn_172" id="submit_form" @click="submit">保存</div>
            </div>
        </div>
    </div>
</template>
<script>
import classApi from '../../services/classroom'
import utils from '../../utils'
export default {
    props:['currentClass','courseId','codeOptions'],
    data(){
        return {
            formalign:'left',
            searchData:"",
            showSucBox:false,
            sucImg: require('../../../static/image/result_success.png'),
            value:'',
            value1:'',
            showConfirm:false,
            code:'',
            form:{
                clsId:'',
                studentId:'',
                phone:'',
                cdk:'',
                is_cdk:'',
                verificode:'',
            },
            timer:'',
            codeTime:60,
            codeTxt:'获取验证码',
            classTime:'',
            formRules:{
                studentId:[
                    { required: true, message: '请选择学生', trigger: 'change' }
                ],
                phone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                is_cdk:[
                    {required:true, message:'请选择或者输入激活码',trigger:'change'}
                ],
                verificode:[
                    { required: true, message: '请填写验证码', trigger: 'blur' }
                ]
            },
            stuInfo:{},
        }

    },
    watch:{
        'form.cdk'(){
            this.form.is_cdk = this.form.cdk;
        }
    },
    created(){

    },
    methods:{
        querySearch(queryString, cb) {
            const options = this.codeOptions;
            let results = queryString ? options.filter(this.createFilter(queryString)) : options;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (option) => {
                return (option.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        search() {
            let params = {
                searchTxt: this.searchData
            };
            classApi.search(params).then(res => {
                this.stuInfo = res.data;
                console.log(this.stuInfo);
            });
        },
        handleSelect(item){
           this.form.is_cdk = item.id;
        },

        reset(){
            this.form = {
                clsId:'',
                studentId:'',
                phone:'',
                cdk:'',
                is_cdk:'',
                verificode:''
            }
            this.$refs.form.resetFields();
        },
        setCodeOptions(data){
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
                   this.addStudent();
                }else{
                    return false;
                }
            })
        },
        addStudent(){
            this.form.clsId = this.currentClass.id;
            classApi.addhaveStu(this.form).then(res => {
                if(res.code === '001'){
                    this.showConfirm = false;
                    this.$store.state.curClsStuList.push(res.data);
                    this.showSucBox = true;
                    this.$emit('toggleCreate');
                }else{
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
                console.log(res);
            }).catch(err => {
                this.$message({
                    message: '添加学生信息失败！',
                    type: 'error'
                });
            })
        }

    }
}
</script>
<style lang="less" scoped>
    .el-select{border-radius: 0;}
    .cac-button-one{margin-left:20vw;}
    .el-form-item{
        height:40px;
    }
     .top{width:100%;height:0.1rem;border-bottom:1px solid #4A4A4A}
    .studentWrap{

         .dialog_center {
         .dialog_form {
         .form{
             position:relative;
         }
         }
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


