import CRUD from '../../CRUD'

class MyGood extends CRUD {
  constructor () {
    super()
    this.queryGoodUrl = '/phoenix/mall/list'
    this.upOrDownUrl = '/phoenix/mall/saleOp'
    this.getOptionsUrl = '/liveOrgClass/options'
  }

  // 获取商品列表数据
  queryGoodList (params) {
    return this.sendGet(this.queryGoodUrl, params)
  }
  // 处理上下架操作
  postUpOrDown (params) {
    return this.sendPost(this.upOrDownUrl, params)
  }
  // 获取年级，班级类型，学科的下拉框数据
  getOptions (params) {
    return this.sendGet(this.getOptionsUrl, params)
  }
}

export default new MyGood()
