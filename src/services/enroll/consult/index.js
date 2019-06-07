import CRUD from '../../CRUD'

class Consult extends CRUD {
  constructor () {
    super()
    this.queryConsultUrl = '/advice/list_advice'
    this.updateConsultUrl = '/advice/add_advice'
    this.defaultConsultUrl = '/advice/edit_advice'
    this.getDetailUrl = '/advice/advice_detail'
    this.getOptionsUrl = '/phoenix/options'
  }

  // 获取咨询本列表数据
  queryConsultList (params) {
    return this.sendPost(this.queryConsultUrl, params)
  }
  // 获取编辑页默认数据
  getDefaultData (params) {
    return this.sendGet(this.defaultConsultUrl, params)
  }
  // 编辑咨询本数据
  updateConsult (params) {
    return this.sendPost(this.updateConsultUrl, params)
  }
  // 获取咨询本详情数据
  getConsultDetail (params) {
    return this.sendGet(this.getDetailUrl, params)
  }
  // 获取年级，班级类型，学科的下拉框数据
  getOptions (params) {
    return this.sendGet(this.getOptionsUrl, params)
  }
}

export default new Consult()
