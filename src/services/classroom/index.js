import CRUD from '../CRUD'

class Classroom extends CRUD {
  constructor () {
    super()
    this.createUrl = '/class/class'
    this.updateUrl = 'class/modify'
    this.queryUrl = '/class/list'
    this.disabledUrl = '/class/classDelete'
    this.queryCourseByTypeUrl = '/class/baseClassLessons'
    this.queryClassOptionUrl = '/class/options'
    this.queryClassDetailUrl = '/class/detail'
    this.queryBaseClassesUrl = '/class/baseClasses'
    this.querySubjectUrl = '/class/subjects'
    this.queryGradesUrl = '/class/grades'
    this.queryTermsUrl = '/class/terms'
    this.queryLevelsUrl = '/class/levels'
    this.queryTeacherUrl = '/teacher/searchTeacher'
    this.queryAllTeacherUrl = '/class/teacher'
    this.updateStudentUrl = '/class/addStudentsToClass'
    this.queryClassNameUrl = '/class/searchClass'
    this.studentTransformUrl = '/class/studentTransform'
    this.studentDeleteUrl = '/class/studentDelete'
    this.classStudentUrl = '/students/search_class'
    this.queryMyLiveUrl = '/mall/commodity/my_live_class'
    this.queryAssistantUrl = '/class/assistant'
    this.queryLiveRoomUrl = '/liveOrgClass/getLiveRoom'
    this.queryLiveDetailUrl = '/mall/commodity/detail'
    this.createLiveClassUrl = '/liveOrgClass/createClass'
    this.queryLiveClassOptionUrl = '/liveOrgClass/options'
    this.modifyLiveClassUrl = '/liveOrgClass/modifyClass'
  }

  // 根据班级类型查询课程列表
  queryCourseByType (params) {
    return this.sendGet(this.queryCourseByTypeUrl, params)
  }
  // api 班级列表options下拉窗
  queryClassOption (params) {
    return this.sendGet(this.queryClassOptionUrl, params)
  }
  queryLiveClassOption (params) {
    return this.sendGet(this.queryLiveClassOptionUrl, params)
  }
  // 详情&编辑
  queryClassDetail (params) {
    return this.sendGet(this.queryClassDetailUrl, params)
  }
  // 获取学科
  querySubject () {
    return this.sendGet(this.querySubjectUrl)
  }
  // 获取班级年级
  queryGrade (params) {
    return this.sendGet(this.queryGradesUrl, params)
  }
  // 获取学期
  queryTerm (params) {
    return this.sendGet(this.queryTermsUrl, params)
  }
  // 获取班级类型
  queryLevel (params) {
    return this.sendGet(this.queryLevelsUrl, params)
  }
  // 获取班型id
  queryBaseClass (params) {
    return this.sendGet(this.queryBaseClassesUrl, params)
  }
  // 获取教师id
  queryTeacher (params) {
    return this.sendGet(this.queryTeacherUrl, params)
  }
  // 没有参数获取所有教师
  queryAllTeacher (params) {
    return this.sendGet(this.queryAllTeacherUrl, params)
  }
  // 给班级批量添加学生
  updateStudent (params) {
    return this.sendPost(this.updateStudentUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 根据班级姓名模糊查询班级
  queryClassName (params) {
    return this.sendGet(this.queryClassNameUrl, params)
  }
  // 学生转班
  studentTransform (params) {
    return this.sendPost(this.studentTransformUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 学生退费
  studentDelete (params) {
    return this.sendPost(this.studentDeleteUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 根据在班学生获取学生列表支持查询
  classStudent (params) {
    return this.sendGet(this.classStudentUrl, params)
  }
  // 查询双师课程
  queryMyLive (params) {
    return this.sendGet(this.queryMyLiveUrl, params)
  }
  // 查询助教老师
  queryAssistant () {
    return this.sendGet(this.queryAssistantUrl)
  }
  // 查询教室
  queryLiveRoom (params) {
    return this.sendGet(this.queryLiveRoomUrl, params)
  }
  queryLiveDetail (params) {
    return this.sendGet(this.queryLiveDetailUrl, params)
  }
  // 创建双师班级
  createLiveClass (params) {
    return this.sendPost(this.createLiveClassUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 修改双师班级
  modifyLiveClass (params) {
    return this.sendPost(this.modifyLiveClassUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授教师列表
  getFaceTeacherList (params) {
    return this.sendGet('/phoenix/eduadmin/scene/listSceneTeacher', params)
  }
  // 创建班级
  createClass (params) {
    return this.sendPost('/phoenix/eduadmin/class/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取讲次列表
  getLessonList (params) {
    return this.sendGet('/phoenix/eduadmin/lesson/list', params)
  }
  // 获取面授班级列表
  faceClassList (params) {
    return this.sendGet('/phoenix/class/list', params)
  }
  // 修改面授班级
  editFaceClass (params) {
    return this.sendPost('/phoenix/eduadmin/class/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授班级详情
  faceClassDetail (params) {
    return this.sendGet('/phoenix/class/detail', params)
  }
  // 删除面授班级
  deleteFaceClass (params) {
    return this.sendPost('/phoenix/eduadmin/class/delete', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取讲次时间段列表
  getLessonTimes (params) {
    return this.sendGet('/phoenix/eduadmin/scene/lesson-times', params)
  }

  // 获取课件讲次状态
  getCoursewareStatus (params) {
    return this.sendGet('/phoenix/eduadmin/lesson/status', params).then(res => {
      return res
    })
  }
}

export default new Classroom()
