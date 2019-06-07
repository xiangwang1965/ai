import CRUD from '../CRUD'

class Basic extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/liveOrgClass/myLives'
    this.queryDetailUrl = '/mall/commodity/detail'
    this.updateUrl = '/campus/modify'
    this.disabledUrl = '/campus/modify_active'
    this.createClassOptionUrl = '/class/filter'
    this.querySubsidyUrl = '/data/org/teacherSalaryList'
  }
  // 获取班型列表
  queryDetail (params) {
    return this.sendGet(this.queryDetailUrl, params)
  }
  // 修改班型名称
  updateName (params) {
    return this.sendPost(this.updateNameUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  //  查询双师班级课程
  createClassOption (params) {
    return this.sendGet(this.createClassOptionUrl, params)
  }
  // 获取辅导老师激励
  querySubsidy (params) {
    return this.sendGet(this.querySubsidyUrl, params)
  }
}

export default new Basic()
