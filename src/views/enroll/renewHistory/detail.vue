<!-- 所有类型活动列表页 -->
<template>
  <div class="history-detail">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/renewHistory' }">历史续报</router-link>
        <el-breadcrumb-item>续报详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="consult-list-Table">
      <p></p>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="detailList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="student_name" label="学生姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="续报课程" show-overflow-tooltip>
          <template slot-scope='scope'>
            <div v-if="scope.row.go_on == 1">{{scope.row.go_on_class_name}}</div>
            <div v-else>未续报</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import enrollBoardApi from '../../../services/enroll/enrollBoard'
  export default {
    data () {
      return {
        loading: false,
        queryParam: {
          org_class_id: ''
        },
        detailList: []
      }
    },
    created () {
      this.queryParam.org_class_id = this.$route.query.org_class_id
      this.getData()
    },
    methods: {
      // 获取续报详情列表
      getData () {
        this.loading = true
        enrollBoardApi.getOrgClassesDetail(this.queryParam).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.status_code === 200) {
            this.detailList = res.data
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .history-detail {
    .consult-list-Table {
      margin-top: 20px;
    }
  }
</style>
