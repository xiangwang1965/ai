<template>
    <div id="activityTable" class="activityTable">
        <div class="etlb-des">
            <p>参与用户数<span class="numstyle">{{student_count | formateNum}}</span></p>
            <!--<p class="mgl-80">参与机构数<span class="numstyle">{{school_count | formateNum}}</span></p>-->
        </div>
        <el-table class="app-bd" :data="table" stripe style="width: 100%" height="230" v-loading="loading">
            <el-table-column header-align="center" label="排名" prop="index" show-overflow-tooltip>
            </el-table-column>
            <el-table-column header-align="center" label="活动名称" prop="name" show-overflow-tooltip>
            </el-table-column>
            <el-table-column header-align="center" label="机构数" prop="schools" show-overflow-tooltip>
            </el-table-column>
            <el-table-column header-align="center" label="用户数" prop="users" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <pagination :config="{page: activitesParams.page, per_page: activitesParams.per_page, total: total_count}" @change="goPage"></pagination>
    </div>
</template>
<script>
import enrollBoardApi from '../../../../services/enroll/enrollBoard'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      activitesParams: {
        page: 1,
        per_page: 5
      },
      total_count: 0,
      student_count: 0,
      school_count: 0,
      table: [],
      loading: false
    }
  },
  created () {
    console.log('活动表格created')
    this.getData()
  },
  components: {
    pagination
  },
  filters: {
    formateNum (str) {
      if (str) {
        let reg = /(\d)(?=(?:\d{3})+$)/g
        return str.toString().replace(reg, '$1,')
      } else {
        return 0
      }
    }
  },
  methods: {
    getData () {
      enrollBoardApi.getWorkingActivites(this.activitesParams).then(res => {
        if (res.ok) {
          this.table = res.data.activity_list.data
          this.total_count = res.data.activity_list.total
          this.student_count = res.data.student_count
          this.school_count = res.data.school_count
        }
      })
    },
    goPage (data) {
      this.activitesParams.page = data
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
    #activityTable{
        text-align: center;
        .etlb-des{
            font-size: 14px;
            color: #d3d3d3;
            margin: 10px 0px;
            text-align: left;
            .mgl-80 {
                margin-left: 80px;
            }
            .all-btn {
                float: right;
                margin-right: 20px;
                color: #27a0fa;
                cursor: pointer;
            }
            p{
                display: inline-block;
                .numstyle {
                    font-size: 20px;
                    color: #000;
                    padding: 0 10px;
                    position: relative;
                    top: 2px;
                }
            }
        }
        .el-table::before{
            height: 0px;
        }
    }
</style>
<style>
  #activityTable .el-table th, #activityTable .el-table td {
    padding: 5px 0px;
  }
  #activityTable .el-table--mini td, #activityTable .el-table td {
    height: 36px;
    text-align: center;
  }
  #activityTable .el-table .has-gutter tr th {
    height: 36px;
  }
</style>
