<template>
  <div id="enrollReportPage">
    <div class="enroll-top">
      <div class="enroll-top-left">
        <div class="enroll-top-left-top">
          <div class="etlt-item">
            <el-tooltip class="item" effect="dark" content="通过小程序创建的活动覆盖的学生总数" placement="top-start">
              <div class="showTip"></div>
            </el-tooltip>
            <p>总覆盖学生数</p>
            <p class="etlt-item-num">{{headerData.total_count | formateNum}}</p>
            <div class="rate-box">
              <div>
                <el-tooltip class="item" effect="dark" content="周增长率=（当前总覆盖学生数—上周日24：00时的总覆盖学生数）/（上周日24：00的总覆盖学生数）" placement="top-start">
                  <span class="rateTip"></span>
                </el-tooltip>
                <span>周增长</span>
                <span class="icon-ar" :class="{rotate180:headerData.week_increase_rate<0}">▲</span>
                <span v-if="headerData.week_valid_rate == 1">{{headerData.week_increase_rate | filterNeg}}%</span>
                <span class="increaseNum">{{headerData.week_increase_total | filterNeg}}人</span>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="日增长率=（当前总覆盖学生数—昨日24：00时的总覆盖学生数）/（昨日24：00的总覆盖学生数）" placement="top-start">
                  <span class="rateTip"></span>
                </el-tooltip>
                <span>日增长</span>
                <span class="icon-ar" :class="{rotate180:headerData.day_increase_rate<0}">▲</span>
                <span v-if="headerData.day_valid_rate == 1">{{headerData.day_increase_rate | filterNeg}}%</span>
                <span class="increaseNum">{{headerData.day_increase_total | filterNeg}}人</span>
              </div>
            </div>
          </div>
          <div class="etlt-item">
            <el-tooltip class="item" effect="dark" content="本周新增的参与活动的学生数" placement="top-start">
              <div class="showTip"></div>
            </el-tooltip>
            <p>本周新增学生用户数</p>
            <p class="etlt-item-num">{{headerData.week_increase | formateNum}}</p>
            <div></div>
          </div>
          <!--<div class="etlt-item">-->
            <!--<el-tooltip class="item" effect="dark" content="支付笔数提示" placement="top-start">-->
              <!--<div class="showTip"></div>-->
            <!--</el-tooltip>-->
            <!--<p>支付笔数</p>-->
            <!--<p class="etlt-item-num">0</p>-->
            <!--<div></div>-->
          <!--</div>-->
        </div>
        <div class="enroll-top-left-bottom">
          <p class="etlb-title">正在进行的活动</p>
          <activity-table></activity-table>
        </div>
      </div>
      <div class="enroll-top-right">
        <p class="enroll-top-right-title">{{ pieTitle }}</p>
        <div class="pie-box">
          <div class="pie-tab">
            <div class="pie-tab-item" :class="{isActive:selectTab === 0}" :style="selectTab === 1? 'border-right: 0px' : ''" @click="changeTab(0)">年级</div>
            <div class="pie-tab-item" :class="{isActive:selectTab === 1}" @click="changeTab(1)">学科</div>
          </div>
          <div class="pie-content">
            <div ref="myPie" :style = "{width: '100%' ,height: '400px'}" id="myPie"></div>
            <div class="num-box">
              <div v-if="(selectTab ===0 && gradeTotalCount > 0) || (selectTab ===1 && subjectTotalCount > 0)">
                <p>报名人数</p>
                <p>{{selectTab ===0 ? gradeTotalCount : subjectTotalCount}}</p>
              </div>
              <div v-else>
                <p>暂无报名数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="enroll-bottom">
      <div class="enroll-bottom-top">
        <p class="font-w500">正在进行的活动规划</p>
        <activity-card @change="changeCard"></activity-card>
      </div>
      <div class="enroll-bottom-bottom">
        <p class="font-w500">活动数据</p>
        <div v-show="!noActivity" ref="myLine" :style="{width: '100%', height: '420px' }"></div>
        <div class="noData" v-show="noActivity">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
  import activityTable from './components/activityTable'
  import activityCard from './components/activityCard'
  import enrollBoardApi from '../../../services/enroll/enrollBoard'
  let echarts = require('echarts/lib/echarts')
  // require('echarts/lib/chart/bar')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/toolbox')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/markLine')
  export default {
    data () {
      return {
        selectTab: 0,
        noActivity: true,
        pieData: [],
        gradeTotalCount: 0,
        subjectTotalCount: 0,
        headerData: {},
        pieTitle: '',
        lineData: [],
        isStudentTip: true,
        subGradeData: null
      }
    },
    mounted () {
      // this.drawPie()
      this.getData()
      // this.drawLine()
      const that = this
      window.onresize = () => {
        console.log('resize')
        return (() => {
          that.drawPie()
          that.drawLine()
        })()
      }
    },
    components: { activityTable, activityCard },
    filters: {
      formateNum (str) {
        if (str) {
          let reg = /(\d)(?=(?:\d{3})+$)/g
          return str.toString().replace(reg, '$1,')
        } else {
          return 0
        }
      },
      filterNeg (num) {
        if (num) {
          return Math.abs(num)
        } else {
          return 0
        }
      }
    },
    computed: {
      gradeData () {
        if (this.pieData.grades && this.pieData.grades.length > 0) {
          let arr = []
          // let _this = this
          this.pieData.grades.forEach(item => {
            let temp = {}
            temp.name = item.name
            temp.value = item.count
            arr.push(temp)
            // _this.gradeTotalCount += item.count
          })
          return arr
        } else {
          return []
        }
      },
      subjectData () {
        if (this.pieData.subjects && this.pieData.subjects.length > 0) {
          let arr = []
          // let _this = this
          this.pieData.subjects.forEach(item => {
            let temp = {}
            temp.name = item.name
            temp.value = item.count
            arr.push(temp)
            // _this.subjectTotalCount += item.count
          })
          return arr
        } else {
          return []
        }
      }
    },
    methods: {
      getData () {
        this.getHeader()
        this.getSubjectGrade()
      },
      getHeader () {
        // this.headerData = {
        //   "total_count":38,
        //   "week_increase_rate":100,
        //   "day_increase_rate":-100,
        //   "week_increase":174
        // }
        console.log(this.headerData)
        enrollBoardApi.getBoardHeader().then(res => {
          if (res.ok) {
            this.headerData = res.data
          }
        })
      },
      getSubjectGrade () {
        enrollBoardApi.getSubjectsGradesRanking().then(res => {
          if (res.ok) {
            this.pieTitle = res.data.header
            this.gradeTotalCount = res.data.grade_total
            this.subjectTotalCount = res.data.subject_total
            this.pieData = res.data
            this.drawPie()
          }
        })
      },
      getWorkingPlanActivities (id) {
        console.log('id===', id)
        let params = {
          operation_plan_id: id
        }
        enrollBoardApi.getWorkingPlanActivities(params).then(res => {
          if (res.ok) {
            this.subGradeData = res.data
            this.drawLine()
          }
        })
      },
      drawPie () {
        let data = this.selectTab === 0 ? this.gradeData : this.subjectData
        let tipName = this.selectTab === 0 ? '年级' : '学科'
        let myPie = echarts.init(document.getElementById('myPie')) //
        myPie.resize()
        myPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          color: ['#40A2FF', '#39CFCE', '#43D474', '#FFCC4A', '#FF738A', '#B575F9', '#6780FF', '#30C8ED', '#3DD9B7', '#FFB263', '#FF8377', '#EB89EE'],
          legend: {
            orient: 'vertical',
            x: 'right'
            // data: ['一年级', '二年级', '三年级', '四年级', '五年级']
          },
          series: [
            {
              name: tipName,
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                borderWidth: 5, // 设置border的宽度有多大
                borderColor: '#fff'
              },
              data: data
            }
          ]
        })
      },
      drawLine () {
        let data = this.subGradeData
        let activityData = []
        let studentData = []
        let highStudentData = []
        if (data && data.length > 0) {
          this.noActivity = false
          this.$nextTick(function () {
            let myLine = echarts.init(this.$refs.myLine)
            myLine.resize()
            data.forEach(item => {
              activityData.push(item.name)
              studentData.push(item.student_count)
              highStudentData.push(item.high_student_count)
            })
            this.lineData = [
              {
                name: '高黏性人数',
                type: 'line',
                data: highStudentData
              },
              {
                name: '参与人数',
                type: 'line',
                data: studentData
              }
            ]
            myLine.setOption({
              title: {
                text: '活动数据',
                left: 'center'
              },
              tooltip: {
                trigger: 'axis'
              },
              color: ['#008ffb', '#00c361'],
              legend: {
                data: ['高黏性人数', '参与人数'],
                x: 'right'
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                offset: 10,
                axisLabel: {
                  interval: 0,
                  rotate: 60,
                  formatter (value) {
                    if (value.length > 10) {
                      return value.length > 20 ? value.substring(0, 10) + '\n' + value.substring(10, 20) + '\n' + value.substring(20, value.length + 1) : value.substring(0, 10) + '\n' + value.substring(10, value.length + 1)
                    } else {
                      return value
                    }
                  }
                },
                data: activityData
              },
              yAxis: {
                type: 'value',
                minInterval: 1
              },
              series: this.lineData
            })
          })
        } else {
          this.noActivity = true
        }
      },
      changeTab (val) {
        this.selectTab = val
        this.drawPie()
      },
      changeCard (data) {
        console.log('data===', data)
        this.getWorkingPlanActivities(data)
      },
      getRandomNum () {
        let arr = []
        while (arr.length < 21) {
          arr.push(Math.round(1000 * Math.random()))
        }
        return arr
      }
    }
  }
</script>
<style lang="less" scoped>
  #enrollReportPage{
    background-color: #fff;
    padding: 20px;
    color: #000;
    .font-w500{
      font-weight: 500;
    }
    .enroll-top{
      width: 100%;
      height: 500px;
      /*background-color: lightBlue;*/
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .enroll-top-left{
        width: 60%;
        height: 100%;
        /*background-color: red;*/
        .enroll-top-left-top{
          width: 100%;
          height: 160px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .etlt-item{
            width: 30%;
            height: 100px;
            border: 1px solid #ebebeb;
            padding: 15px;
            text-align: left;
            position: relative;
            .etlt-item-num{
              font-size: 20px;
              font-weight: 500;
            }
            .showTip {
              position: absolute;
              top: 10px;
              right: 10px;
              width: 20px;
              height: 20px;
              background: url("../../../../static/img/icon-tip.png") no-repeat center;
              background-size: 100% 100%;
              cursor: pointer;
            }
            .rate-box{
              margin-top: 10px;
              div {
                display: block;
                font-size: 12px;
                position: relative;
                .icon-ar{
                  color: #82d879;
                  display: inline-block;
                  padding: 0px 5px;
                }
                .icon-ar.rotate180{
                  transform: rotateX(180deg);
                  color: #fd2037;
                }
                .increaseNum {
                  position: absolute;
                  display: inline-block;
                  left: 120px;
                }
                .rateTip {
                  width: 12px;
                  display: inline-block;
                  height: 12px;
                  background: url("../../../../static/img/icon-tip.png") no-repeat center;
                  background-size: 100% 100%;
                  cursor: pointer;
                  position: relative;
                  top: 2px;
                  margin-right: 2px;
                }
              }
            }
          }
          .etlt-item + .etlt-item {
            margin-left: 60px;
          }
        }
        .enroll-top-left-bottom{
          width: 100%;
          height: 340px;
          /*background-color: #5B247A;*/
          border: 1px solid #ebebeb;
          box-sizing: border-box;
          padding: 10px;
          text-align: left;
          .etlb-title{
            font-weight: 500;
          }
        }
      }
      .enroll-top-right{
        width: 40%;
        height: 100%;
        color: #000;
        /*background-color: green;*/
        border-bottom: 1px solid #ebebeb;
        box-sizing: border-box;
        padding: 0px 5px;
        text-align: left;
        .enroll-top-right-title{
          padding: 0px 20px;
          height: 40px;
          line-height: 40px;
          font-weight: 500;
          border-bottom: 1px solid #ebebeb;
        }
        .pie-box{
          padding: 10px 20px;
          .pie-tab {
            .pie-tab-item {
              font-size: 14px;
              font-weight: 400;
              height: 30px;
              line-height: 30px;
              width: 80px;
              display: inline-block;
              text-align: center;
              border: 1px solid #ebebeb;
              cursor: pointer;
            }
            .pie-tab-item + .pie-tab-item {
              border-left: 0px;
            }
            .pie-tab-item.isActive{
              border: 1px solid #27a0fa;
              color: #27a0fa;
            }
          }
          .pie-content {
            position: relative;
            .num-box{
              position: absolute;
              top: 200px;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
            }
          }
        }
      }
    }
    .enroll-bottom{
      width: 100%;
      border: 1px solid #ebebeb;
      box-sizing: border-box;
      margin-top: 20px;
      padding: 10px;
      .enroll-bottom-top{
        width: 100%;
        height: 260px;
        /*background-color: #8a6d3b;*/
        text-align: left;
      }
      .enroll-bottom-bottom{
        width: 100%;
        /*height: 390px;*/
        text-align: left;
        /*background-color: #666666;*/
        .noData{
          height: 50px;
          line-height: 50px;
          text-align: center;
        }
      }
    }
  }
</style>
