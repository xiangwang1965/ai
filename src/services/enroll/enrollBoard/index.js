import CRUD from '../../CRUD'

class EnrollBoard extends CRUD {
  constructor () {
    super()
    this.boardHeader = '/board/board_header'
    this.classDetail = '/board/live_class_detail'
    this.subjectsGradesRanking = '/board/subjects_grades_ranking'
    this.workingActivities = '/board/working_activities'
    this.workingPlan = '/board/working_plans'
    this.workingPlanActivities = '/board/working_plan_activities'
    this.historyOrgClasses = '/board/history_org_classes'
    this.orgClassesDetail = '/board/org_class_detail'
  }

  // 获取咨询本列表数据
  queryConsultList (params) {
    return this.sendPost(this.queryConsultUrl, params)
  }

  // 招生看板头部
  getBoardHeader (params) {
    return this.sendGet(this.boardHeader, params)
  }

  // 学科年级排行
  getSubjectsGradesRanking (params) {
    return this.sendGet(this.subjectsGradesRanking, params)
  }
  // 正在进行的活动
  getWorkingActivites (params) {
    return this.sendGet(this.workingActivities, params)
  }
  // 正在进行的运营规划
  getWorkingPlan (params) {
    return this.sendGet(this.workingPlan, params)
  }
  // 正在进行的运营规划的活动
  getWorkingPlanActivities (params) {
    return this.sendGet(this.workingPlanActivities, params)
  }
  // 续报列表
  getHistoryOrgClasses (params) {
    return this.sendGet(this.historyOrgClasses, params)
  }
  // 教学班续报详情
  getOrgClassesDetail (params) {
    return this.sendGet(this.orgClassesDetail, params)
  }
}

export default new EnrollBoard()
