<template>
    <div class="studentManage">
        <!--<div class="left-item">
            <div class="h3">现有班级</div>
            <ul class="students">
                <li v-for="item in datalist" :class="{active:currentClass=== item.id}" @click="setRight(item)" :key="item.id">
                    <div>
                        <p>{{item.courseName}}</p>
                        <p style="margin-top:4px;">时间：{{item.hebdomad}}({{item.startTime}}-{{item.endTime}})</p>
                    </div>
                    <i class="el-icon-delete" @click="showDeleteConfirm(item)"></i>
                </li>
            </ul>
            <div class="info" @click="handleCreate">
                <el-button type="default" class="cac-button-one">创建新班级</el-button>
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
            <div class="save">
                <el-button type="default" class="cac-button-one">保存</el-button>
            </div>
        </div> -->
        <el-dialog append-to-body width="80%" title="创建班级" :visible.sync="showCreate">
            <createClass ref="child"></createClass>
        </el-dialog>
                <div class="dialog_center">
                    <div class="dialog_l_r">
                        <div class="dialog_left">
                            <div class="dialog_title">SCRATCH初级编程1班</div>
                            <div class="dialog_l_top">
                                <div class="top_list">
                                    <div class="item">
                                        <img :src="defaultImg" alt="" class="item_photo">
                                        <div class="item_center">
                                            <p class="name">刘洋</p>
                                            <p class="name_label">激活码：000</p>
                                        </div>
                                        <!-- <img src="./img/delete_icon.png" alt="" class="item_delete"> -->
                                    </div>
                                </div>
                                <div class="dialog_l_btn">
                                    <div class="btn_172" id="add_info">添加学生信息</div>
                                    <div class="btn_172">创建学生信息</div>
                                </div>
                            </div>
                            <div class="dialog_l_bottom">
                                <div class="dialog_title">未激活</div>
                                <div class="bottom_list">
                                    <div class="item">
                                        <span>2222222</span>
                                        <!-- <img src="./img/delete_icon.png" alt="" class="item_delete"> -->
                                    </div>
                                    <div class="item">
                                        <span>2222222</span>
                                        <!-- <img src="./img/delete_icon.png" alt="" class="item_delete"> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dialog_rig">
                            <div class="dialog_title">学生信息</div>
                            <div class="dialog_r_top">
                                <div class="intr_box">
                                    <div class="intr_row">
                                        <!-- <img src="./img/name_icon.png" alt="" style="width: 0.1rem;height: 0.13rem;;"> -->
                                        姓名：
                                        <span>拉拉</span>
                                    </div>
                                    <div class="intr_row">
                                        <!-- <img src="./img/name_icon.png" alt="" style="width: 0.1rem;height: 0.13rem;;"> -->
                                        年龄：
                                        <span>拉拉</span>
                                    </div>

                                </div>
                                <div class="intr_box">
                                    <div class="intr_row">
                                        <!-- <img src="./img/name_icon.png" alt="" style="width: 0.1rem;height: 0.13rem;;"> -->
                                        机构：
                                        <span>拉拉</span>
                                    </div>

                                </div>
                            </div>
                            <div class="dialog_r_bottom">
                                <div class="btn_172" id="submit_s">保存</div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
</template>
<script>
import createClass from "./createClass";
import classApi from '../../services/classroom';
export default {
    props:['datalist','currentIndex'],
    data(){
        return {
            defaultImg:'../../static/img/person_photo.png',
            showCreate:false,
            currentClass:'',
            className:'',
            course:'',
            school:'',
            teacher:''
        }
    },
    components:{
        createClass
    },
    mounted(){
        this.setRight(this.datalist[this.currentIndex]);
    },
    methods:{
        setRight(data){
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
                    this.datalist.forEach((cla,index) => {
                        if(cla.id === item.id){
                            this.datalist.splice(index,1);
                        }
                    });
                    this.setRight(this.datalist[0]);
                    this.$emit('refresh',this.datalist);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
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
    .studentManage{
        display:flex;
        flex:1;
    }
</style>


