<template>
    <div class="report">
        <div v-show="hasReport&&!isLoading">
            <div class="report-title">{{courseName}}</div>
            <div class="report-item">
                <div class="report-label">学习内容:</div>
                <div class="report-content">{{report.value}}</div>
            </div>
            <div class="report-item">
                <div class="report-label">课后作业:</div>
                <div class="report-content">{{report.task}}</div>
            </div>
            <div class="report-item">
                <div class="report-label">课堂表现:</div>
                <div class="report-content">{{report.feedback}}</div>
            </div>
            <div class="report-item">
                <div class="report-label">老师反馈:</div>
                <div class="report-content">{{report.behavior}}</div>
            </div>
            <div class="report-item">
                <div class="report-label">课堂评估: <span>打分制度为从低到高</span></div>
                <div class="report-content noborder">
                    <table>
                        <tr>
                            <td>操作能力</td>
                            <td>
                                <span v-for="i in 5" :key="i" :class="{active: report.operation>i}"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>创新能力</td>
                            <td>
                                <span v-for="i in 5" :key="i" :class="{active: report.innovate>i}"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>交流能力</td>
                            <td>
                                <span v-for="i in 5" :key="i" :class="{active: report.exchange>i}"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>团队能力</td>
                            <td>
                                <span v-for="i in 5" :key="i" :class="{active: report.team>i}"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>抗挫折能力</td>
                            <td>
                                <span v-for="i in 5" :key="i" :class="{active: report.resist>i}"></span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="no-report" v-show="!hasReport&&!isLoading">
            <i class="el-icon-warning"></i> 暂无学习报告
        </div>
    </div>
</template>
<script>
    import classApi from '../../services/classroom';
    export default {
        data () {
            return {
                isLoading: true,
                hasReport: false,
                report: {},
                courseName: ''
            };
        },
        components: {},
        watch: { },
        created () { },
        methods: {
            getReportInfo (item, curUid) {
                this.isLoading = true;
                this.courseName = item.name;
                let params = {
                    clsId: item.class_id,
                    studentId: curUid,
                    hourId: item.hour_id
                };
                classApi.courseReportInfo(params).then(res => {
                    if (res.code === '001') {
                        if (res.data !== null) {
                            this.hasReport = true;
                            this.report = res.data;
                        } else {
                            this.hasReport = false;
                        }
                    } else {
                        this.hasReport = false;
                    }
                    this.isLoading = false;
                    console.log(res.data);
                });
            }
        },
        mounted () {}
    };
</script>
<style lang="less" scoped>
    .no-report { text-align: center; }
    .report {
        .report-title {
            margin-bottom: .4rem;
            font-weight: bold;
            color: #000;
            font-size: .2rem;
        }
        .report-item {
            margin-bottom: .3rem;
            font-size: .16rem;
            .report-label {
                span {
                    margin-left: .2rem;
                    color: #c7c7c7;
                }
            }
            .report-content {
                margin-top: .1rem;
                padding: .2rem;
                border: 1px solid #ddd;
                &.noborder { border: none; }
                table {
                    margin-left: .6rem;
                    color: #8e8e8e;
                    td {
                        height: .3rem;
                        &:nth-child(2) {
                            padding-left: .3rem;
                        }
                        span {
                            display: inline-block;
                            margin-left: .1rem;
                            height: .2rem;
                            width: .6rem;
                            border: 1px solid #ddd;
                            &.active {
                                background-color: #ffc151;
                                border-color: #ffc151;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
