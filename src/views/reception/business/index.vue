<template>
  <div class="receptionIndex" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">业务办理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="manageWraper">
      <router-link :to="{ name: 'studentEntry', query: {type: 'entry'} }">
        <el-button type="primary" class="clearfix cac-button-one" round size="small" :icon="'icon-cac-edit-white'">{{isCharge >= 0 ? '报名/缴费' : '报名'}}</el-button>
      </router-link>
      <router-link v-if="isCharge >= 0" :to="{ name: 'addFee'}">
        <el-button type="primary" class="clearfix cac-button-one" round size="small" :icon="'icon-cac-addfee-white'">补费</el-button>
      </router-link>
      <router-link :to="{ name: 'changeClass' }">
        <el-button type="primary" class="clearfix cac-button-one create-button" round size="small" :icon="'icon-cac-transfer-white'">转班</el-button>
      </router-link>
      <router-link :to="{ name: 'quitClass' }">
        <el-button type="primary" class="clearfix cac-button-one create-button" round size="small" :icon="'icon-cac-divide-white'">{{isCharge >= 0 ? '退费/班' : '退班'}}</el-button>
      </router-link>
      <el-input size="small" v-model="studentKey" @keyup.enter.native="getStudentList()" placeholder="请输入姓名、手机号">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getStudentList()">
        </i>
      </el-input>
    </div>
    <div class="studentWraper">
      <el-table :data="studentData.list">
        <el-table-column
          label="姓名"
          prop="name"
          align="left"
          show-overflow-tooltip>

        </el-table-column>
        <el-table-column
          label="手机号"
          prop="telephone"
          align="center"
          show-overflow-tooltip>

        </el-table-column>
        <el-table-column
          label="所属校区"
          prop=""
          align="left"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.campus_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已报课程"
          prop="all_course_count"
          align="center"
          width="120"
          show-overflow-tooltip>

        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link style="margin-right:10px;" :to="{name: 'receptionStudentDetail', query: {id: scope.row.id}}">
              <el-button class="clearfix cac-button-two create-button" round size="mini">详情</el-button>
            </router-link>
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="editStudent(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="goPage"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import receptionApi from '@/services/reception'
import authUtils from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      studentData: {
        list: [],
        totalNum: 0
      },
      studentKey: '',
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      loading: false,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge')
    }
  },
  components: {
    pagination: pagination
  },
  created () {
    this.getStudentList()
  },
  methods: {
    getStudentList (flag) {
      this.loading = true
      let params = {
        page: flag ? this.pageConfig.page : 1,
        per_page: this.pageConfig.per_page,
        key: this.studentKey
      }
      receptionApi.getStudentList(params).then(res => {
        if (res.status_code === 200) {
          this.loading = false
          this.studentData.list = res.data.data
          this.studentData.totalNum = this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getStudentList()
          }
        }
      })
    },
    editStudent (item) {
      window.localStorage.setItem('editConfig', JSON.stringify(item))
      this.$router.push({ name: 'studentEntry', query: {type: 'edit', id: item.id} })
    },
    goPage (val) {
      this.pageConfig.page = val
      this.getStudentList(true)
    }
  }
}
</script>
<style lang="less">
.receptionIndex{
  .manageWraper {
    margin-bottom: 20px;
    text-align: left;
    .el-input {
      float: right;
      width: 204px;
      input {
        border-radius: 16px;
      }
    }
  }
}
</style>
