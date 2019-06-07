<!-- 所有类型活动列表页 -->
<template>
  <div class="history-list">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="consult-list-Table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="historyList"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="live_class_name" label="课程班名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="grade_name" label="年级" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="subject_name" label="学科" show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column :resizable="false" align="center" prop="type_name" label="班型" show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column :resizable="false" align="center" prop="ass_teacher_name" label="老师" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="current_students" label="在班人数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="go_on_students" label="已续班人数" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit">
          <template slot-scope="scope">
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="goDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="queryParam" @change="getData"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import enrollBoardApi from '../../../services/enroll/enrollBoard'
  import pagination from '@/components/pagination'

  export default {
    data () {
      return {
        breadcrumbTitle: '历史续报一览',
        loading: false,
        queryParam: {
          page: 1,
          per_page: 10,
          total: 0
        },
        historyList: [
          {
            activity_name: 'qqq',
            grade_name: '二年级',
            teacher_name: '二年级',
            type_name: '二年级',
            start_time: '二年级',
            end_time: '二年级',
            id: 11
          }
        ]
      }
    },
    created () {
      this.getData()
    },
    components: {
      pagination
    },
    methods: {
      // 获取所有活动列表数据
      getData () {
        this.loading = true
        enrollBoardApi.getHistoryOrgClasses(this.queryParam).then(res => {
          setTimeout(() => {
            this.loading = false
          }, 300)
          if (res.status_code === 200) {
            this.historyList = res.data.data
            this.queryParam.total = res.data.total
          }
        })
      },
      // 翻页
      goPage (val) {
        this.queryParam.page = val
        this.getData()
      },
      // 查看详情
      goDetail (item) {
        this.$router.push({ name: 'renewHistoryDetail', query: { org_class_id: item.org_class_id } })
      }
    }
  }
</script>

<style lang="less">
  .history-list {
    .consult-list-Table {
      margin-top: 20px;
    }
    .userTable__edit i {
      font-size: 20px;
      transform: translateX(10px);
      cursor: pointer;
      margin: 0 5px;
    }
  }
</style>
