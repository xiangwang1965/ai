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
                  title: { text: '学生课程' },
                  tooltip: {},
                  xAxis: {
                      data: ["SCRATCH", "PYTHON", "NOIP", "AI"]
                  },
                  yAxis: {},
                  series: [{
                      name: '学生数量',
                      type: 'bar',
                      data: [5, 20, 36, 10]
                    }]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '学生'
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
                        boundaryGap: false,
                        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十月','十二月']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '加入学生',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320,500,600,900,1000,800]
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
        margin-top:1rem;
        display: flex;
        flex: 1;
      width:50%;
      height:5rem;
      float:left;
    }
</style>
