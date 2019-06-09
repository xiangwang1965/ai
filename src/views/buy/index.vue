<template>
  <div class="classContainer">
    <div class="left">
      <h1 class="title">购买激活码</h1>
     <div class="sideContainer">
        <div class="item" :key="i" v-for="(item,i) in tabs">
          <div class="classTitle" :class="item.colorCls" @click="switchTab(item.id)">
            <span class="txt green">{{item.name}}</span>
            <i :class="item.IconCls"></i>
          </div>
          <el-collapse-transition>
            <dl class="classList" v-show="activeIndex === item.id">
              <dd :key="k" v-for="(course,k) in dataList">
                <el-image style="width: 100px; height: 100px" :src="url"></el-image>
                <button class="demonstratio" @click="dataHandle(course)">添加</button>
              </dd>
            </dl>
          </el-collapse-transition>
        </div>
      </div>
    </div>
    <div class="center"></div>
    <div class="right">
     <h1 class="title">购买激活码清单</h1>
      <div class="tabs">
        <ul>
             <el-checkbox-group v-model="switchNames" @change="changSelectChange">
          <li :key="d" v-for="(c,d) in switchData">
            <div class="orderItem">
                <el-checkbox :label="c.name" ></el-checkbox>
               <el-input-number size="mini" v-model="c.num"></el-input-number>
            </div>
          </li>
           </el-checkbox-group>
        </ul>
         <div class="bottomBtn">
            <div class="orderItem">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"    @change="handleCheckAllChange">全选</el-checkbox>
            <span id="money">支付金额：<i>￥{{totalPrice}}</i></span>
           <el-button type="primary" round @click="payHandle">结算</el-button>
           </div>
          </div>
      </div>
    </div>
  </div>

</template>
<script>
import buyApi from "@/services/buy";

export default {
  data() {
    return {
        num4:1,
        switchNames:[],
        checkAll: false,
        isIndeterminate: true,
        allPrice:0,
      tabs: [
        {
          id: 1,
          name: "SCRATCH编程",
          colorCls: "orange",
          IconCls: "el-icon-arrow-down"
        },
        {
          id: 2,
          name: "PYTHON编程",
          colorCls: "green",
          IconCls: "el-icon-arrow-right"
        },
        {
          id: 3,
          name: "NOIP",
          colorCls: "red",
          IconCls: "el-icon-arrow-right"
        },
        {
          id: 4,
          name: "NOIP",
          colorCls: "purple",
          IconCls: "el-icon-arrow-right"
        }
      ],
      activeIndex: 1,
      dataList: {},
      switchData: [],
      totalPrice: 0,
      url: "../../static/img/content_default.png"
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
       handleChange(value) {
        console.log(value);
      },
    switchTab(index) {
      if (index === this.activeIndex) {
        this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-right";
        this.activeIndex = "";
      } else {
        if (this.activeIndex !== "") {
          this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-right";
          this.getData(index);
        }
        this.activeIndex = index;
        this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-down";
      }
    },
    dataHandle(val) {
      let tmp = Object.assign({},val);
      tmp.checked = false;
      tmp.num = 1;
      if (this.switchData.length > 0) {
        if (
          this.switchData.every(item => {
            return item.id != tmp.id;
          })
        ) {
          this.switchData.push(tmp);
        } else {
          this.switchData.forEach((item, index) => {
            if (tmp.id == item.id) {
              this.switchData[index].num += 1;
            }
          });
        }
      } else {
        this.switchData.push(tmp);
      }

      console.log(this.switchData);
    },
    getData(typeid) {
      let params = {
        typeId: typeid || 1
      };
      buyApi.queryCourses(params).then(res => {
        if (res.code === "001") {
          this.dataList = res.data;
        }
      });
    },
     handleCheckAllChange(val) {
        this.switchNames = val ? this.switchData.map(item=>item.name) : [];
        this.isIndeterminate = false;
        if (val) {
            this.switchData.forEach(item=>{
                this.totalPrice += (+item.price)*item.num;
            })
            console.log(this.totalPrice);
            this.totalPrice = this.totalPrice.toFixed(2);
        } else {
             this.totalPrice = 0;
        }
      },
      changSelectChange(value) {
        console.log(value);
        this.totalPrice = 0;
        this.switchData.forEach(item=>{
            if (value.indexOf(item.name) > -1) {
                this.totalPrice += (+item.price)*item.num;
            }
        })
        this.totalPrice = this.totalPrice.toFixed(2);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.switchData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.switchData.length;
      },
      payHandle(){
          let result = [];
        this.switchData.forEach(item=>{
        if (this.switchNames.indexOf(item.name) > -1) {
            result.push({
                courseId:item.id,
                num:item.num
            });
        }
    })
        buyApi.queryAddOrder({data:JSON.stringify(result)}).then(res => {
            if (res.code === '001') {
                this.$router.push({
                    name:'payorder',
                    query:{
                        out_trade_no:res.data.out_trade_no,
                        totalPric:res.data.totalPric
                    }
                });
            }
        });
      }
  }
};

function fn(ar) {
  let json = {};
  let arr = [];
  ar.forEach(item => {
    if (!json[item.name]) {
      json[item.name] = true;
      arr.push(item);
    }
  });
  return arr;
}
</script>
<style lang="less" scoped>
.classContainer {
     background-color: #f9fafc;
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 0;
  .left {
    width: 613px;
    position: absolute;
    height: 100%;
    z-index:1;
    .title {
      position: absolute;
      left: 18px;
      top: 20px;
    }
    .sideContainer {
      position: absolute;
      width: 613px;
      height: 300px;
      left: 50%;
      margin-left: -275px;
      top: 60px;
      font-size: 14px;
      .item {
        .classTitle {
          width: 550px;
          height: 36px;
          color: #fff;
          border-radius: 6px 6px 0px 0px;
          .txt {
            float: left;
            width: 115px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            font-family: HYQiHei-GZS;
            letter-spacing: 0;
          }
          .el-icon-arrow-right,
          .el-icon-arrow-down {
            float: right;
            width: 35px;
            height: 35px;
            line-height: 35px;
            font-size: 17px;
            font-weight: bold;
          }
          &.orange {
            background: #ffc151;
          }
          &.green {
            background: #6edbef;
          }
          &.red {
            background: #ff696c;
          }
          &.purple {
            background: #8b90ff;
          }
        }
        .classList {
          dd {
            padding: 30px 0;
            text-align: center;
            display: inline-block;
            width: 30%;
            box-sizing: border-box;
            vertical-align: top;
            .el-image {
              background: #d8d8d8;
              border-radius: 7px;
            }
          }
          .demonstration {
            font-size: 15px;
            background: #ffc151;
            border: 1px solid #ffc151;
            border-radius: 7px;
            font-family: HYQiHei-FZS;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            width: 100px;
            height: 20px;
          }
        }
      }
    }
  }
  .center {
    width: 1px;
    height: 500px;
    background: #b6b6b6;
    position: absolute;
    top: 20%;
    left: 614px;
    z-index: 1;
  }
  .right {
    position: absolute;
    left: 625px;
    width: 460px;
    height: 100%;
    z-index:1;
    .title {
      position: absolute;
      left: 18px;
      top: 20px;
      z-index: 1;
    }
    .tabs {
      width: 460px;
      position: absolute;
      left: 0px;
      top: 0px;
      height: 100%;
      ul {
        width: 100%;
        min-height: 403px;
        margin-top: 60px;
        li {
            width: 90%;
            height: 85px;
            border-radius: 7px;
            position: relative;
            margin: 15px auto;
            background: #FFFFFF;
            border-radius: 7px;
            .orderItem {
                height: 100%;
                margin: auto;
                padding-top: 20px;
                .el-checkbox {
                    float:left;
                    margin-left:30px;
                }
                .el-input-number {
                    float:right;
                    margin-right:30px;
                }
            }

        }
      }
      .bottomBtn {
        width: 90%;
        height: 85px;
        border-radius: 7px;
        position: relative;
        margin: 15px auto;
        background: #FFFFFF;
        border-radius: 7px;
         .orderItem {
                height: 100%;
                margin: auto;
                padding-top: 20px;
                .el-checkbox {
                    float:left;
                    margin-left:30px;
                }
                span {
                    float: left;
                    font-family: HiraginoSansGB-W6;
                    font-size: 16px;
                    letter-spacing: 0;
                    i {
                        color: #4994FD;
                    }
                }
                .el-button {
                    float:right;
                    width: 108px;
                    height: 42px;
                }
            }
      }
    }
  }
}
</style>
