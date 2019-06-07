import CRUD from '../../CRUD'

class Order extends CRUD {
  constructor () {
    super()
    this.queryOrderListUrl = '/phoenix/order/order_list'
    this.changePriceUrl = '/phoenix/order/change_price'
    this.getOptionsUrl = '/liveOrgClass/options'
  }

  // 获取订单列表数据
  queryOrderList (params) {
    return this.sendGet(this.queryOrderListUrl, params)
  }
  // 修改价格
  postChangePrice (params) {
    return this.sendPost(this.changePriceUrl, params)
  }
  // 获取年级，班级类型，学科的下拉框数据
  getOptions (params) {
    return this.sendGet(this.getOptionsUrl, params)
  }
}

export default new Order()
