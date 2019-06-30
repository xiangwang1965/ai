import CRUD from '../CRUD'

class Buy extends CRUD {
  constructor () {
    super()
    this.getCoursesByTypeId = '/ws/api/course/getCoursesByTypeId'
    this.getPayImgUrl = '/ws/api/course/getPayImg'
    this.addOrdersUrl = '/ws/api/class/addOrder'
    this.payStatusUrl = '/ws/api/class/getOrderStatus'
    this.getCoursesDetailsUrl = "/ws/api/course/getCoursesDetails2";
  }
  queryCourses (params) {
    return this.sendGet(this.getCoursesByTypeId,params)
  }
  queryPayImg(params) {
    return this.sendPost(this.getPayImgUrl, params).then(res => {
        console.log(res);
        return res;
      })
  }
  queryAddOrder(params) {
    return this.sendPost(this.addOrdersUrl, params).then(res => {
        return res;
    });
  }
  getCoursesDetail(params) {
    return this.sendGet(this.getCoursesDetailsUrl, params);
  }
  queryOrderStatus(params) {
    return this.sendPost(this.payStatusUrl, params).then(res => {
        return res;
    });
  }
}

export default new Buy()
