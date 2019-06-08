<template>
    <div class="studentManage">
        <div class="top"></div>
        <div class="left-item">
            <div class="h3">现有班级</div>
            <ul class="students">
                <li>
                    <div>
                        <p style="margin-left:-30px;">PYTHON编程一班</p>
                        <p style="margin-top:4px;">时间：周三(10:00-12:00)</p>
                    </div>
                    <i class="el-icon-delete"></i>
                </li>
            </ul>
            <div class="info" @click="showCreate = true">
                <el-button type="default" class="cac-button-one">创建新班级</el-button>
            </div>
        </div>
        <div class="right-item">
            <div class="h3">班级</div>
            <div class="infoCon">
                <ul>
                    <li>
                        <p><span>姓名</span>：刘洋</p>
                    </li>
                </ul>
            </div>
            <div class="save">
                <el-button type="default" class="cac-button-one">保存</el-button>
            </div>
        </div>
        <el-dialog append-to-body width="40%" title="创建班级" :visible.sync="showCreate">
            <createClass></createClass>
        </el-dialog>
    </div>
</template>
<script>
import createClass from "./createClass";
export default {
    data(){
        return {
            defaultImg:'../../static/img/student.png',
            showCreate:false
        }
    },
    components:{
        createClass
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
    }
    .studentManage{
        height:50vh;
        margin:0;
        padding:0;
        .left-item{
            position:relative;
            float:left;
            width:30vw;
            height:100%;
            border-right:@bottom;
            ul{
                margin:0 auto;
                padding:0 5px;
                li{
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    div{
                        float:left;
                        margin-left:0px;
                        p{font-size:12px;}
                    }
                    i{
                        margin-top:15px;
                        margin-left:100px;
                    }

                }
            }
            .info {
                position:fixed;
                top:70vh;
                left:20vw;
                height:60px;
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
                p{
                    float:left;
                    margin-left:18px;
                    margin-top:10px;
                    span{
                        color:#9b9b9b;
                    }
                }
            }
            .save {
                position:fixed;
                top:70vh;
                left:60vw;
                height:60px;
            }
        }
    }
</style>


