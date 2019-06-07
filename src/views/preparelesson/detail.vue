<!-- 双师课程详情 -->
<template>
  <div class='prepareLessonDetail'>
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/live' }">我的主辅备课</router-link>
        <el-breadcrumb-item class="cac-bread">查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <h3 class="baseInfo_title">基本信息</h3>
    <infodetail :mediaInfo="mediaInfo" :size="prepareLessonSize"></infodetail>
    <h3 class="baseInfo_title">讲次信息</h3>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="mediaInfo.lessons"
      size="mini"
      highlight-current-row max-height="390">
      <el-table-column align="left" label="讲次" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <span>第&nbsp;{{scope.$index+1}}&nbsp;讲</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="讲次名称" prop="lesson_name" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="上课时间" prop="lesson_time" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import infodetail from '@/views/preparelesson/infodetail'
import preparelessonApi from '@/services/preparelesson'

export default {
  data () {
    return {
      loading: false,
      mediaInfo: {
        image: '',
        name: '',
        teacher_name: '',
        lesson_count: '',
        total_amount: '',
        classDate: '',
        available_amount: '',
        status: '',
        status_id: ''
      },
      code: this.$route.query.code,
      prepareLessonSize: {
        imageSize: '164x164',
        contentSize: '500x200'
      },
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
        live_class_id: this.$route.query.id
      }
      preparelessonApi.getPreparelessonDetail(params).then(res => {
        this.classLoading = false
        if (res.ok) {
          res.data.teacher = ''
          if (res.data.ass_teachers) {
            res.data.ass_teachers.map((v, i) => {
              if (res.data.ass_teacher_id === v.id) {
                res.data.teacher = v.name
              } else {
                res.data.teacher = res.data.ass_teacher_name
              }
            })
          }
          this.mediaInfo = res.data
          this.mediaInfo.lesson_count = res.data.lessons.length
        }
      })
    }
  }
}
</script>
<style lang="less">
.prepareLessonDetail {
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
