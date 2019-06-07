<!--  -->
<template>
  <div class='prepareLesson'>
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">我的主辅备课</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="selectGroupWrap" v-loading="selectLoading">
      <selectitem v-for="(item,index) in selectItem" :key="index" :selectItem="item" v-on:params="getData" :params="params"></selectitem>
    </div>
    <div class="mediaWrap" v-loading="classLoading">
      <prepareLesson v-if="dbClass.length > 0" v-for="(item,index) in filterDbClass" :key="index" :item="item" :from="'prepareLesson'" :size="prepareLessonSize"></prepareLesson>
      <div v-else class="emptyText">暂无数据</div>
    </div>
    <pagination :config="pageConfig" @change="changePage"></pagination>
  </div>
</template>

<script>
import selectitem from '@/components/live/selectitem'
import prepareLesson from '@/views/preparelesson/preparelesson'
import pagination from '@/components/pagination'
import classroomApi from '@/services/classroom'
import preparelessonApi from '@/services/preparelesson'
import schedulelesson from './schedulelesson'
export default {
  data () {
    return {
      selectItem: [{ title: '学科', option: [], name: 'subject' }, { title: '年级', option: [], name: 'grade' }, { title: '学期', option: [], name: 'term' }, { title: '开课状态', option: [], name: 'status' }],
      prepareLessonSize: {
        imageSize: '164x164',
        contentSize: '500x200'
      },
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
        total: 11
      },
      selectLoading: false,
      classLoading: false
    }
  },
  components: {
    selectitem,
    prepareLesson,
    pagination,
    schedulelesson
  },
  created () {
    this.getOptions()
    this.getData(this.params)
  },
  computed: {
    filterDbClass () {
      let start = (this.pageConfig.page - 1) * this.pageConfig.per_page
      let end = start + this.pageConfig.per_page
      return this.dbClass.slice(start, end)
    }
  },
  methods: {
    getData (data) {
      this.classLoading = true
      let params = data
      preparelessonApi.getPreparelessonList(params).then(res => {
        this.classLoading = false
        if (res.ok) {
          this.dbClass = res.data
          this.pageConfig.total = res.data.length
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
    }
  }
}
</script>
<style lang="less">
.prepareLesson {
  .selectGroupWrap {
    background-color: #fff;
  }
  .mediaWrap {
    width: 100%;
    max-width: 1280px;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .emptyText {
      height: 50px;
      text-align: center;
    }
  }
  .emptyText {
    width: 100%;
    height: 50px;
  }
}
</style>