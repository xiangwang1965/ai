<template>
    <div class="studentManage">
        <div class="top"></div>
        <div class="left-item">
            <div class="h3">{{currentClass.courseName}}编程班</div>
            <ul class="students">
                <li @click="setRight(student)" :class="{active:currentStudent.id === student.id}" :key="index" v-for="(student,index) in studentlist">
                    <img :src="defaultImg" />
                    <div>
                        <p>{{student.name}}</p>
                        <p>激活码：{{student.cdk}}</p>
                    </div>
                    <i @click="deleteStudent(student)" class="el-icon-delete"></i>
                </li>
            </ul>
            <div class="studentInfo">
                <div class="info">
                    <el-button type="default" @click="showCreate = true" class="cac-button-one">创建学生信息</el-button>
                </div>
                <ul style="max-height:80px">
                    <li v-for="code in codeList" :key="code.id">
                        <span style="float:left;margin-top:5px;">{{code.cdk}}</span>
                    </li>
                </ul>

            </div>
        </div>
        <div class="right-item">
            <div class="h3">学生信息</div>
            <div class="infoCon">
                <ul>
                    <li>
                        <p><span>姓名</span>：{{currentStudent.name}}</p>
                        <p><span>年龄</span>：{{currentStudent.age}}</p>
                    </li>
                    <li>
                        <p><span>机构</span>：{{currentClass.schoolName}}</p>
                        <p><span>班级</span>：{{currentClass.name}}</p>
                        <p><span>课程</span>：{{currentClass.courseName}}</p>
                        <p><span>教师</span>：{{currentClass.teacherName}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <el-dialog center append-to-body width="80%" title="创建学生信息" :visible.sync="showCreate">
            <createStudent :codeOptions="codeList" :currentClass="currentClass" :currentType="currentType" ref="child"></createStudent>
        </el-dialog>
    </div>
</template>
<script>
import classApi from '../../services/classroom';
import createStudent from "./createStudent";
export default {
    props:['studentlist','currentClass','currentType'],
    data(){
        return {
            showManage:true,
            defaultImg:'../../static/img/student.png',
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
        this.getCodeList(this.currentClass.id);
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
    .studentManage{
        height:50vh;
        margin:0;
        padding:0;
        .left-item{
            float:left;
            width:30vw;
            height:100%;
            border-right:@bottom;
            ul{
                margin:0 auto;
                padding:0 5px;
                max-height: 150px;
                overflow-y:auto; 
                li{
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    img{
                        float:left;
                        width:30px;
                        height:30px;
                        border-radius: 50%;
                        background:#000;
                    }
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    div{
                        float:left;
                        margin-left:30px;
                        margin-top:5px;
                        width:280px;
                        p{font-size:12px;}
                    }
                    i{
                        margin-top:15px;
                        margin-right:0px;
                    }
                    &.active{
                        background:rgba(#F3F6FC);
                    }

                }
            }
            .studentInfo{
                .info {
                    height:60px;
                    border-bottom:@bottom;
                    .cac-button-one{
                        margin-top:13px;
                        width:20px;
                        height:30px;
                    }
                }
            }
        }
        .right-item{
            float:left;
            width:45vw;
            height:100%;
            ul li{
                width:450px;
                padding:10px 5px;
                background: #F3F6FC;
                border-radius: 12px;
                margin-left:10px;
                margin-top:10px;
                min-height:60px;
                overflow: auto;
                overflow-x:hidden;
                line-height:100%;
                p{
                    float:left;
                    width:100%;
                    margin-left:18px;
                    margin-top:10px;
                    span{
                        color:#9b9b9b;
                    }
                }
            }
        }
    }
</style>


