<template>
    <div class="studentManage">
        <div class="top"></div>
        <div class="left-item">
            <div class="h3">SCARTCH编程班</div>
            <ul class="students">
                <li>
                    <img :src="defaultImg" />
                    <div>
                        <p>刘洋</p>
                        <p>激活码：00000000</p>
                    </div>
                    <i class="el-icon-delete"></i>
                </li>
            </ul>
            <div class="studentInfo">
                <div class="info">
                    <el-button type="default" class="cac-button-one">创建学生信息</el-button>
                </div>
                <ul>
                    <li>未激活</li>
                    <li>
                        <span style="float:left;margin-top:5px;">12345566677</span>
                        <i style="float:right;margin-right:20px;" class="el-icon-delete"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-item">
            <div class="h3">学生信息</div>
            <div class="infoCon">
                <ul>
                    <li>
                        <p><span>姓名</span>：刘洋</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            showManage:true,
            defaultImg:'../../static/img/student.png'
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
                    img{
                        float:left;
                        width:30px;
                        height:30px;
                        border-radius: 50%;
                        background:#000;
                    }
                    div{
                        float:left;
                        margin-left:30px;
                    }
                    i{
                        margin-top:5px;
                        margin-left:10px;
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
                p{
                    float:left;
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


