<!--课件下载列表页-->
<template>
  <div class="courseware-download-wrap">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="cac-bread">{{breadcrumbTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
      <h3 class="basic-info">基本信息</h3>
      <div class="query-room">
         <p class="room-title">
          <span class="room-title-icon" style="color:#FF6968;">*</span>
          <span>教室</span>
        </p>
        <div class="select-room">
          <el-select
            class="selectRow__select"
            v-model="queryParam.roomId"
            @change="handleSelectRoom"
            placeholder="请先选择教室"
            size="middle">
            <el-option v-for="item in classroomList" :key="item.roomId" :label="item.roomName" :value="item.roomId">
            </el-option>
          </el-select>
          <!-- <el-checkbox v-model="queryParam.sevenDayChecked" style="margin-left:30px;">显示未来7天的课表</el-checkbox> -->
          <el-button @click="handleShowCourserDialog" type="primary" class="" size="small" round plain icon="el-icon-date" style="margin-left:20px;width:165px;">
            显示未来7天的课表
          </el-button>
        </div>
        <div class="host-status">
          <p>主机状态</p>
          <button :class="hostDesc.class"><i :class="hostDesc.icon" style="padding-right:6px;"></i>{{hostDesc.desc}}</button>
          <el-tooltip v-if="hostDesc.helpDesc" :content="hostDesc.helpDesc" placement="right" effect="dark">
            <i class="el-icon-question" style="margin-left:7px;"></i>
          </el-tooltip>
          <div class="host-tip">主机状态更新可能有延迟</div>
        </div>
      </div>
    </div>
    <h3 class="download-title">下载列表</h3>
    <div class="select-courseware">
      <el-input v-model.trim="name" :maxlength="20" @keyup.enter.native="getCoursewareData(1, true, true)" class="query-course-name" icon="el-icon-search" placeholder="请输入课程名称">
          <i @click="getCoursewareData(1, true, true)" slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- <el-select
        class="selectRow__select"
        v-model="queryParam.courseId"
        placeholder="请选择课件状态"
        size="middle"
        clearable>
        <el-option v-for="item in downloadStatusList" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select> -->
      <!-- <el-button type="primary" class="cac-button-one query query-button" size="small" icon="el-icon-search" round @click="getCoursewareData(1)">
        搜索
      </el-button> -->
    </div>
    <div class="courseware-list-Table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="coursewareListCom"
        style="width: 100%;font-size: 12px">
        <el-table-column :resizable="false" align="center" prop="name" label="课程名称" width="130">
        </el-table-column>
        <el-table-column :resizable="false" align="center" width="80" prop="index" label="讲次" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>第{{scope.row.lessonNum}}讲</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="lesson_name" label="讲次名称">
        </el-table-column>
        <el-table-column :resizable="false" align="center" prop="teacher" label="主讲老师" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="课件大小" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.size">{{scope.row.size}}GB</div>
            <div v-else>未知</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" width="80" label="课件版本" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="(scope.row.status == 5) || (scope.row.status == 6)">{{scope.row.releaseVersion}}</div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="课件状态">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status!=3">{{scope.row.statusName}}<i v-if="scope.row.status==5" class="el-icon-warning host-full" style="margin-left:5px;"></i></span>
              <el-progress v-if="scope.row.status==3" :percentage="scope.row.coursewareDLRate"></el-progress>
              <el-tooltip v-if="scope.row.status==0" content="课件未发布, 请等待!" placement="top" effect="dark">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column :resizable="false" align="center" label="操作" class="userTable__edit" width="120">
          <template slot-scope="scope">
            <el-button class="clearfix cac-button-two create-button" round size="mini" @click="goDownload(scope.row)" :disabled="scope.row.status ==0">
              <span v-if="(scope.row.status ==1) || (scope.row.status ==5) || (scope.row.status ==0)">下载</span>
              <span v-if="(scope.row.status ==4) || (scope.row.status ==6)">重新下载</span>
              <span v-if="(scope.row.status ==2) || (scope.row.status ==3)">取消下载</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :config="pageConfig" @change="getCoursewareData"></pagination>
    </div>
    <el-dialog class="timeTableDialog" width="1050px" append-to-body @open="timeTableDialogOpen" @close="timeTableDialogClose" :visible.sync="timeTableConfig.visible" style="height:100%;">
      <showSevenDayDialog ref="timeTable" role="class" :campus_id="campus_id" :brandId="4" ></showSevenDayDialog>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import downloadApi from '@/services/wisroom/download'
import showSevenDayDialog from '@/components/timetable'
// import util from '@/services/auth/utils'
import { API_URL } from '../../../config.js'

export default {
  data () {
    return {
      breadcrumbTitle: '课件下载',
      loading: false,
      hostStatusDesc: '',
      timer: '',
      uploadBaseUrl: `${API_URL}/phoenix/wiseRoom/downloadOperate`,
      timeTableRole: '',
      campus_id: '',
      className: '',
      courseId: this.$route.query.id,
      timeTableConfig: {
        visible: false
      },
      name: '',
      queryParam: {
        roomId: '',
        name: ''
      },
      pageConfig: {
        total: 0,
        page: 1,
        per_page: 8
      },
      classroomList: [],
      downloadStatusList: [
        {
          id: 1,
          name: '已下载'
        },
        {
          id: 2,
          name: '未下载'
        },
        {
          id: 3,
          name: '下载中'
        },
        {
          id: 4,
          name: '可更新'
        },
        {
          id: 5,
          name: '等待中'
        },
        {
          id: 6,
          name: '下载失败'
        },
        {
          id: 7,
          name: '未发布'
        }
      ],
      coursewareList: []
    }
  },
  computed: {
    // courseId () {
    //   return this.$route.query.id
    // },
    hostDesc () {
      switch (this.hostStatusDesc) {
        case '正常':
          return { desc: '正常', class: ['host-normal', 'host-status-desc'], icon: 'el-icon-circle-check' }
        case '磁盘满':
          return { desc: '磁盘已满', class: ['host-full', 'host-status-desc'], icon: 'el-icon-warning', helpDesc: '存储空间已满, 请联系工作人员进行专业磁盘清理!' }
        case '失去连接':
          return { desc: '失去连接', class: ['host-fail', 'host-status-desc'], icon: 'el-icon-error', helpDesc: '请确保主机处于开机状态且网络畅通, 如仍未解决请联系工作人员!' }
        case '未知':
          return { desc: '未知', class: ['host-default', 'host-status-desc'], icon: 'el-icon-info', helpDesc: '您的下载服务版本过低，不支持您手动下载课件，可联系运维升级。下载服务的自动下载功能不受此影响!' }
        default:
          return { desc: '未获取', class: ['host-default', 'host-status-desc'], icon: 'el-icon-info' }
      }
    },
    coursewareListCom () {
      return this.coursewareList.map((item, index) => {
        if (item.coursewareDLRate) {
          let ary = item.coursewareDLRate.split('/')
          item.coursewareDLRate = parseInt(Number(ary[0]) * 100 / Number(ary[1]))
        } else {
          item.coursewareDLRate = 0
        }
        item.id = index
        switch (Number(item.status)) {
          case 0:
            item.statusName = '无课件'
            break
          case 1:
            item.statusName = '未下载'
            break
          case 2:
            item.statusName = '等待中'
            break
          case 3:
            item.statusName = '下载中'
            break
          case 4:
            item.statusName = '下载失败'
            break
          case 5:
            item.statusName = '可更新'
            break
          case 6:
            item.statusName = '已下载'
            break
          default:
            item.statusName = '未下载'
        }
        return item
      })
    }
  },
  components: {
    pagination,
    showSevenDayDialog
  },
  created () {
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  methods: {
    // 初始化
    init () {
      this.getClassRoomData()
      if (this.courseId) {
        this.getCoursewareData()
      }
    },
    // 获取教室列表数据
    getClassRoomData () {
      downloadApi.queryRoomList().then(res => {
        if (res.status_code === 200) {
          this.classroomList = res.data.classroomList.map(item => {
            item.is_have_lesson = false
            return item
          })
        } else {
          if (res.status_code === 400) {
            this.$message.error(res.message)
            return false
          }
          this.$message({
            message: '获取教室数据失败, 请稍后重试!',
            type: 'error'
          })
        }
      })
    },
    // 获取教室主机状态数据
    getHostStatusData (roomId) {
      downloadApi.queryHostStatus({roomId}).then(res => {
        if (res.status_code === 200) {
          let hostStatus = res.data.roomMachineStatus.connection.statusDesc
          let diskStatus = res.data.roomMachineStatus.disk.statusDesc

          // 若主机状态正常，但是磁盘状态为已满则显示磁盘状态
          if (hostStatus !== '失去连接' && diskStatus === '磁盘满') {
            this.hostStatusDesc = diskStatus
          } else {
            this.hostStatusDesc = hostStatus
          }
        } else {
          if (res.status_code === 400) {
            this.$message.error(res.message)
            return false
          }
          this.$message({
            message: '获取主机状态失败, 请稍后重试!',
            type: 'error'
          })
        }
      })
    },
    // 获取课件列表数据
    getCoursewareData (page, loadFlag = true, queryFlag = false) {
      this.loading = loadFlag
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

      // 如果点击了搜索则加上搜索的条件
      if (queryFlag) {
        this.queryParam.name = this.name
      }

      // 判断是否是从详情页跳转过来的条件
      let goFlag = ((this.courseId) && (!this.queryParam.roomId))
      let params = Object.assign({ org_class_id: this.courseId }, this.queryParam)
      params.page = this.pageConfig.page
      params.per_page = this.pageConfig.per_page
      downloadApi.queryCourseList(params).then(res => {
        if (res.status_code === 200) {
          // 首次判断该教室未来 12 小时是否有课
          if (res.data.is_have_lesson) {
            this.classroomList = this.classroomList.map(item => {
              if ((item.roomId === res.data.roomId) && (res.data.is_have_lesson) && (!item.is_have_lesson)) {
                this.showHaveLesson()
                item.is_have_lesson = true
              }
              return item
            })
          }
          if (goFlag) {
            let roomId = res.data.roomId
            this.queryParam.roomId = roomId
            this.getHostStatusData(roomId)
            this.refreshCoursewareList()
          }
          this.coursewareList = res.data.list
          this.pageConfig.total = res.data.count
          setTimeout(() => {
            this.loading = false
          }, 300)
        } else {
          this.loading = false
          if (res.status_code === 400) {
            this.$message.error(res.message)
            return false
          }
          this.$message({
            message: '获取数据失败, 请稍后重试!',
            type: 'error'
          })
        }
      })
    },
    // 选择教室时请求该教室下的课件列表
    handleSelectRoom (roomId) {
      this.queryParam.roomId = roomId
      this.courseId = ''

      // 判断该教室未来 12 小时是否有课
      this.classroomList.forEach(item => {
        if ((item.roomId === roomId)) {
          this.className = item.roomName
          if ((item.is_have_lesson)) {
            this.showHaveLesson()
          }
        }
      })
      this.queryParam.name = ''
      this.getHostStatusData(roomId)
      this.getCoursewareData()
      this.refreshCoursewareList()
    },
    // 下载
    goDownload (val) {
      if (this.hostStatusDesc === '失去连接') {
        this.showDownloadTip('主机失去连接，请注意！')
        // return false
      }
      if (this.hostStatusDesc === '未知') {
        this.showDownloadTip('您的下载服务版本过低，不支持您手动下载课件，可联系运维升级。下载服务的自动下载功能不受此影响!')
        return false
      }
      if (this.hostStatusDesc === '磁盘满') {
        this.showDownloadTip('主机磁盘空间不足，请注意！')
      }
      let status = Number(val.status)

      // ‘等待中’ 和 ‘下载中’ 状态可进行 取消下载操作
      if ((status === 2) || (status === 3)) {
        if (status === 3) {
          this.$confirm('您已下载的文件将会保留，重新下载时将继续原任务', '', {
            confirmButtonText: '确定',
            confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
            cancelButtonText: '取消',
            cancelButtonClass: 'cac-button-two dialog_cancel_button is-round',
            center: true
          }).then(() => {
            this.goDownloadHandle(val, 'CANCEL')
          })
        } else {
          this.goDownloadHandle(val, 'CANCEL')
        }
      }
      // ’未下载‘ 和 ’可更新‘ 状态可进行 下载操作
      if ((status === 1) || (status === 5)) {
        this.goDownloadHandle(val, 'DOWNLOAD')
      }
      // ’未下载‘ 和 ’可更新‘ 状态可进行 下载操作
      if ((status === 4) || (status === 6)) {
        this.goDownloadHandle(val, 'REPEAT_DOWNLOAD')
      }
    },
    // 点击下载等操作后重新获取该条数据的课件状态
    // querySingleStatus (val) {
    //   let params = { roomId: this.queryParam.roomId, coursewareGroupId: val.coursewareGroupId, lessonNum: val.lessonNum }

    //   downloadApi.querySingleCourseStatus(params).then(res => {
    //     if (res.status_code === 200) {
    //       this.coursewareListCom = this.coursewareListCom.map(item => {
    //         if (item.id === val.id) {
    //           item.status = res.data.status
    //         }
    //         return item
    //       })
    //     }
    //   })
    // },
    // 点击下载等操作的数据请求
    goDownloadHandle (val, type) {
      let params = { roomId: this.queryParam.roomId, coursewareGroupId: val.coursewareGroupId, lessonNum: val.lessonNum }

      downloadApi.goDownloadOptions(Object.assign(params, { operateType: type })).then(res => {
        if (res.status_code === 200) {
          // this.querySingleStatus(val)
          this.getCoursewareData(false, false)
        } else {
          this.$message.error('操作失败，请稍后重试!')
        }
      })
    },
    // 分页
    goPage (page) {
      this.getCoursewareData(page)
    },
    // 定时刷新列表数据
    refreshCoursewareList () {
      if (this.timer) {
        return false
      } else {
        this.timer = setInterval(() => {
          this.getCoursewareData(false, false)
          this.getHostStatusData(this.queryParam.roomId)
        }, 300000)
      }
    },
    // 弹出提示有课
    showHaveLesson () {
      this.$confirm('该教室未来12小时有上课安排，请合理安排下载任务，避免影响上课体验！', '', {
        confirmButtonText: '确定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        showCancelButton: false,
        center: true
      })
    },
    // 点击下载操作时根据不同的状态进行弹出提示
    showDownloadTip (str) {
      this.$confirm(str, '', {
        confirmButtonText: '确定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        showCancelButton: false,
        center: true
      })
    },
    handleShowCourserDialog () {
      this.timeTableConfig.visible = true
    },
    timeTableDialogOpen () {
      this.$nextTick(() => {
        this.$refs.timeTable.initWeekDate()
      })
    },
    timeTableDialogClose () {
      this.timeTableRole = ''
      this.$refs.timeTable.clearTimeData()
    }
  }
}
</script>

<style lang="less">
.courseware-download-wrap {
  .select-room {
    display: flex;
    align-items: center;
  }
  .search__name {
    width: 204px;
    float: right;
    border-radius: 16px;
  }
  .basic-info {
    font-size: 20px;
    color: #3E434C;
    padding-bottom: 30px;
  }
  .query-room {
    .room-title {
      color: #7A808D;
      padding-bottom: 12px;
      font-size: 13px;

      .room-title-icon {
        color: #FF6968;
      }
    }
    .el-button--primary.is-plain {
      border-color: #EEEEEE;
      color: #3C75F6;
      background: #fff;
    }
  }
  .host-status {
    > p {
      color:#7A808D;
      font-size: 13px;
      padding: 27px 0 15px 0;
    }
    .host-status-desc {
      padding: 8px;
      font-size: 13px;
      height: 32px;
      border-radius: 16px;
      border: none;
    }
    .host-tip {
      padding-top: 10px;
      font-size: 13px;
      color: #E6A23C;
    }
  }
  .host-normal {
    color: #58E89A;
    background:rgba(88, 232, 154, 0.1);
  }
  .host-default {
    color: rgb(188, 190, 194);
    background-color: rgb(244, 244, 245);
  }
  .host-full {
    color: #FF9D00;
    background:rgba(255, 157, 0, .1);
  }
  .host-fail {
    color: #FF6968;
    background:rgba(255, 105, 104, .1);
  }
  .select-courseware {
    margin-top: 30px;
    display: flex;

    .query-course-name {
      width: 204px;
    }
    .query-button {
      margin-left: 30px;
    }
    .el-input__icon {
      line-height: 32px;
      text-align: left;
    }
  }
  .courseware-list-Table {
    margin-top: 20px;
  }
  .cac-bread-bar {
    .el-input {
      > input {
        width: 340px;
        height: 50px;
        line-height: 50px;
        border-radius: 2px;
      }
      .el-input__icon {
        line-height: 50px;
      }
    }
  }
  .select-courseware {
    .el-input {
       > input {
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
       }
       .el-select__caret {
         line-height: 32px;
       }
    }
  }
  .el-table__row .cell {
    color: #3E434C;
  }
  .el-progress-bar {
    width: 60px;
    padding-right: 0;
    margin-right: 0;
  }
  .el-progress-bar__outer {
    width: 60px;
  }
  .el-progress__text {
    display: block;
    font-size: 12px !important;
    color: #3C75F6;
    padding-top: 10px;
  }
  .download-title {
    font-size: 20px;
    padding: 60px 0 0 0;
    text-align: left;
  }
}
</style>

