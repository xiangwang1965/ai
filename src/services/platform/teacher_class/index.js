import CRUD from '../../CRUD'

class Basic extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/liveOrgClass/myLives'
  }
  // 班级列表
  ClassList (params) {
    return this.sendGet('/livingClass/list', params)
  }
  // 删除班级
  deleteClass (params) {
    return this.sendPost('/livingClass/deleteClass', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 创建班级筛选项
  createClassOption (params) {
    return this.sendGet('/content/course/filter', params)
  }
  // 获取时段
  getPeriod (params) {
    return this.sendGet('/livingClass/coursePeriod', params)
  }
  // 关联原班级列表
  getRelationBaseClass (params) {
    return this.sendGet('/livingClass/relationBaseClass', params)
  }
  // 输选主讲老师
  searchTeacher (params) {
    return this.sendGet('/live_teacher/search', params)
  }
  // 输选直播间
  searchLiveRoom (params) {
    return this.sendGet('/liveRoom/detail2', params)
  }
  // 创建班级获取期数
  getNum (params) {
    return this.sendGet('/livingClass/getClassNumber', params)
  }
  // 创建班级获取讲次列表
  queryCourseList (params) {
    return this.sendGet('/livingClass/createClass', params)
  }
  // 创建班级
  createClass (params) {
    return this.sendPost('/livingClass/createClass', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 班级详情
  classDetail (params) {
    return this.sendGet('/livingClass/detail', params)
  }
  // 查询老师列表
  queryLiveTeacher (params) {
    return this.sendGet('/live_teacher/list', params)
  }
  // 修改双师老师状态
  activeLiveTeacher (params) {
    return this.sendPost('/live_teacher/modify_active', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 双师老师详情
  LiveTeacherDetail (params) {
    return this.sendGet('/live_teacher', params)
  }
  // 创建双师
  addTeacher (params) {
    return this.sendPost('/live_teacher/add', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 直播间、教室列表
  liveRoomList (params) {
    return this.sendGet('/liveRoom/list', params)
  }
  // 直播间、教室禁用启用
  activeLiveRoom (params) {
    return this.sendPost('/liveRoom/activeRoom', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 输选机构名称
  searchSchoolList (params) {
    return this.sendGet('/school/search', params)
  }
  // 直播间，教室创建
  createLiveRoom (params) {
    return this.sendPost('/liveRoom/createRoom', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 直播间详情
  LiveRoomDetail (params) {
    return this.sendGet('/liveRoom/detail', params)
  }

  // 校区列表
  schoolList (params) {
    return this.sendGet('/school/list', params)
  }

  // 创建学生班，获取双师课程名称
  queryMyLive (params) {
    return this.sendGet('/livingClass/search', params)
  }

  // 编辑主讲
  editTeacher (params) {
    return this.sendPost('/live_teacher/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }

  // 学生班级管理，创建班级，获取双师课程名称
  getDoubleCourse (params) {
    return this.sendGet('/mall/commodity/my_live_class', params)
  }
}

export default new Basic()
