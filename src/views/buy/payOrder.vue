<template>
<div id="payOrder" class="orderView">
        <img :src="qrImg" />
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
                out_trade_no: this.$route.query.out_trade_no,
                totalPric: this.$route.query.totalPric,
                qrImg: config.API_URL+'upload/pay/'+ this.$route.query.out_trade_no+ '.jpg'
            }
        },
        mounted() {
            console.log(config.API_URL+'upload/pay/'+ this.$route.query.out_trade_no+ '.jpg')
        },
        methods:{
            getPayImg() {
                let params = {
                    code_url:33234
                };
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
}
img {
    position:absolute;
    width:4rem;
    height:4rem;
}
</style>