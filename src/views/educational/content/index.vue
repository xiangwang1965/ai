<!-- 课程(内容)包列表页 -->
<template>
  <div class="content-list-wrap">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">我的课程包</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query-form">
      <SelectItem label="学科" param="subject_id" @selectChange="handleSelectChange" :itemList="courseOptionsList" />
      <SelectItem label="年级" param="grade_id" @selectChange="handleSelectChange" :itemList="gradeOptionsList" />
      <SelectItem label="状态" param="use_status" @selectChange="handleSelectChange" :itemList="statusOptionsList" />
    </div>
    <div class="content-table" v-loading="listLoading">
      <ContentItem v-for="item in contentList" :key="item.id" :data="item" :teacherList="teacherList">
      </ContentItem>
      <div v-if="contentList.length === 0" class="empty-data">
        <img src="../../../../static/img/empty_image.png" alt="">
        <span>暂无数据</span>
      </div>
    </div>
    <Pagination :config="pageConfig" @change="getContentList(false)"></Pagination>
  </div>
</template>

<script>
import SelectItem from './selectItem'
import ContentItem from './contentItem'
import Pagination from '@/components/pagination'
import contentApi from '@/services/educational/content'

export default {
  name: 'ContentList',
  components: {
    SelectItem,
    ContentItem,
    Pagination
  },
  data () {
    return {
      listLoading: false,
      queryParams: {},
      teacherList: [],
      contentList: [],
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      courseOptionsList: [
        { key: 0, value: '全部' },
        { key: 2, value: '数学' }
      ],
      gradeOptionsList: [
        { key: 0, value: '全部' },
        { key: 1, value: '一年级' },
        { key: 2, value: '二年级' },
        { key: 3, value: '三年级' },
        { key: 4, value: '四年级' },
        { key: 5, value: '五年级' },
        { key: 6, value: '六年级' },
        { key: 7, value: '七年级' },
        { key: 8, value: '八年级' }
      ],
      statusOptionsList: [
        { key: 0, value: '全部' },
        { key: 1, value: '未生效' },
        { key: 2, value: '生效中' },
        { key: 3, value: '已到期' }
      ],
      courseAllOptionsList: [
        { key: 0, value: '全部' },
        { key: 1, value: '语文' },
        { key: 2, value: '数学' },
        { key: 3, value: '英语' },
        { key: 4, value: '物理' },
        { key: 5, value: '化学' },
        { key: 6, value: '生物' },
        { key: 7, value: '历史' },
        { key: 8, value: '地理' },
        { key: 9, value: '政治' }
      ]
    }
  },
  computed: {
    // contentListCom () {
    //   let that = this
    //   return this.contentList.map((item, index) => {
    //     that.courseAllOptionsList.forEach(i => {
    //       if (item.subject_id === i.key) {
    //         item.subjectName = i.value
    //       }
    //     })

    //     that.gradeOptionsList.forEach(i => {
    //       if (item.grade_id === i.key) {
    //         item.gradeName = i.value
    //       }
    //     })

    //     that.gradeOptionsList.forEach(i => {
    //       if (item.grade_id === i.key) {
    //         item.gradeName = i.value
    //       }
    //     })

    //     return item
    //   })
    // }
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getContentList(false)
      this.getAllMainTeacherList()
    },
    // 获取课程(内容)包的列表数据
    getContentList (curPage, loadFlag = true) {
      this.pageConfig.page = curPage && typeof curPage === 'number' ? curPage : this.pageConfig.page
      this.listLoading = loadFlag
      const { page, per_page } = this.pageConfig
      let params = Object.assign({}, this.queryParams, { page, page_size: per_page })

      contentApi.getContentList(params).then(res => {
        this.listLoading = false
        if (res.status_code === 200) {
          let that = this
          let gradeAllOptionsList = [{ key: 9, value: '九年级' }].concat(this.gradeOptionsList)
          this.contentList = res.data.list.map((item, index) => {
            that.courseAllOptionsList.forEach(i => {
              if (item.subject_id === i.key) {
                item.subjectName = i.value
              }
            })
            gradeAllOptionsList.forEach(i => {
              if (item.grade_id === i.key) {
                item.gradeName = i.value
              }
            })
            item.effected_at = item.effected_at.split('-').join('.')
            item.expired_at = item.expired_at.split('-').join('.')
            return item
          })

          this.pageConfig.total = res.data.total_count
        } else {
          if (res.status_code === 400) {
            this.$message.error(res.message)
          } else {
            this.$message.error('获取数据失败, 请稍后重试!')
          }
        }
      })
    },
    // 获取所有的面授主讲
    getAllMainTeacherList () {
      contentApi.getAllMainTeacherList().then(res => {
        if (res.status_code === 200) {
          this.teacherList = res.data
        } else {
          if (res.status_code === 400) {
            this.$message.error(res.message)
          } else {
            this.$message.error('获取数据失败, 请稍后重试!')
          }
        }
      })
    },
    // 选择项的参数
    handleSelectChange (val) {
      this.queryParams = Object.assign(this.queryParams, val)
      this.getContentList(1)
    }
  }
}
</script>

<style lang="less" scoped>
.content-list-wrap {
  width: 100%;
  .content-table {
    padding-top: 48px;
    min-height: 350px;
    text-align: left;
    width: 1160px;
  }
  .empty-data {
    padding-top: 100px;
    width: 100%;
    text-align: center;
    img {
      width: 150px;
    }
    span {
      display: block;
      color: #ABB9C6;
      margin-top: 35px;
    }
  }
}
</style>
