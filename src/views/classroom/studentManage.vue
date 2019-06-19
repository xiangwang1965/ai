<template>
    <div class="studentManage dialog_content">
        <el-dialog center append-to-body title="创建学生信息" :visible.sync="showCreate">
            <createStudent :codeOptions="codeList" :currentClass="currentClass" :currentType="currentType" :courseId="courseId" ref="child"></createStudent>
        </el-dialog>
                <div class="dialog_center">
                    <div class="dialog_l_r">
                        <div class="dialog_left">
                            <div class="dialog_title">{{currentClass && currentClass.courseName}}编程班</div>
                            <div class="dialog_l_top">
                                <div class="top_list" scrollBar>
                                    <div class="item" @click="setRight(student)" :class="{active:currentStudent.id === student.id}" :key="index" v-for="(student,index) in studentlist">
                                        <img :src="defaultImg" class="item_photo">
                                        <div class="item_center">
                                            <p class="name">{{student.name}}</p>
                                            <p class="name_label">激活码：{{student.cdk}}</p>
                                        </div>
                                        <img :src="iconDel" class="item_delete" @click="deleteStudent(student)">
                                    </div>
                                </div>
                            </div>
                             <div class="dialog_l_btn">
                                    <div class="btn_172" id="add_info"  @click="showCreate = true">添加学生信息</div>
                                </div>
                            <div class="dialog_l_bottom">
                                <div class="dialog_title">未激活</div>
                                <div class="bottom_list">
                                    <div class="item" v-for="code in codeList" :key="code.id">
                                        <span>{{code.cdk}}</span>
                                        <img :src="iconDel" alt="" class="item_delete">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dialog_rig">
                            <div class="dialog_title">学生信息</div>
                            <div class="dialog_r_top">
                                <div class="intr_box">
                                    <div class="intr_row">
                                        <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        姓名：
                                        <span>{{currentStudent.name}}</span>
                                    </div>
                                    <div class="intr_row">
                                       <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        年龄：
                                        <span>{{currentStudent.age}}</span>
                                    </div>

                                </div>
                                <div class="intr_box" v-if="currentClass">
                                    <div class="intr_row">
                                        <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        机构：
                                        <span>{{currentClass.schoolName}}</span>
                                    </div>
                                    <div class="intr_row">
                                        <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        班级：
                                        <span>{{currentClass.name}}</span>
                                    </div>
                                    <div class="intr_row">
                                        <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        课程：
                                        <span>{{currentClass.courseName}}</span>
                                    </div>
                                    <div class="intr_row">
                                        <img :src="nameIcon" alt="" style="width: 0.1rem;height: 0.13rem;;">
                                        教师：
                                        <span>{{currentClass.teacherName}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
</template>
<script>
import classApi from '../../services/classroom';
import createStudent from "./createStudent";
export default {
    props:['studentlist','currentClass','currentType','courseId'],
    data(){
        return {
            showManage:true,
            defaultImg:require('../../../static/image/person_photo.png'),
            iconDel:require('../../../static/image/delete_icon.png'),
            nameIcon:require('../../../static/image/name_icon.png'),
            currentStudent:'',
            codeList:[],
            showCreate:false
        }
    },
    components:{
        createStudent
    },
    watch:{
        currentClass(){
            console.log(this.currentClass);
        }
    },
    created(){
        // 获取激活码
        if (this.currentClass && this.currentClass.id) {
            this.getCodeList(this.currentClass.id);
        }
    },
    methods:{
        setClass(){
            console.log(this.currentClass);
        },
        setRight(student){
            console.log(student);
            this.currentStudent = student;
        },
        getCodeList(classId){
            let params = {
                clsId:classId
            }
            classApi.getCodeList(params).then(res => {
                this.codeList = res.data.map(item => {
                    item.value = item.cdk;
                    return item;
                });
                if(this.$refs.child){
                    this.$refs.child.setCodeOptions(this.codeList)
                }
            })
        },
        deleteStudent(student){
            this.$confirm('确定删除学生' + student.name + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center:false,
            }).then(() => {
                let params = {
                clsId:this.currentClass.id,
                studentId:student.id
                };
                classApi.deleteStudent(params).then(res => {
                    if(res.code === '001'){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        })
                        this.$router.push({path:'/class'});
                    }else{
                        this.$message({
                            message:'删除失败',
                            type:'error'
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message:'删除失败',
                        type:'error'
                    })
                })
            })
        },
        deleteCdk(){
            let params = {};
            classApi.deleteCdk(params).then(res => {
                if(res.code === '001'){
                    this.$message({
                        message:'删除成功',
                        type:'success'
                    })
                }else{
                    this.$message({
                        message:'删除失败',
                        type:'error'
                    })
                }
            }).catch(err => {
                this.$message({
                    message:'删除失败',
                    type:'error'
                })
            })
        }
    },
    mounted(){

    }
}
</script>
<style lang="less" scoped>
    @bottom:1px solid #979797;
    el-dialog
    .el-icon-delete{
        cursor: pointer;
        color:cornflowerblue;
    }
    .studentManage{
          margin:0;
        padding:0;
        height:100%;
        width:100%;
       .dialog_center{
            flex: 1;
            border-top:0.01rem solid #979797;
            overflow: auto;
            text-align: center;
            overflow:hidden;
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
                    width: 4rem;
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
                        overflow-y:auto;
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
                    }
                     .dialog_l_btn{
                            height: 0.99rem;
                            padding: auto;
                            padding: 0.2rem auto;
                            border-top: 0.01rem solid #979797;
                            .btn_172{
                                margin:0.11rem auto;
                                height: 0.33rem;
                                line-height: 0.33rem;
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
    }
</style>


