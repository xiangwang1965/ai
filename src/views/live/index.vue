<!--  -->
<template>
  <div class='livePage'>
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">我的双师班级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="selectGroupWrap" v-loading="selectLoading">
      <selectitem v-for="(item,index) in selectItem" :key="index" :selectItem="item" v-on:params="getData" :params="params"></selectitem>
    </div>
    <div class="mediaWrap" v-loading="classLoading">
      <div v-if="dbClass.length > 0" style="text-align: left;">
        <mediadiv v-for="(item,index) in dbClass" :key="index" :mediaInfo="item"></mediadiv>
      </div>
      <div v-else class="emptyImage">
        <img :src="'../../static/img/empty_image.png'" alt="">
        <span>暂无数据</span>
      </div>
    </div>
    <pagination :config="pageConfig" @change="changePage"></pagination>
  </div>
</template>

<script>
import selectitem from '@/components/live/selectitem'
import mediadiv from '@/components/live/mediadiv'
import pagination from '@/components/pagination'
import classroomApi from '@/services/classroom'
import liveApi from '@/services/live'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      selectItem: [{ title: '学科', option: [], name: 'subject' }, { title: '年级', option: [], name: 'grade' }, { title: '学期', option: [], name: 'term' }, { title: '班型', option: [], name: 'level' }, { title: '开课状态', option: [], name: 'status' }],
      dbClass: [],
      params: {
        class_type: '2',
        subject_id: '',
        grade_id: '',
        term_id: '',
        level: '',
        status: ''
      },
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      selectLoading: false,
      classLoading: false
    }
  },
  created () {
    this.getOptions()
    this.getData(this.params)
  },
  computed: {
  },
  methods: {
    getData (data) {
      this.classLoading = true
      let params = data
      params.page = this.pageConfig.page
      params.per_page = this.pageConfig.per_page
      liveApi.query(params).then(res => {
        this.classLoading = false
        if (res.ok) {
          this.dbClass = res.data.list
          this.pageConfig.total = res.data.total_count
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getData()
          }
          this.dbClass.forEach(item => {
            item.classDate = item.begin_date + '--' + item.end_date
          })
        }
      })
    },
    getOptions () {
      this.selectLoading = true
      classroomApi.queryLiveClassOption().then(res => {
        this.selectLoading = false
        if (res.ok) {
          this.selectItem.forEach(item => {
            item.option = res.data.options[item.name]
            item.option.unshift({ key: '', value: '全部' })
          })
        }
      })
    },
    changePage (index) {
      this.pageConfig.page = index || this.pageConfig.page
      this.getData(this.params)
    }
  },
  components: {
    selectitem,
    mediadiv,
    pagination
  }
}
</script>
<style lang="less">
.livePage {
  .selectGroupWrap {
    background-color: #fff;
  }
  .mediaWrap {
    position: relative;
    width: 100%;
    margin-top: 58px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 1160px;
    min-height: 350px;
    .mediaComponent {
      display: inline-block;
      width: 525px;
    }
    .emptyImage {
      position: absolute;
      left: 50%;
      margin-top: 120px;
      width: 150px;
      margin-left: -75px;
      text-align: center;
      img {
        width: 150px;
        margin-bottom: 20px;
      }
      span {
        font-size: 13px;
        margin-top: 35px;
        color: #ABB9C6;
      }
    }
  }
  .emptyText {
    width: 100%;
    height: 50px;
  }
}
</style>
