import CRUD from '@/services/CRUD'
class Reception extends CRUD {
  // 获取前台业务学生列表
  getStudentList (params) {
    return this.sendGet('/students/list', params)
  }
  // 报名
  entryClass (params) {
    let serverParams = {}
    for (var prop in params) {
      if (params[prop]) {
        serverParams[prop] = params[prop]
      }
    }
    return this.sendPost('/phoenix/reception/enroll', serverParams).then(res => {
      if (res.message && res.message.indexOf('密码发送失败') !== -1) {
        return {
          status_code: 200,
          key: '密码发送失败',
          message: '账号密码发送失败，可使用验证码登录'
        }
      }
      this.handleError(res)
      return res
    })
  }
  // 获取报名信息
  getEntryList (params) {
    return this.sendPost('/phoenix/reception/enrollInfo', params).then(res => {
      return res
    })
  }
  // 报名缴费明细
  getPayDetail (params) {
    return this.sendGet('/phoenix/reception/enrollPayDetail', params)
  }
  // 获取学生信息
  getStudentDetail (params) {
    return this.sendGet('/students', params)
  }
  // 学生编辑
  editStudent (params) {
    return this.sendPost('/students/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 转出班列表
  getClassList (params) {
    return this.sendGet('/phoenix/class/studentClassList', params)
  }
  // 转出班级费用详情
  getClassAmount (params) {
    return this.sendGet('/phoenix/class/fee', params)
  }
  // 转入班列表
  getInClassList (params) {
    return this.sendGet('/phoenix/class/schoolClassList', params)
  }
  // 需补费/退费列表
  addQuitFeeList (params) {
    return this.sendGet('/phoenix/class/enrollInfoArrears', params)
  }
  // 补费
  addFee (params) {
    return this.sendPost('/phoenix/class/appendPay', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 退班
  quitClass (params) {
    return this.sendPost('/phoenix/class/deleteStudent', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 退费
  refund (params) {
    return this.sendPost('/phoenix/class/refund', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 转班
  transferClass (params) {
    return this.sendPost('/phoenix/class/transferStudent', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 学生插入班级
  addStudent (params) {
    return this.sendPost('/phoenix/class/addStudents', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  insertStudent (params) {
    return this.sendPost('/phoenix/class/insertStudent', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 查看教师课表
  teacherTimeTable (params) {
    return this.sendGet('/phoenix/eduadmin/scene/teacherSchedules', params).then(res => {
      return res
    })
  }
  // 查看教室课表
  classTimeTable (params) {
    return this.sendPost('/phoenix/eduadmin/class/schedules', params).then(res => {
      return res
    })
  }
  // 获取所有班级列表
  getAllClassList (params) {
    return this.sendGet('/phoenix/class/schoolClassList', params).then(res => {
      return res
    })
  }
  // 获取所有课程列表
  getAllCourseList (params) {
    return this.sendGet('/phoenix/class/schoolCourseList', params).then(res => {
      return res
    })
  }
  // 获取课程讲次列表
  getLessonList (params) {
    return this.sendGet('/phoenix/eduadmin/lesson/list', params).then(res => {
      res.data.map((v, index) => {
        v.index = index + 1
      })
      return res
    })
  }
  // 获取options项
  getOptionsList (params) {
    return this.sendGet('/phoenix/reception/options', params)
  }
  // 根据type获取对应机构类型options项
  getOptionsByType (params) {
    return this.sendGet('/phoenix/options', params)
  }
}
export default new Reception()
