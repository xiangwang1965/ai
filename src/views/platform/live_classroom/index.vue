<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">直播间管理</el-breadcrumb-item>
      </el-breadcrumb>
      <a>
        <el-button type="primary" class="clearfix cac-button-one" size="small" round icon="el-icon-plus" @click="createLiveroom">创建直播间</el-button>
      </a>
    </div>
    <div class="tableWrapper" id="tableWrapper">
      <el-table :data="liveRoomList" style="width: 100%;font-size: 12px" v-loading="loading">
        <el-table-column :resizable="false" width="90" align="center" prop="date" label="序号" type="index" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="name" label="直播间名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="province_name" label="省" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="city_name" label="市" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="area_name" label="区" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="address" label="详细地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="is_active" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="params.total>0" v-text="scope.row.is_active==0?'已禁用':'已启用'"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="is_active" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" v-if="params.total>0" class="cac-button-two" size="mini" round @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button type="primary" v-if="params.total>0" class="cac-button-two" round size="mini" @click="handleDisable(scope.$index, scope.row)">{{scope.row.is_active==0?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="{page: params.page, per_page: params.page_size, total: params.total}" @change="getData"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.page_size" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      params: {
        type: 1,
        page: Number(this.$route.query.page) || 1,
        page_size: 8,
        total: 0
      },
      liveRoomList: [
        {
          name: '',
          province_name: '',
          city_name: '',
          area_name: '',
          address: '',
          is_active: ''
        }
      ],
      queryString: '',
      loading: true
    }
  },
  components: {
    pagination
  },
  created () {
    this.getData()
  },
  methods: {
    getData (index) {
      this.params.page = index || this.params.page
      teacherClassApi.liveRoomList(this.params).then(res => {
        this.loading = false
        if (res.ok) {
          this.liveRoomList = res.data.list
          this.params.total = res.data.total_count
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.getData()
          }
        }
      })
    },
    createLiveroom () {
      this.$router.push({ name: 'createLiveClassroom' })
    },
    handleDetail (index, item) {
      this.$router.push({ name: 'LiveClassroomDetail', query: { room_id: item.room_id } })
    },
    handleDisable (index, item) {
      let text = item.is_active === 1 ? '禁用' : '启用'
      this.$confirm('是否确定' + text + '该课程?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        var isActive = item.is_active === 1 ? 0 : 1
        let params = {
          room_id: item.room_id,
          is_active: isActive
        }
        teacherClassApi.activeLiveRoom(params).then(res => {
          if (res.ok) {
            item.is_active = item.is_active === 1 ? 0 : 1
            this.$message({
              type: 'success',
              message: text + '成功',
              center: true
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + text,
          center: true
        })
      })
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getData()
    }
  }
}
</script>
<style scoped>
.tableWrapper {
  text-align: center;
}
.viewTitle {
  width: 100%;
  text-align: left;
}
.searchRow {
  margin-top: 18px;
}
.searchRow {
  text-align: left;
}
.searchRow__input {
  width: 220px;
  float: right;
}
.selectRow {
  width: 100%;
  text-align: justify;
  overflow: hidden;
  margin-top: 20px;
}
.selectRow__select {
  margin-right: 10px;
}

.search-button {
  margin-left: 15px;
}
.create-live{
  display: block;
  height: 32px;
  line-height: 32px;
  margin: 0;
}
</style>
