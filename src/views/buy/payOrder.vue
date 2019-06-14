<template>
<div id="payOrder" class="orderView">
    <div class="content">
    <div class="header">
        <div class="ordercon">订单号:{{out_trade_no}}</div>
        <div class="price">金额:{{totalPric}}</div>
    </div>
    <div class="con">
        <div class="left">
            <el-image class="qr" :src="qrImg"></el-image>
            <el-image class="bg" :src="bg_l"></el-image>
        </div>
        <div class="right">
            <el-image :src="bg_r"></el-image>
        </div>
    </div>
    </div>
</div>
</template>
<script>
    import buyApi from "@/services/buy";
    import utils from '../../utils';
    import config from '@/config'
    export default {
        data(){
            return {
                qRImg:'',
                bg_r:'../../static/image/pay_wechat_bgr.png',
                bg_l:'../../static/image/pay_wechat_bgl.png',
                out_trade_no: this.$route.query.out_trade_no,
                totalPric: this.$route.query.totalPric,
                qrImg: config.API_URL+'upload/pay/'+ this.$route.query.out_trade_no+ '.jpg'
            }
        },
        mounted() {
            this.payOrderStatus();
        },
        methods:{
            payOrderStatus() {
                let params = {
                    out_trade_no:this.out_trade_no
                };
                let t = setInterval(() => {
                    buyApi.queryOrderStatus(params).then(res=>{
                        if (res.code == '001') {
                            if (res.data === 1) {
                                clearInterval(t);
                                this.$router.push({
                                    name:'course',
                                    query:{
                                        out_trade_no:res.data.out_trade_no,
                                    }
                                });
                            }
                        } else {
                            this.$message({
                               message:res.msg,
                               type:'error'
                            })
                        }
                    });
                }, 5000);

            }
        }
    }
</script>

<style lang="less" scoped>
.orderView {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  .content {
    width: 80%;
    height: 80%;
    margin: auto;
    .header {
        width:100%;
        height:0.5rem;
        .ordercon {
            float:left;
        }
        .price {
            float:right;
        }
    }
    .con {
        width: 100%;
        height: 6rem;
        background: #fff;
        border-radius: 0.25rem;
        display:flex;
        flex:1;
        position:relative;
        .left {
            width: 49%;
            height: 100%;
            padding-left: 0.3rem;
            box-sizing: border-box;
            position: relative;
            padding-top:0.8rem;
            .qr{
                width:4rem;
            }
            .bg {
                width:3.5rem;
            }
        }
        .right {
            width: 50%;
            height: 100%;
            flex: 1;
            position: relative;
            overflow:hidden;
        }
    }
  }
}
// img {
//     position:absolute;
//     width:4rem;
//     height:4rem;
// }
</style>