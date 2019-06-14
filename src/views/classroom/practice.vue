<template>
      <div class="wrap">
        <header>
            <div class="header_left">
                <img :src="images.back" alt="" class="back">
                <img :src="images.logo" alt="" class="logo">
            </div>
        </header>
        <div class="content">
            <div class="content_left">
                <div class="top"></div>
                <div class="photo"></div>
                <div class="talk_list">
                    <div class="gradient" :key="p" v-for="(item,p) in showDetail">
                        <div class="gradient-box" >
                            {{item}}
                        </div>
                    </div>
                </div>

            </div>
            <div class="content_c">
                <ul class="page_list">
                    <li :key="i" v-for="(item,i) in pptData">
                        <div class="num">01</div>
                        <div class="page" @click="changeShowInfo(item)">
                            <img class="page_img" :src="item.image" alt="">
                            <!-- <div class="change unchange" id="showRemark">+</div> -->
                        </div>
                    </li>
                    <li>
                        <div class="num">04</div>
                        <div class="page">
                            <div class="change">+</div>
                        </div>
                    </li>

                </ul>
            </div>
            <div class="content_right">
                <el-image
                    style="width: 100%; height: 100%"
                    :src="showPic"
                    :fit="fit"></el-image>
            </div>
        </div>
        <footer>
            <div class="btn_254" style="background: #ACCFFF;margin: 0 0.17rem 0 4.02rem;">演示</div>
            <div class="btn_254">实践</div>
        </footer>

    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
import config from '@/config'
export default {
  props: ["hourInfo"],
  data() {
    return {
      showManage: true,
      images: {
        back:require("../../../static/img/back.png"),
        logo: require("../../../static/image/logo.png")
      },
      fit:'contain',
      showPic:'',
      codeList: [],
    //   courseList:[],
        pptData:[],
        showDetail:[],
    };
  },
  components: {
    createStudent
  },
  watch: {
    currentClass() {
      console.log(this.currentClass);
    }
  },
  created() {
      this.getpptData();
  },
  methods: {
      changeShowInfo(item) {
          this.showPic = item.image;
          this.showDetail = item.detail;
          console.log(item);
      },
      getpptData() {
        let params = {
            hourId:this.hourInfo.id,
            // hourId:1,
            hourType:0
        }
        classApi.getpptData(params).then(res=>{
            if (res.code === '001') {
                this.pptData = res.data;
                if (this.pptData.length) {
                    this.pptData.forEach((item,i)=>{
                    this.pptData[i].image = config.API_URL+item.image;
                    this.pptData[i].detail = item.detail.split("\\n");
                    if (i === 0) {
                        this.showPic = this.pptData[i].image;
                        this.showDetail =  this.pptData[i].detail;
                    }
                    })
                }
            }
            console.log(this.pptData);
        });
    },
    getCodeList(classId) {
      let params = {
        clsId: classId
      };
      classApi.getCodeList(params).then(res => {
        this.codeList = res.data.map(item => {
          item.value = item.cdk;
          return item;
        });
        if (this.$refs.child) {
          this.$refs.child.setCodeOptions(this.codeList);
        }
      });
    },
    deleteStudent(student) {
      this.$confirm("确定删除学生" + student.name + "吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      }).then(() => {
        let params = {
          clsId: this.currentClass.id,
          studentId: student.id
        };
        classApi
          .deleteStudent(params)
          .then(res => {
            if (res.code === "001") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$router.push({ path: "/class" });
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          });
      });
    },
    handleSub() {
      classApi
        .courseReportAdd(this.form)
        .then(res => {
          if (res.code === "001") {
            this.$message({
              message: "提交成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 10.8rem;
    position:absolute;
    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='bg-login.png',sizingMethod='scale');
    header{
        height: 0.97rem;
        line-height: 0.97rem;
        background: #4592FE;
        .header_left{
            display: flex;
            align-items: center;
            height: 0.97rem;
            .back{
                padding-left: 0.3rem;
                padding-right: 0.25rem;
                width: 0.25rem;
                height: 0.4rem;
                display: block;
            }
            .logo{
                width: 1.73rem;
                height: 0.58rem;
                display: block;
            }
        }
    }
    .content{
        width: 100%;
        flex: 1;
        background: #F3F6FC;
        border-radius: 0.20rem;
        display: flex;
        border-bottom: 0.01rem solid #979797;
        .content_left{
            width:3.84rem;
            height: 100%;
            position: relative;
            background: #F3F6FC;
            border-right: 0.01rem solid #979797;
            .top{
                background: #56749F;
                height: 0.64rem;
            }
            .photo{
                width: 0.74rem;
                height: 0.74rem;
                border-radius: 100%;
                border: 0.01rem solid #979797;
                position: relative;
                top: -0.37rem;
                left: 0.28rem;
                background:url('../../../static/image/robot.jpeg');
            }
            .talk_list{
                height: 6.3rem;
                background: url('../../../static/image/speak_texture.png') no-repeat;
                background-position: bottom;

            }
            .gradient {
                margin-left:0.23rem;
                margin-bottom: 0.29rem;
                width: 1.89rem;
                box-sizing: border-box;
                padding: 0.04rem;
                border-radius: 0.2rem;
                background-image: -webkit-linear-gradient(left,#94CAE8 0%, #6187B7 100% );
                background-image: -moz-linear-gradient(left,#94CAE8 0%, #6187B7 100% );
                background-image: linear-gradient(left,#94CAE8 0%, #6187B7 100% );
            }
            .gradient-box {
                width: 100%;
                height: 100%;
                border-radius:0.2rem;
                background:#fff;
                display: flex;
                align-items: center;
                word-wrap:break-word;
                font-size:0.13rem;
                color:#4A4A4A;
                padding:0.14rem 0.19rem;
                box-sizing: border-box;
            }
            .gradient_pink{
                width: 3.05rem;
                margin-left:0.55rem;
                background-image: -webkit-linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
                background-image: -moz-linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
                background-image: linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
            }
        }
        .content_c{
            width: 2.9rem;
            border-right: 0.01rem solid #979797;
            background: #DAE9FF;
            height: 100%;
            overflow-y: auto;
            .page_list{
                li{
                    display: flex;
                    height: 1.25rem;
                    margin-top: 0.25rem;
                    .num{
                        width: 0.57rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.2rem;
                    }
                    .page{
                        width: 1.95rem;
                        height: 1.25rem;
                        background: #fff;
                        position: relative;
                        .page_img{
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                        .change{
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            height: 0.38rem;
                            background: #4592FE;
                            opacity: 0.6;
                            color:#fff;
                            text-align: center;
                            line-height: 0.38rem;
                        }
                        .unchange{
                            background: #777777;
                            opacity: 0.7;
                        }
                        .remark{
                            position: absolute;
                            top:0;
                            left:-3.65rem;
                            width: 3.61rem;
                            height: 3.13rem;
                            background: url("../../../static/image/dialog.png");
                            background-size: 100%;
                            padding: 0.25rem;
                            z-index: 100;
                            box-sizing: border-box;
                            p{
                                font-size: 0.17rem;
                            }
                            .remark_input{
                                width: 3rem;
                                height: 1.71rem;
                                border: 0.01rem solid #979797;
                                border-radius: 0.06rem;
                                margin:0.18rem 0;
                                padding: 0.2rem;
                                box-sizing: border-box;
                            }
                            .btn_110{
                                width: 1.1rem;
                                height: 0.37rem;
                                background: #4994FD;
                                border-radius: 0.06rem;
                                color:#fff;
                                text-align: center;
                                line-height: 0.37rem;
                                font-size: 0.14rem;
                                cursor: pointer;
                                float: right;
                            }
                        }

                    }
                }
            }
        }
        .content_right{
            flex: 1;
            display: flex;

        }
    }
    footer{
        height: 0.94rem;
        width: 100%;
        align-items: center;
        display: flex;
    }
}

</style>


