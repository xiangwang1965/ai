import CRUD from '../CRUD'

class Student extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/students/add-list'
    this.createUrl = '/students/add'
    this.updateUrl = '/students/modify'
    this.queryDetailUrl = '/students'
    this.classUrl = 'class/studentCLassList'
    this.studentInsertUrl = '/class/studentInsert'
  }
  queryStudenEdit () {
    return this.sendGet(this.queryStudenEditUrl)
  }
  // 获取某学生的详细信息
  queryDetail (params) {
    return this.sendGet(this.queryDetailUrl, params)
  }
  // 获取某学生的班级信息
  queryClass (params) {
    return this.sendGet(this.classUrl, params)
  }
  // 学生插班
  studentInsert (params) {
    return this.sendPost(this.studentInsertUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取学生列表（全部或未分班）
  getStudentList (params) {
    return this.sendGet('/phoenix/eduadmin/scene/wait-class-student-list', params)
  }
  getAddStudentList (params) {
    let obj = {}
    for (var p in params) {
      if (p !== 'status') {
        obj[p] = params[p]
      }
    }
    if (params.status * 1 === 2) {
      obj.status = 2
    }
    return this.sendGet('/phoenix/eduadmin/scene/class-student-list', obj)
  }
}

export default new Student()
