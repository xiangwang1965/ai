<template>
  <div class="wisroom" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">我的AI课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="selectGroupWrap" v-loading="selectLoading">
      <selectitem v-for="(item,index) in ['course_types', 'subject', 'grade', 'class_type']" :key="index" :selectItem="selectItem[item]" v-on:params="getCourseList" :params="params"></selectitem>
    </div>
    <div class="wisroomCourse" v-loading="courseLoading">
      <div v-if="courseWareList.length > 0">
        <courseWare v-for="(courseWare, index) in courseWareList" :item="courseWare" :detailPath="wisroomDetail" :key="index" :size="courseWareSize" :page="pageConfig.page"></courseWare>
      </div>
      <div v-else class="emptyImage">
        <img :src="'../../static/img/empty_image.png'" alt="">
        <span>暂无数据</span>
      </div>
    </div>
    <pagination :config="pageConfig" @change="getCourseList"></pagination>
  </div>
</template>
<script>
  import selectitem from '@/components/live/selectitem'
  import courseWare from '@/views/wisroom/courseware/courseware'
  import wisroomApi from '@/services/wisroom'
  import receptionApi from '@/services/reception'
  import pagination from '@/components/pagination'
  export default {
    data () {
      return {
        loading: false,
        courseLoading: false,
        courseWareSize: {
          imageSize: '164x164',
          contentSize: '500x220'
        },
        wisroomDetail: 'wisroomCourseWareDetail',
        courseWareList: [],
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        selectLoading: false,
        selectItem: [],
        params: {
          course_type: '',
          subject_id: '',
          grade_id: '',
          term_id: '',
          level: '',
          status: ''
        }
      }
    },
    components: {
      courseWare,
      pagination,
      selectitem
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.getSelectItem()
      },
      getSelectItem () {
        this.selectLoading = true
        receptionApi.getOptionsByType({type: 4}).then(res => {
          this.selectLoading = false
          console.log(res)
          for (var p in res.data) {
            var obj = {
              title: '',
              option: [{ key: '', value: '全部' }],
              name: p
            }
            res.data[p].map((v, i) => {
              obj.option.push({
                key: v.id,
                value: v.name
              })
            })
            switch (p) {
              case 'course_types':
                obj.title = '课程类型'
                obj.name = 'status'
                break
              case 'subject':
                obj.title = '学科'
                break
              case 'grade':
                obj.title = '年级'
                break
              case 'class_type':
                obj.title = '班型'
                obj.name = 'level'
                break
              case 'term':
                obj.title = '学期'
                break
            }
            this.selectItem[p] = obj
          }
          this.getCourseList()
        })
      },
      getCourseList (item) {
        this.courseLoading = true
        let params = {
          page: (item && typeof item === 'number') ? item : this.pageConfig.page,
          per_page: this.pageConfig.per_page,
          brand: 4
        }
        if (typeof item !== 'number') {
          this.pageConfig.page = 1
          params.page = 1
        }
        for (var n in this.params) {
          if (this.params[n]) {
            switch (n) {
              case 'status':
                params.course_type_id = this.params.status
                break
              case 'level':
                params.class_type_id = this.params.level
                break
              default:
                params[n] = this.params[n]
            }
          }
        }
        wisroomApi.getCourseList(params).then(res => {
          this.courseLoading = false
          if (res.ok) {
            this.courseWareList = res.data.list
            this.courseWareList.map((v, i) => {
              for (var m = 0; m < this.selectItem.course_types.option.length; m++) {
                if (this.selectItem.course_types.option[m].key === v.course_type) {
                  v.course_type_name = this.selectItem.course_types.option[m].value
                }
              }
              for (var l = 0; l < this.selectItem.grade.option.length; l++) {
                if (this.selectItem.grade.option[l].key === v.grade) {
                  v.grade_name = this.selectItem.grade.option[l].value
                }
              }
              for (var j = 0; j < this.selectItem.class_type.option.length; j++) {
                if (this.selectItem.class_type.option[j].key === v.class_type) {
                  v.class_type_name = this.selectItem.class_type.option[j].value
                }
              }
              for (var k = 0; k < this.selectItem.subject.option.length; k++) {
                if (this.selectItem.subject.option[k].key === v.subject) {
                  v.subject_name = this.selectItem.subject.option[k].value
                }
              }
            })
            this.pageConfig.total = res.data.total_count
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .wisroom {
    text-align: left;
    .wisroomCourse {
      position: relative;
      width: 1160px;
      min-height: 350px;
      margin-top: 58px;
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
  }
</style>
