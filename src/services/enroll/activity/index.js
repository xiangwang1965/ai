import CRUD from '../../CRUD'

class Consult extends CRUD {
  constructor () {
    super()
    this.queryActivityUrl = '/operations/school/activity_list'
    this.queryAttendanceListUrl = '/operations/school/activity_students'
    this.queryAttendanceStudentUrl = '/operations/school/student_punch_days'
    this.queryLeatureListUrl = '/operations/school/activity_students'
  }

  // 获取所有活动列表数据
  queryActivityList (params) {
    return this.sendGet(this.queryActivityUrl, params)
  }
  // 获取打卡活动列表数据
  getAttendanceList (params) {
    return this.sendGet(this.queryAttendanceListUrl, params)
  }
  // 获取打卡学生详情数据
  getAttendanceStudent (params) {
    return this.sendGet(this.queryAttendanceStudentUrl, params)
  }
  // 获取讲座活动列表数据
  getLeatureList (params) {
    return this.sendGet(this.queryLeatureListUrl, params)
  }
}

export default new Consult()
