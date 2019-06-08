import CRUD from '../CRUD'

class Buy extends CRUD {
  constructor () {
    super()
    this.getCoursesByTypeId = '/ws/api/course/getCoursesByTypeId'
    this.queryTeacherUrl = '/ws/api/course/getPayImg'
  }
  queryCourses (params) {
    return this.sendGet(this.getCoursesByTypeId,params)
  }
  queryPayImg (params) {
    return this.sendPost(this.queryTeacherUrl, params).then(res => {
        console.log(res);
        // if (res.ok) {
        //   return new Promise((resolve, reject) => {
        //     authUtils.removeToken()
        //     authUtils.removeUser()
        //     resolve({
        //       ok: true
        //     })
        //   })
        // }
      })
  }

}

export default new Buy()
