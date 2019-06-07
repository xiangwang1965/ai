import CRUD from '../../CRUD'

class WisroomDownload extends CRUD {
  constructor () {
    super()
    this.getRoomListUrl = '/phoenix/wiseRoom/getBindClassrooms'
    this.getHostStatusUrl = '/phoenix/wiseRoom/getRoomMachineStatus'
    this.getCourseListUrl = '/phoenix/class/schoolWisroomLiveOrglessons'
    this.getSingleCourseStatusUrl = '/phoenix/wiseRoom/getOneCourseWisroomLessonsUploadStatus'
    this.downloadOptionsUrl = '/phoenix/wiseRoom/downloadOperate'
  }

  // 获取教室列表数据
  queryRoomList (params) {
    return this.sendGet(this.getRoomListUrl, params)
  }
  // 获取主机状态数据
  queryHostStatus (params) {
    return this.sendGet(this.getHostStatusUrl, params)
  }
  // 获取课件列表数据
  queryCourseList (params) {
    return this.sendGet(this.getCourseListUrl, params)
  }
  // 获取单个讲次的下载信息
  querySingleCourseStatus (params) {
    return this.sendGet(this.getSingleCourseStatusUrl, params)
  }
  // 下载相关操作
  goDownloadOptions (params) {
    return this.sendGet(this.downloadOptionsUrl, params)
  }
}

export default new WisroomDownload()
