<template>
    <div class="studentManage">
        <div class="top"></div>
        <div class="left-item">
            <div class="h3">现有班级</div>
            <ul class="students">
                <li v-for="item in currentList" :class="{active:currentClass=== item.id}" @click="gecurClassDetail(item)" :key="item.id">
                    <div>
                        <p>{{item.name}}</p>
                        <p style="margin-top:4px;">时间：{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</p>
                    </div>
                    <i style="cursor: pointer;" class="el-icon-delete" @click="showDeleteConfirm(item)"></i>
                </li>
            </ul>
            <div class="info" @click="handleCreate">
                <div class="btn_172">创建新班级</div>
            </div>
        </div>
        <div class="right-item">
            <div class="h3">班级信息</div>
            <div class="infoCon">
                <ul>
                    <li>
                        <p><span>班级</span>：{{className}}</p>
                        <p><span>课程</span>：{{course}}</p>
                        <p><span>机构</span>：{{school}}</p>
                        <p><span>教师</span>：{{teacher}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <el-dialog append-to-body width="50%" title="创建班级" :visible.sync="showCreate">
            <createClass ref="child" v-on:toggleCreate="toggleCreate"></createClass>
        </el-dialog>
    </div>
</template>
<script>
import createClass from "./createClass";
import classApi from '../../services/classroom';
export default {
    props:['currentIndex'],
    data(){
        return {
            defaultImg:require('../../../static/img/student.png'),
            showCreate:false,
            currentClass:'',
            className:'',
            course:'',
            school:'',
            teacher:'',
        }
    },
    computed: {
        currentList(){
            console.log(this.$store.state.currentList);
            return this.$store.state.currentList;
        }
    },
    components:{
        createClass
    },
    mounted(){
        this.gecurClassDetail(this.currentList[this.currentIndex]);
    },
    methods:{
        toggleCreate(){
            this.showCreate = !this.showCreate;
            this.$emit("refresh");
        },
        gecurClassDetail(data){
            if(!data){
                this.className = '';
                this.course = '';
                this.school = '';
                this.teacher = '';
                return;
            }
            this.currentClass = data.id;
            this.className = data.name;
            this.course = data.courseName;
            this.school = data.schoolName;
            this.teacher = data.teacherName;
        },
        handleCreate(){
            this.showCreate = true;
            if(this.$refs.child){
                this.$refs.child.reset();
            }
            this.className = '';
            this.teacherName = '';
        },
        showDeleteConfirm(item){
            this.$confirm('确定删除该班级吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center:false,
            }).then(() => {
                let params = {
                    clsId:item.id
                }
                classApi.deleteClass(params).then(res => {
                    this.currentList.forEach((cla,index) => {
                        if(cla.id === item.id){
                            this.currentList.splice(index,1);
                        }
                    });
                    this.gecurClassDetail(this.currentList[0]);
                    this.$store.state.currentList = this.currentList;
                    this.$emit('refresh');
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
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
        height:0.5rem;
        line-height:0.5rem;
        border-bottom:@bottom;
        color:#000;
        text-align: center;
    }
    .studentManage{
        margin:0;
        padding:0;
        height:100%;
        width:100%;
        .left-item{
            position:relative;
            float:left;
            width:40%;
            height:100%;
            border-right:@bottom;
            ul{
                margin:0 auto;
                padding:0 5px;
                height:240px;
                overflow: auto;
                li{
                    height:0.6rem;
                    border-bottom: 1px solid #979797;
                    padding-top:0.1rem;
                    padding-bottom:0.1rem;
                    font-size:0.12rem;
                    div{
                        float:left;
                        margin-left:0px;
                        p{font-size:0.12rem;}
                    }
                    i{
                        margin-top:0.2rem;
                        margin-right:0.2rem;
                        float:right;
                    }
                    &.active{
                        background:rgba(#F3F6FC);
                    }

                }
            }
            .info {
                display:flex;
                flex:1;
                margin-top: 0.5rem;
            }
        }
        .right-item{
            float:left;
            width:59.5%;
            height:100%;
            ul li{
                padding: 10px 5px;
                background: #F3F6FC;
                border-radius: 12px;
                min-height: 60px;
                overflow: auto;
                overflow-x: hidden;
                line-height: 100%;
                margin: 0.1rem;
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
            .save {
                margin-top: 2.5rem;
                height: 1.11rem;
                display: flex;
                align-items: center;
                border-top: 0.01rem solid #979797;
                justify-content: center;
            }
        }
    }
</style>


