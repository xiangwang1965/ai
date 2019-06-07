<template>
    <div id="activityCard">
      <div class="select-left">
        <i class="icon-right rotate180" v-if="params.page >1 " @click="reducePage"></i>
      </div>
      <div class="select-content">
          <div class="select-content-item" v-for="(item, index) in activityList" :key="index" @click="changeTab(index)">
            <p class="is-active" v-if="index === currentIndex"></p>
            <p class="select-content-item-title">{{item.name}}</p>
            <div v-if="item.plan_type == 1" class="select-content-item-card">
                <div class="scic-left">
                    <p class="scic-left-ratetext">{{item.plan_type == 1 ? '续报' : '转化'}}率</p>
                    <p class="scic-left-ratenum">{{item.rate}}%</p>
                </div>
                <div class="scic-right">
                    <div>
                        <activity-circle :percent="item.rate/100"></activity-circle>
                    </div>
                </div>
            </div>
          </div>
      </div>
      <div class="select-right">
          <i class="icon-right" v-if="!isEnd" @click="addPage"></i>
      </div>
    </div>
</template>
<script>
import activityCircle from './activityCircle'
import enrollBoardApi from '../../../../services/enroll/enrollBoard'

export default {
  data () {
    return {
      activityList: [],
      currentIndex: 0,
      params: {
        page: 1,
        total: 0,
        per_page: 5
      }
    }
  },
  computed: {
    isEnd () {
      return this.params.total <= this.params.page * this.params.per_page
    }
  },
  components: { activityCircle },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      enrollBoardApi.getWorkingPlan(this.params).then(res => {
        if (res.ok) {
          this.activityList = res.data.data
          this.params.total = res.data.total
          if (this.activityList.length > 0) {
            console.log('id ====', this.activityList[this.currentIndex].id)
            this.emitChange(this.activityList[this.currentIndex].id)
          }
        }
      })
    },
    changeTab (index) {
      this.currentIndex = index
      this.emitChange(this.activityList[this.currentIndex].id)
    },
    reducePage () {
      if (this.params.page > 1) {
        this.params.page -= 1
        console.log(this.params.page)
        this.currentIndex = 0
        this.getData()
      }
    },
    addPage () {
      if (!this.isEnd) {
        this.params.page += 1
        console.log(this.params.page)
        this.currentIndex = 0
        this.getData()
      }
    },
    emitChange (id) {
      console.log('id ====', id)
      this.$emit('change', id)
    }
  }
}
</script>
<style lang="less" scoped>
    #activityCard{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
        cursor: pointer;
        .icon-right {
            background: url("../../../../../static/img/icon-right.png") no-repeat center;
            width: 8px;
            height: 12px;
            display: block;
            background-size: 100% 100%;
            margin: 0 auto;
            margin-top: 69px;
            cursor: pointer;
        }
        .rotate180{
            transform: rotate(180deg);
        }
        .select-left{
            width: 40px;
            height: 150px;
            border-right: 1px solid #e9e9e9;
        }
        .select-content{
            display: flex;
            height: 150px;
            width: 100%;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            overflow: hidden;
            .select-content-item{
                height: 150px;
                width: 20%;
                padding: 10px;
                box-sizing: border-box;
                position: relative;
                .select-content-item-title{
                   font-size: 16px;
                   font-weight: 500;
                    height: 50px;
                }
                .select-content-item-card {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .scic-left {
                        width: 45%;
                        text-align: center;
                        .scic-left-ratetext{
                            font-size: 14px;
                            font-weight: 400;
                            color: grey;
                        }
                        .scic-left-ratenum{
                            font-size: 20px;
                            font-weight: 500;
                            color: #000;
                        }
                    }
                    .scic-right {
                        width: 55%;
                    }
                }
            }
            .is-active{
                height: 3px;
                width: calc(100% - 20px);
                border-radius: 2px;
                background-color: #008de5;
                display: block;
                position: absolute;
                top: 7px;
                left: 10px;
            }
        }
        .select-right{
            width: 40px;
            height: 150px;
            border-left: 1px solid #e9e9e9;
        }
    }
</style>
