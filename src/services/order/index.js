import CRUD from '../CRUD';

class Order extends CRUD {
    constructor () {
        super();
        this.allOrdersUrl = '/ws/api/order/orders'; // 全部订单
        this.curOrdersUrl = '/ws/api/order/curOrders'; // 进行中的订单
        this.hisOrdersUrl = '/ws/api/order/hisOrders'; // 历史订单
        this.detailsOrders = '/ws/api/order/detailsOrders'; // 订单详情
    };
    queryOrders (params) {
        if (params.typeid === '1') {
            return this.sendGet(this.allOrdersUrl)
        } else if (params.typeid === '2') {
            return this.sendGet(this.curOrdersUrl, params)
        } else if (params.typeid === '3') {
            return this.sendGet(this.hisOrdersUrl, params)
        } else if (params.typeid === '4') {
            return this.sendGet(this.detailsOrders, params)
        }
    };
}

export default new Order();
