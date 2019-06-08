<template>
    <div class="classWrape">
        <div class="top"></div>
        <el-form size="mini">
            <el-form-item label-width="100px" label-position="center" label="班级类型">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="等级" label-width="100px">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-position="center" label-width="100px" label="上课起始时间">
                <el-date-picker
                    style="width:178px"
                    v-model="value1"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label-position="center" label-width="100px" label="班级名称">
                <el-input style="width:176px;"></el-input>
            </el-form-item>
            <el-form-item label-position="center" label-width="100px" label="教师">
                <el-select v-model="value" filterable placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="default" @click="showConfirm = true" class="cac-button-one">创建</el-button>
        <el-dialog class="confirmWrap" center append-to-body title="创建班级" :visible.sync="showConfirm">
            <ul class="confirmList">
                <li>
                    <span>班级类型</span>
                    <span>hahah</span>
                </li>
                <li>
                    <span>等级</span>
                    <span>hahah</span>
                </li>
                <li>
                    <span>上课时间</span>
                    <span>hahah</span>
                </li>
                <li>
                    <span>班级名称</span>
                    <span>hahah</span>
                </li>
                <li>
                    <span>教师</span>
                    <span>hahah</span>
                </li>
            </ul>
            <p>确定信息无误，创建新班级？</p>
            <el-button type="default" class="cac-button-one">取消</el-button>
            <el-button type="default" class="cac-button-one">确定</el-button>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            options:[{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value:'',
            value1:'',
            showConfirm:false
        }
        
    }
}
</script>
<style lang="less" scoped>
    @bottom:1px solid #979797;
    .el-select{border-radius: 0;}
    .cac-button-one{margin-left:10vw;}
    .classWrap{
         .top{width:100%;height:5px;border-bottom:@bottom}
    }
    .confirmWrap{
        .confirmList{
            margin-left:40%;
            li{
                width:100%;
                list-style-type: disc;
                height:44px;
                span:first-child{
                    display: inline-block;
                    width:100px;
                }
                span:last-child{
                    font-family: HYQiHei-FZS;
                    font-size: 18px;
                    color: #4994FD;
                    letter-spacing: 0;
                }
            }
        }
        p{
            font-family: 'HYQiHei-FZS';
            font-size: 20px;
            letter-spacing: 0;
            text-align: center;
        }
    }
</style>


