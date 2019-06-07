<!--咨询本详情页面-->
<template>
  <div class="consult-detail-wrap">
    <div class="breadcrumb cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/enroll' }">咨询本</router-link>
        <el-breadcrumb-item>学员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="consult-detail-container">
      <div class="edit-consult-container">
        <!-- 咨询本基本信息数据 -->
        <div class="basic-info">
          <p>基本信息</p>
          <div class="basic-info-desc">
            <div class="avatar1">
              <img :src="detail.image" alt="" @error="error($event)">
            </div>
            <ul>
              <li>
                <div class="basic-info-item-first">学生姓名</div>
                <div class="basic-info-item-second">{{detail.student_name || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">性别</div>
                <div class="basic-info-item-second">{{detail.sex | sexFormat}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">微信昵称</div>
                <div class="basic-info-item-second">{{detail.name || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">身份状态</div>
                <div class="basic-info-item-second">{{detail.status | statusFormat}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">学生联系人电话</div>
                <div class="basic-info-item-second">{{detail.tel || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">紧急联系人电话</div>
                <div class="basic-info-item-second">{{detail.mobile || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">与紧急联系人关系</div>
                <div class="basic-info-item-second">{{detail.mobile_relation || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">紧急联系人姓名</div>
                <div class="basic-info-item-second">{{detail.mobile_name || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">民族</div>
                <div class="basic-info-item-second">{{detail.nationality || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">出生日期</div>
                <div class="basic-info-item-second">{{birthFormat(detail.brith_date || '无')}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">年级</div>
                <div class="basic-info-item-second">{{detail.grade_name || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">学校名称</div>
                <div class="basic-info-item-second">{{detail.school_name || '无'}}</div>
              </li>
              <li>
                <div class="basic-info-item-first">家庭住址</div>
                <div class="basic-info-item-second">{{addressFormat(detail.home_address) || '无' }}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 咨询本沟通详情数据 -->
        <div class="communication-info">
          <p>沟通详情</p>
          <div style="padding:0 60px 0 0;">
             <el-table
              :data="adviceListCom"
              height="400">
              <el-table-column
                prop="orderId"
                label="顺序"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="communication_date"
                label="沟通日期"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="type_name"
                label="咨询方式"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="lesson"
                label="意向课程"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="status_name"
                label="跟进状态"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="tag"
                label="标签备注"
                align="center"
                :resizable="false"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="communication_record"
                label="沟通记录"
                align="center"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="teacher_name"
                label="沟通人"
                show-overflow-tooltip
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>

         <!-- 咨询本活动详情数据 -->
        <div class="activity-info">
          <p>活动详情</p>
          <div style="padding:0 60px 0 0;">
             <el-table
              :data="activityListCom "
              show-overflow-tooltip
              height="400">
              <el-table-column
                prop="orderId"
                label="次序"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="activity_name"
                label="活动名称"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="subject_name"
                label="学科"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="grade_name"
                label="年级"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="type_name"
                label="类型"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="status_name"
                label="状态"
                align="center"
                :resizable="false"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/services/auth/utils'
import consultApi from '@/services/enroll/consult'

export default {
  data () {
    return {
      detail: '',
      adviceList: [],
      activityList: [],
      options: {
        class_type: [],
        grade: [],
        subject: []
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    activityListCom () {
      if (this.activityList) {
        return this.activityList.map((item, index) => {
          item.orderId = index + 1
          for (let key in item) {
            if (!item[key]) {
              item[key] = '无'
            }
          }
          return item
        })
      }
    },
    adviceListCom () {
      if (this.adviceList) {
        return this.adviceList.map((item, index) => {
          if (item.communication_date) {
            item.communication_date = item.communication_date.slice(0, 10)
          }
          item.lesson = ''
          if (item.communication_date) {
            item.communication_date = item.communication_date.slice(0, 10)
          }

          if (item.class_id) {
            this.options.class_type.forEach(itemSub => {
              if (itemSub.class_level_id === item.class_id) {
                item.class_name = itemSub.class_level_name
              }
            })
          }

          if (item.grade_id) {
            this.options.grade.forEach(itemSub => {
              if (itemSub.grade_id === item.grade_id) {
                item.grade_name = itemSub.grade_name
              }
            })
          }

          if (item.subject_id) {
            this.options.subject.forEach(itemSub => {
              if (itemSub.subject_id === item.subject_id) {
                item.subject_name = itemSub.subject_name
              }
            })
          }

          if (item.subject_name) {
            item.lesson += item.subject_name
          } if (item.grade_name) {
            item.lesson += '/' + item.grade_name
          } if (item.class_name) {
            item.lesson += '/' + item.class_name
          }
          item.orderId = index + 1
          for (let key in item) {
            if (!item[key]) {
              item[key] = '无'
            }
          }
          return item
        })
      }
    }
  },
  filters: {
    sexFormat (val) {
      if (val !== '无') {
        return val === 1 ? '男' : '女'
      } else {
        return val
      }
    },
    statusFormat (val) {
      switch (val) {
        case 1:
          return '机构学生'
        case 2:
          return '非机构学生'
        case 3:
          return '未知'
        default:
          return '未知'
      }
    },
    telFormat (val) {
      if (this.detail.tel_relation) {
        return val + '/' + this.detail.tel_relation
      } else {
        return val
      }
    }
  },
  methods: {
    // 初始化
    init () {
      // this.getData()
      this.getOptions()
    },
    // 判断数据类型
    getType (data) {
      return Object.prototype.toString.call(data).slice(8, -1)
    },
    // 获取详情页数据
    getData () {
      let params = {}
      params.student_id = this.$route.query.stId
      params.school_id = util.getUser().school_id

      consultApi.getConsultDetail(params).then(res => {
        if (res.status_code === 200) {
          let data = res.data
          for (let key in data) {
            if ((this.getType(data[key]) === 'Null') || data[key] === '') {
              data[key] = '无'
            }
          }
          this.detail = data
          this.adviceList = data.advice
          this.activityList = data.activity
        }
      })
    },
    // 格式化生日
    birthFormat (val) {
      if (val) {
        return val.slice(0, 10)
      }
    },
    // 家庭住址格式化
    addressFormat (val) {
      if (val) {
        let ary = val.split('/')
        let newAry = ary.map(item => {
          item = item.slice(1)
          return item
        })
        return newAry.join('/')
      }
    },
    // 获取年级，班级类型，学科的下拉框数据
    getOptions () {
      let params = {}
      let userInfo = util.getUser()

      if (userInfo.third_part) {
        params.type = 4
      } else {
        params.type = userInfo.is_self_live === 0 ? 1 : 2
      }
      consultApi.getOptions(params).then(res => {
        if (res.status_code === 200) {
          this.options.class_type = res.data.class_type
          this.options.grade = res.data.grade
          this.options.subject = res.data.subject
          this.getData()
        }
      })
    },
    // 图片加载错误处理
    error (e) {
      e.target.style.visibility = 'hidden'
    }
  }
}
</script>

<style lang="less">
.consult-detail-wrap {
  width: 100%;
  overflow: hidden;
  text-align: left;

  .edit-consult-container {
    width: 100%;

    p {
        font-size: 20px;
        font-weight: bold;
        height: 28px;
        line-height: 28px;
        margin-bottom: 30px;
      }
    .basic-info-desc {
      display: flex;

      .avatar1 {
        margin-right: 30px;
        margin-bottom: 30px;
        width: 100px;
        height: 99px;
        background-size: cover;
        background-image: url(../../../../static/img/default_avatar.png);

        img {
          width: 100px;
          height: 99px;
          display: inline-block;
          border-radius: 3px;
        }
      }
      ul {
        overflow: hidden;

        li {
          float: left;
          width: 240px;
          padding-right: 20px;
          margin-bottom: 20px;

          .basic-info-item-first {
            font-size: 12px;
            color: #7A808D;
            margin-bottom: 9px;
          }
          .basic-info-item-second {
            font-size: 13px;
            color: #3E434C;
            word-wrap: break-word;
          }
        }
      }
    }
    .communication-info {
      padding: 40px 0 30px 0;
    }
    .activity-info {
      padding-top: 60px;
    }
  }
  .consultForm-bottom {
    margin-top: 20px;
  }
  .consult-detail-container {
    padding-top: 30px;
  }
}
</style>
