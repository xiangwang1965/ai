<!-- 校区管理 -->
<template>
  <div class='campusPage'>
    <div class="basicPage__title">
      <el-button type='primary' class="basicPage__create cac-button-one" size="small" round icon="el-icon-plus" @click='doCreate'>创建校区</el-button>
      <div class='basic__right'>
        <p>校区总数：</p>
        <span>{{params.total}}</span>
      </div>
    </div>
    <el-table
      class='campusTable'
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data='campusData'
      style='width: 100%;font-size: 12px'
      highlight-current-row>
      <el-table-column :resizable="false" align='left' prop='name' label='校区名称' show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align='left' prop='alladdress' label='校区地址' show-overflow-tooltip>
      </el-table-column>
      <el-table-column :resizable="false" align='left' prop='is_active' label='状态' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.is_active === 1 ? '已启用' : '已禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false" align='center' label='操作' class='edit' width="180">
        <template slot-scope='scope'>
          <el-button class="clearfix cac-button-two create-button" round size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="false" class="clearfix cac-button-two create-button" round size="mini" @click="doDisabled(scope.row.id,scope.row.is_active)">{{scope.row.is_active === 0?'启用':'禁用'}}</el-button>
          <!-- <el-tooltip content="校区修改" placement="top" :open-delay="500">
            <i class="el-icon-edit cac-icon-button" @click="handleEdit(scope.row)"></i>
          </el-tooltip>
          <el-tooltip :content="!scope.row.is_active?'启用':'禁用'" placement="top" :open-delay="500">
            <i class="cac-icon-button" :class="{'el-icon-success':!scope.row.is_active,'el-icon-remove':scope.row.is_active}" @click="doDisabled(scope.row.id,scope.row.is_active)"></i>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :config="params" @change="getData"></pagination>
    <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
    </el-pagination> -->
    <!-- <el-dialog title="创建校区" :visible.sync="dialogTableVisible" width="800px" class="campusPage__dialog">
      <CreateCampus v-on:close="doClose"></CreateCampus>
    </el-dialog> -->
    <!-- <el-dialog title="修改校区" :visible.sync="dialogTableVisible1" width="800px" class="campusPage__dialog">
      <UpdateCampus :UpdateCampus='UpdateCampus' v-on:close="doClosemodify"></UpdateCampus>
    </el-dialog> -->
  </div>
</template>

<script type='text/ecmascript-6'>
import BasicApI from '@/services/basic'
import CreateCampus from './createCampus'
import UpdateCampus from './updateCampus'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      loading: false,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      params: {
        total: 0,
        page: 0,
        per_page: 8,
        mute: true
      },
      campusData: [],
      UpdateCampus: {},
      addtype: true
    }
  },
  components: {
    CreateCampus: CreateCampus,
    UpdateCampus: UpdateCampus,
    pagination: pagination
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取校区
    getData (index) {
      //  获取校区
      this.params.page = index || this.params.page
      this.loading = true
      BasicApI.query(this.params)
        .then(res => {
          this.loading = false
          if (res.ok) {
            this.campusData = res.data.data
            var reg = new RegExp(',', 'g')
            this.campusData.forEach(item => {
              item.alladdress = item.area.full_name.replace(reg, '-') + ' ' + item.address
            })
            this.params.total = res.data.total
            if (requireAgainPage(this.params) > 0) {
              this.params.page = requireAgainPage(this.params)
              this.getData()
            }
          }
        })
    },
    // 禁用用户
    doDisabled (id, status) {
      // status不能实时更新？
      this.campusData.forEach(item => {
        if (id === item.id) {
          status = item.is_active
        }
      })
      let vm = this
      let text = status === 0 ? '启用' : '禁用'
      this.$confirm('是否确定' + text + '该校区?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      })
        .then(() => {
          let params = {
            is_active: status,
            campus_id: id
          }
          BasicApI.disabled(params).then(res => {
            if (res.ok) {
              vm.getData()
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消' + text,
            center: true
          })
        })
    },
    // 关闭创建校区
    doClose (data) {
      this.dialogTableVisible = false
      if (data === 'success') {
        this.getData()
      }
    },
    // 关闭修改校区
    doClosemodify (data) {
      this.dialogTableVisible1 = false
      if (data === 'success') {
        this.getData()
      }
    },
    // 创建校区
    doCreate () {
      this.$router.push({ name: 'createCampus' })
    },
    // 修改校区
    handleEdit (item) {
      // this.$store.commit('setEditConfig', item)
      window.localStorage.setItem('editConfig', JSON.stringify(item))
      this.$router.push({name: 'createCampus', query: { type: 'edit', campusId: item.id }})
    },
    // 翻页
    goPage (val) {
      this.params.page = val
      this.getData()
    }
  }
}
</script>

<style lang="less">
.campusPage{
  text-align: left;
  .basicPage__title {
    margin-bottom: 20px;
  }
  /* 校区的创建修改弹框 */
  .campusPage .el-dialog .el-input__inner,
  .campusPage .el-dialog .el-button,
  .campusPage .el-dialog .el-select {
    height: 40px !important;
    font-size: 14px !important;
    line-height: 40px !important;
  }
  .basic__right{
    float: none;
    display: inline-block;
    color: #7A808D;
    margin-left: 20px;
  }
}
</style>
