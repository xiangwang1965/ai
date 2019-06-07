<template>
  <div class="classContainer">
    <div class="left">
     <h1 class="title">班级管理</h1>
        <div class="round"></div>
        <p class="p">当前课程</p>
        <p class="btn">历史班级</p>
        <div class="sideContainer">
         <div class="item">
           <div class="classTitle orange">
             <p class="txt orange">1234</p>
           </div>
           <div class="classList"></div>
         </div>
        </div> 
    </div>
    <div class="center"></div>
    <div class="right">
      <h3>标题</h3>
      <div class="tabs">
        <div>
          <span>班级</span>
          <span class="active">学员管理</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import classApi from '@/services/classroom'
export default {
  data(){
    return {
      activeNames: ['1']
    }
  },
  created(){
    this.getData();
  },
  methods:{
    handleChange(val){
      console.log(val);
    },
    getData(){
      let params = {
        schoolId:1,
        typeId:1
      }
      classApi.getData(params).then(res => {
        console.log(res);
      });
    }
  }
}
</script>
<style lang="less">
  .classContainer{
    .left{
      width:513px;
      position:relative;
      height:100%;
      .title{
        position:absolute;
        left:18px;
      }
      .round{
        width:10px;
        height:10px;
        border: 2px solid #4592FE;
        border-radius: 50%;
        position:absolute;
        top:43px;
      }
      .p{
        position:absolute;
        left:26px;
        top:40px;
        font-family: 'HYQiHei-EES';
        font-size: 15px;
        color:#4592FE;
        letter-spacing: 1.5px;
      }
      .btn{
        background: #4592FE;
        border-radius: 5px;
        font-family: 'HYQiHei-EES';
        font-size: 15px;
        color: #FFFFFF;
        letter-spacing: 1.5px;
        width:70px;
        height:23px;
        line-height:23px;
        position:absolute;
        left:307px;
        top:40px;
        padding:0 2px;
      }
      .sideContainer{
        position:absolute;
        width:413px;
        height:300px;
        left:0px;
        top:60px;
        .item{
          .classTitle{
            width:450px;
            height:36px;
            .txt{
              width:115px;
              height:35px;
              line-height: 35px;
              text-align: center;
              font-family: 'HYQiHei-GZS';
              font-size: 14px;
              color: #FFFFFF;
              letter-spacing: 0;
              text-align: center;
              border-radius: 6px 6px 0px 0px;
              &.orange{
              background:#FFC151;
              }
              &.green{
                background:#6EDBEF;
              }
              &.red{
                background:#FF696C;
              }
              &.purple{
                background:#8B90FF;
              }
            }
            &.orange{
              border-bottom:3px solid #FFC151;
            }
            &.green{
              border-bottom:3px solid #6EDBEF;
            }
            &.red{
              border-bottom:3px solid #FF696C;
            }
            &.purple{
              border-bottom:3px solid #8B90FF;
              }
          }
          
        }
      }
    }
    .center{
      width:1px;
      height:400px;
      background:#b6b6b6;
      position:absolute;
      top:20%;
      left:46%;
    }
    .right{
      position:relative;
      left:50%;top:0;
      .h3{
        font-family: HYQiHei-GZS;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position:absolute;
        top:10px;
        left:0px;
      }
      .tabs{
        width:574px;
        height:80px;
        background: #FFFFFF;
        position:absolute;
        left:0px;
        top:0px;
        border-bottom: 3px solid #FFC151;
        div{
          position:absolute;
          left:0px;
          top:42px;
          span{
            display: inline-block;
            background: #FFD893;
            border-radius: 6px 6px 0px 0px;
            font-family: 'HYQiHei-GZS';
            font-size: 14px;
            color: #FFFFFF;
            width:80px;
            height:35px;
            letter-spacing: 0;
            text-align: center;
            line-height:35px;
            &.active{background:#FFC151}
          }
        }
      }
    }
  }
</style>
