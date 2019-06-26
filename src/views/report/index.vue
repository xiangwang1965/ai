<template>
    <div class="chart-container">
            <div class="chartBox" id="chartColumn" ></div>
            <div class="chartBox" id="chartLine"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null
            }
        },

        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  color: ['#3398DB'],
                  title: { text: '本月新增学生数' },
                  tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data :  ["SCRATCH", "PYTHON", "NOIP", "AI"],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'学员数',
                            type:'bar',
                            barWidth: '40%',
                            data: [15, 3, 5, 10]
                        }
                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    color: ['#3398DB'],
                    title: {
                        text: '收入情况'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: ['一月', '二月', '三月', '四月', '五月', '六月']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '收入',
                            type: 'bar',
                            sbarWidth: '20%',
                            data: [8200, 9320, 9001, 9340, 12900, 13300]
                        }
                    ]
                });
            },

            drawCharts() {
                this.drawColumnChart()
                this.drawLineChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height:100%;
    }
    .chartBox {
        margin-top:1.5rem;
        display: flex;
        flex: 1;
      width:48%;
      height:5rem;
      float:left;
    }
</style>
