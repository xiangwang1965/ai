<!-- 班型管理 -->
<template>
  <div class="classTypePage">
    <div class="basicPage__title">
      <el-input v-model="params.name" placeholder="请输入自定义名称" class="searchRow__input" clearable>
        <el-button type="primary" slot="append" icon="el-icon-search" @click="getData"></el-button>
      </el-input>
      <div class='basic__right'>
        <p>班型总数：</p>
        <span>{{params.total}}</span>
      </div>
    </div>
    <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="classTable" border style="width: 100%" highlight-current-row height="370">
      <el-table-column :resizable="false" align="center" label="自定义名称" min-width="140px">
        <template slot-scope="scope">
          <span>{{scope.row.nick_name}}</span>
          <el-button size="small" type="text" @click="handleChange(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="name" label="系统名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="subject_name" label="学科" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="grade_name" label="年级" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="term_name" label="学期" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="current_count" label="当前班级数" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align="center" prop="finish_count" label="历史班级数" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import basicApi from '@/services/basic'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      loading: false,
      classTable: [],
      params: {
        total: 0,
        page: 1,
        per_page: 20,
        name: '',
        mute: true
      },
      base_class_id: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取班型
    getData () {
      let params = this.params
      this.loading = true
      basicApi.queryBasic(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.ok) {
          this.params.total = res.data.total_count
          this.classTable = res.data.data
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.getData()
          }
        }
      })
    },
    // 翻页
    goPage (val) {
      this.params.page = val
      this.getData()
    },
    // 改变名称
    handleChange (index, item) {
      this.$prompt('请输入自定义名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '名称不正确'
      }).then(({ value }) => {
        let params = {
          'base_class_id': item.base_class_id,
          'nick_name': value
        }
        basicApi.updateName(params).then(res => {
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
          center: true
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
