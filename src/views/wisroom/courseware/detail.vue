<template>
  <div class="courseDetail" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link to="/wisroomCourse">我的AI课程</router-link>
        <el-breadcrumb-item class="cac-bread">课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detailContent">
      <p class="info_title">基本信息</p>
      <div>
        <div class="essentialInfo">
          <div class="left">
            <!--<img v-if="!course.picture_url" :src="defaultWare" alt="">-->
            <img :src="course.picture_url" alt="">
          </div>
          <div class="right">
            <p>{{course.course_name}}</p>
            <div>
              <span>课程类型</span>
              <span>{{course.course_type_name || '无'}}</span>
            </div>
            <div>
              <span>学科</span>
              <span>{{course.subject_name || '无'}}</span>
            </div>
            <div>
              <span>年级</span>
              <span>{{course.grade_name || '无'}}</span>
            </div>
            <div>
              <span>班型</span>
              <span>{{course.class_type_name || '无'}}</span>
            </div>
            <div>
              <span>主讲老师</span>
              <span>{{course.teacher_name}}</span>
            </div>
            <div>
              <span>剩余课程数</span>
              <span>{{course.amount - course.used_amount - course.refund_amount}}</span>
            </div>
            <div>
              <span>总课程数</span>
              <span>{{course.amount}}</span>
            </div>
            <div>
              <span>总讲次数</span>
              <span>{{course.lesson_counts}}</span>
            </div>
            <div>
              <span>时长范围</span>
              <span>{{course.period_time}}小时</span>
            </div>
            <div>
              <span>课程介绍</span>
              <span>{{course.desc || '无'}}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="info_title">讲次信息</p>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="course.lessons"
        size="mini"
        highlight-current-row max-height="390">
        <el-table-column align="left" label="讲次" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span>第 {{scope.row.index}} 讲</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="讲次名称" prop="lesson_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="上课时长" prop="time_span" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="主讲老师" prop="teacher_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="讲义" prop="" show-overflow-tooltip v-if="course.is_print === 1">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="print(scope.row)">
                打印
              </el-button>
              <PDFViewer v-if="scope.row.PDFurl" :ref="'pdfViewer' + scope.row.index" :url="scope.row.PDFurl"></PDFViewer>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
   <!-- <el-dialog :visible.sync="dialogConfig.visible" width="auto">
    </el-dialog>-->
  </div>
</template>
<script>
import receptionApi from '@/services/reception'
import wisroomApi from '@/services/wisroom'
import vendorApi from '@/services/vendor'
import { imageFormat } from '@/utils'
import PDFViewer from '@/components/pdf/PDFViewer'
export default {
  data () {
    return {
      loading: false,
      course: {
        info: {},
        lessons: []
      },
      defaultWare: '../../static/img/wisroom_default_courseware.jpg',
      imageFormat: '',
      optionConfig: {},
      PDFurl: '',
      pdfUrl: '',
      localPDFUrl: '',
      dialogConfig: {
        visible: false
      }
    }
  },
  filters: {
    imageFormat: imageFormat
  },
  components: {
    PDFViewer
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getOptions()
    },
    getOptions () {
      receptionApi.getOptionsByType({type: 4}).then(res => {
        this.optionConfig = res.data
        this.getCourseDetail()
      })
    },
    getCourseDetail () {
      let params = {
        course_id: this.$route.query.id,
        course_type: 4
      }
      this.loading = true
      wisroomApi.getCourseDetail(params).then(res => {
        this.loading = false
        if (res.ok) {
          this.course = res.data
          for (var i = 0; i < res.data.lessons.length; i++) {
            this.getHandoutUrl(res.data.lessons[i], i)
          }
          for (var m = 0; m < this.optionConfig.course_types.length; m++) {
            if (this.optionConfig.course_types[m].id === res.data.course_type) {
              this.course.course_type_name = this.optionConfig.course_types[m].name
            }
          }
          for (var l = 0; l < this.optionConfig.grade.length; l++) {
            if (this.optionConfig.grade[l].id === res.data.grade) {
              this.course.grade_name = this.optionConfig.grade[l].name
            }
          }
          for (var j = 0; j < this.optionConfig.class_type.length; j++) {
            if (this.optionConfig.class_type[j].id === res.data.class_type) {
              this.course.class_type_name = this.optionConfig.class_type[j].name
            }
          }
          for (var k = 0; k < this.optionConfig.subject.length; k++) {
            if (this.optionConfig.subject[k].id === res.data.subject) {
              this.course.subject_name = this.optionConfig.subject[k].name
            }
          }
        }
      })
    },
    getHandoutUrl (row, index) {
      let params = {
        course_type: 4,
        courseware_id: this.course.courseware_id,
        index: row.index
      }
      wisroomApi.getHandoutUrl(params).then(res => {
        if (res.ok) {
          if (res.data) {
            this.getHandoutPDF(res.data, index)
          }
        }
      })
    },
    getHandoutPDF (lectureUrl, index) {
      if (!lectureUrl) {
        return false
      }
      let params = {
        urls: [lectureUrl],
        timeout: 200,
        type: 'class'
      }
      this.loading = true
      vendorApi.fetchOSS(params).then(res => {
        if (res.ok) {
          this.loading = false
          this.course.lessons[index].PDFurl = res.data[0].access_token
         /* setTimeout(() => {
            this.loading = false
            this.$refs.pdfViewer.print()
          }, 3000) */
        }
      })
    },
    print (row) {
      if (row.PDFurl) {
        this.$refs['pdfViewer' + row.index].print()
      } else {
        this.$message({
          message: '本讲次暂无可打印讲义',
          type: 'warning',
          center: true
        })
      }
    }
  }
}
</script>
<style lang="less">
.courseDetail {
  text-align: left;
  .detailContent {
    .essentialInfo {
      width: 1200px;
      .right {
        width: 1000px;
        div {
          width: 250px;
        }
      }
    }
  }
  .PDFViewer {
    position: fixed;
    /*width: 0;
    height: 0;*/
    top: 50%;
    left: 50%;
    color: transparent;
    background: transparent;
    #printServiceOverlay {
      position: fixed;
      top: 50%;
      left: 50%;
    }
  }
}
</style>
