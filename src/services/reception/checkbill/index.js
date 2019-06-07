import CRUD from '../../CRUD'

class Checkbill extends CRUD {
  constructor () {
    super()
    this.queryCheckbillListUrl = '/phoenix/order/bill_list'
    this.changePriceUrl = '/phoenix/order/change_price'
    this.getOptionsUrl = '/liveOrgClass/options'
  }

  // 获取订单列表数据
  queryCheckbillList (params) {
    return this.sendGet(this.queryCheckbillListUrl, params)
  }
  // 修改价格
  postChangePrice (params) {
    return this.sendPost(this.changePriceUrl, params)
  }
}

export default new Checkbill()
