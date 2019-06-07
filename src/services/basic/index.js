import CRUD from '../CRUD'

class Basic extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/campus/list'
    this.createUrl = '/campus/add'
    this.updateUrl = '/campus/modify'
    this.disabledUrl = '/campus/modify_active'
    this.queryAreaUrl = '/area/all'
    this.queryBasicUrl = 'class/baseClassList'
    this.updateNameUrl = '/class/baseClassesModify'
  }
  // 查询地区
  queryArea () {
    return this.sendGet(this.queryAreaUrl)
  }
  // 获取班型列表
  queryBasic (params) {
    return this.sendGet(this.queryBasicUrl, params)
  }
  // 修改班型名称
  updateName (params) {
    return this.sendPost(this.updateNameUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取余额
  getPayAccount (params) {
    return this.sendGet('/pay/account', params).then(res => {
      return res
    })
  }
}

export default new Basic()
