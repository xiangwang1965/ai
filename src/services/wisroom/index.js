import CRUD from '../CRUD'

class Wisroom extends CRUD {
  // 获取课件列表
  getCourseWareList (params) {
    return this.sendGet('/phoenix/wiseRoom/courseWareList', params).then(res => {
      return res
    })
  }
  getCourseWareLessons (params) {
    return this.sendGet('/phoenix/wiseRoom/courseWareDetail', params).then(res => {
      return res
    })
  }
  // 获取教室列表
  getClassroomList (params) {
    return this.sendGet('/phoenix/wiseRoom/classRoomList', params).then(res => {
      return res
    })
  }
  // 获取课程列表
  getCourseList (params) {
    return this.sendGet('/phoenix/courseList', params).then(res => {
      return res
    })
  }
  // 获取课程详情
  getCourseDetail (params) {
    return this.sendGet('/phoenix/courseDetail', params).then(res => {
      return res
    })
  }
  // 获取讲义地址
  getHandoutUrl (params) {
    return this.sendPost('/phoenix/printHandout', params).then(res => {
      return res
    })
  }
}

export default new Wisroom()
