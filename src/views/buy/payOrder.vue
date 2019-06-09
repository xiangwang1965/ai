<template>
<div id="payView">
    abc
</div>
</template>
<style lang="less" scoped>
    #pageView {
        background:#eff2f6;
        height:100vh;
        width:100vw;
    }
</style>
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
                qrImg: config.API_URL+'/pay/'+ this.$route.query.out_trade_no+ '.jpg'
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