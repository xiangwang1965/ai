<template>
  <div class="classroomView">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">教室管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group v-if="showSwitch">
        <el-button type="primary" :class="[{'defaultButton': selectButton === 2}, {'cac-button-one': selectButton === 1}]" size="small" round @click="changeSelectButton(1)">面授</el-button>
        <el-button type="primary" :class="[{'defaultButton': selectButton === 1}, {'cac-button-one': selectButton === 2}]" size="small" round @click="changeSelectButton(2)">AI</el-button>
      </el-button-group>
      <el-button v-if="isAI !== 'AI'" type="primary" class="clearfix cac-button-one create-button" size="small" round icon="el-icon-plus" @click="createClassroom">创建教室</el-button>
      <el-input
        v-if="isAI !== 'AI'"
        class="selectRow__input"
        v-model="params.key"
        placeholder="请输入教室名称"
        @keyup.enter.native="getData()"
        size="small"
        style="width:204px;">
        <i slot="suffix" class="el-icon-search el-input__icon" @click="getData()"></i>
      </el-input>
    </div>
    <div :class="['tableWrapper', {'wisroomWrapper': isAI === 'AI' }]" id="tableWrapper">
      <el-table
        :data="liveRoomList.list"
        style="font-size: 12px"
        size="mini"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="拼命加载中">
        <!-- <el-table-column :resizable="false" width="60" align="center" prop="date" label="序号" type="index" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column :resizable="false" align="left" prop="name" label="教室名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="left" prop="name" label="教室用途" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="isAI !== 'AI'" >
              <span>{{!!scope.row.normal_course ? '普通课程' : ''}}</span>
              <span v-if="!!scope.row.normal_course && !!scope.row.live_course">、</span>
              <span>{{!!scope.row.live_course ? '双师课程' : ''}}</span>
            </span>
            <span v-else>AI教室</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="left" prop="campus_name" label="校区" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.campus_id * 1 === 0">全部校区</span>
            <span v-else>{{scope.row.campus_name || '无'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :resizable="false" align="center" prop="school_name" label="机构名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="province_name" label="省" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="city_name" label="市" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="area_name" label="区" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="address" label="详细地址" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column v-if="!isAI" :resizable="false" align="center" prop="is_active" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-text="scope.row.is_active==0?'已禁用':'已启用'"></div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="is_active" width="220" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="cac-button-two" round @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button v-if="!isAI" type="primary" class="admin-able cac-button-two" round size="mini" @click="handleDisable(scope.$index, scope.row)">{{scope.row.is_active==0?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="{page: params.page, per_page: params.page_size, total: liveRoomList.totalCount}" @change="goPage"></pagination>
      <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :page-size="params.page_size" :current-page="params.page" background layout="prev, pager, next" :total="liveRoomList.totalCount">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import teacherClassApi from '@/services/platform/teacher_class'
import classroomApi from '@/services/internal/classroom'
import wisroomApi from '@/services/wisroom'
import pagination from '@/components/pagination'
import authUtils from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'
export default {
  props: [ 'source' ],
  data () {
    return {
      params: {
        type: 2,
        page: Number(this.$route.query.page) || 1,
        page_size: 8,
        key: ''
      },
      liveRoomList: {
        totalCount: 0,
        list: []
      },
      queryString: '',
      loading: true,
      selectButton: 0,
      showSwitch: false,
      brands: this.$store.state.brandList
    }
  },
  components: {
    pagination
  },
  created () {
    this.init()
  },
  updated () {
  },
  computed: {
    isAI () {
      if (this.selectButton === 1) {
        return ''
      }
      if (this.selectButton === 2) {
        return 'AI'
      }
    }
  },
  methods: {
    init () {
      // let brandIds = []
      let cooperationsName = []
      let brandList = JSON.parse(authUtils.getUser().brandList)
      brandList.map((v, i) => {
        v.cooperations.map((o, j) => {
          cooperationsName.push(o.cooperation_name)
        })
      })
      if ((cooperationsName.indexOf('面授') >= 0 || cooperationsName.indexOf('内容') >= 0) && cooperationsName.indexOf('AI') >= 0) {
        this.selectButton = 1
        this.showSwitch = true
      } else {
        this.showSwitch = false
        if (cooperationsName.indexOf('面授') >= 0) {
          this.selectButton = 1
        }
        if (cooperationsName.indexOf('AI') >= 0) {
          this.selectButton = 2
        }
      }
      this.getData()
      /* 根据品牌加合作模式判定权限
            let brandList = JSON.parse(authUtils.getUser().brandList)
            brandList.map((v, i) => {
              brandIds.push(v.id)
              v.cooperations.map((o, j) => {
                cooperationsList.push(o.id)
              })
            })
            if (brandIds.indexOf(1) >= 0 && brandIds.indexOf(2) >= 0 && brandIds.indexOf(4) >= 0) {
              if ((cooperationsList.indexOf(2) >= 0 || cooperationsList.indexOf(7) >= 0) && (cooperationsList.indexOf(4) >= 0 || cooperationsList.indexOf(6) >= 0 || cooperationsList.indexOf(8) >= 0)) {
                this.selectButton = 1
                this.showSwitch = true
              } else {
                if ((cooperationsList.indexOf(2) >= 0 || cooperationsList.indexOf(7) >= 0) && (cooperationsList.indexOf(4) < 0 && cooperationsList.indexOf(6) < 0 && cooperationsList.indexOf(8) < 0)) {
                  this.selectButton = 1
                  this.showSwitch = false
                }
                if ((cooperationsList.indexOf(2) < 0 && cooperationsList.indexOf(7) < 0) && (cooperationsList.indexOf(4) >= 0 || cooperationsList.indexOf(6) >= 0 || cooperationsList.indexOf(8) >= 0)) {
                  this.selectButton = 4
                  this.showSwitch = false
                }
              }
            } else {
              this.selectButton = 2
            }
            */
    },
    changeSelectButton (val) {
      this.$set(this, 'selectButton', val)
      this.getData()
    },
    getData (flag) {
      this.params.page = flag ? this.params.page : 1
      this.loading = true
      if (this.selectButton === 2) {
        wisroomApi.getClassroomList(this.params).then(res => {
          this.loading = false
          let start = (this.params.page - 1) * this.params.page_size
          let end = start + this.params.page_size
          this.liveRoomList.list = res.data.data.slice(start, end)
          this.liveRoomList.totalCount = res.data.total_count
          let num = requireAgainPage({page: this.params.page, per_page: this.params.page_size, total: this.liveRoomList.totalCount})
          if (num > 0) {
            this.params.page = num
            this.getData(num)
          }
        })
      } else {
        if (this.source === 'classroom') {
          classroomApi.getClassroomList(this.params).then(res => {
            this.loading = false
            if (res.ok) {
              this.liveRoomList.list = res.data.list
              this.liveRoomList.totalCount = res.data.total_count
              let num = requireAgainPage({page: this.params.page, per_page: this.params.page_size, total: this.liveRoomList.totalCount})
              if (num > 0) {
                this.params.page = num
                this.getData(num)
              }
            }
          })
        } else {
          teacherClassApi.liveRoomList(this.params).then(res => {
            this.loading = false
            if (res.ok) {
              this.liveRoomList.list = res.data.list
              this.liveRoomList.totalCount = res.data.total_count
              let num = requireAgainPage({page: this.params.page, per_page: this.params.page_size, total: this.liveRoomList.totalCount})
              if (num > 0) {
                this.params.page = num
                this.getData(num)
              }
            }
          })
        }
      }
    },
    createClassroom () {
      this.$router.push({ name: 'createClassroom' })
    },
    handleDetail (index, item) {
      this.$router.push({ name: 'classroomDetail', query: { room_id: item.room_id || item.id, isAI: this.isAI } })
    },
    handleDisable (index, item) {
      let text = item.is_active === 1 ? '禁用' : '启用'
      this.$confirm('是否' + text + '?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.loading = true
        var isActive = item.is_active === 1 ? 0 : 1
        let params = {
          room_id: item.room_id,
          is_active: isActive
        }
        if (this.source === 'classroom') {
          classroomApi.changeClassroomStatus(params).then(res => {
            this.loading = false
            if (res.ok) {
              item.is_active = item.is_active === 1 ? 0 : 1
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        } else {
          teacherClassApi.activeLiveRoom(params).then(res => {
            this.loading = false
            if (res.ok) {
              item.is_active = item.is_active === 1 ? 0 : 1
              this.$message({
                type: 'success',
                message: text + '成功',
                center: true
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消' + text,
          center: true
        })
      })
    },
    goPage (val) {
      this.params.page = val
      this.getData(true)
    }
  }
}
</script>
<style lang="less">
.classroomView{
  .cac-bread-bar {
    .selectRow__input {
      float: right;
    }
    .el-button-group {
      display: block;
      width: 140px;
      margin-bottom: 20px;
      .el-button {
        min-width: 70px;
      }
      .defaultButton {
        background-color: transparent;
        color: #3C75F6;
        height: 30px;
        border: 1px solid #EEEEEE;
      }
    }
  }
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
}
</style>
