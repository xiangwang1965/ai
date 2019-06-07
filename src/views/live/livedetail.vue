<!-- 双师课程详情 -->
<template>
  <div class='mediadetailPage'>
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/live' }">我的双师班级</router-link>
        <el-breadcrumb-item class="cac-bread">查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <h3 class="baseInfo_title">基本信息</h3>
    <infodetail :mediaInfo="mediaInfo"></infodetail>
    <h3 class="baseInfo_title">讲次信息</h3>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      size="mini"
      highlight-current-row max-height="390">
      <el-table-column align="left" label="讲次" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <span>第&nbsp;{{scope.$index+1}}&nbsp;讲</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="讲次名称" prop="lesson_name" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="上课时间" prop="date" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import infodetail from '@/components/live/infodetail'
import LiveApi from '../../services/live'
export default {
  data () {
    return {
      loading: false,
      mediaInfo: {},
      code: this.$route.query.code,
      tableData: []
    }
  },
  components: {
    infodetail
  },
  created () {
    this.getDate()
  },
  methods: {
    getDate () {
      let params = {
        'code': this.code
      }
      LiveApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.mediaInfo = res.data
          this.mediaInfo.classDate = this.mediaInfo.begin_date + ' 至 ' + this.mediaInfo.end_date
          this.tableData = res.data.lessons
          this.tableData.forEach(item => {
            item.date = item.date + '  ' + item.time_span
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.mediadetailPage {
  text-align: left;
  .baseInfo_title {
    font-size: 20px;
    font-weight: bold;
    height: 28px;
    line-height: 28px;
    margin: 10px 0 30px 0;
  }
}
</style>