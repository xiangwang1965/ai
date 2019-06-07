import CRUD from '@/services/CRUD'

class Campus extends CRUD {
  // 创建校区
  createCampus (params) {
    return this.sendPost('/phoenix/campus/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 编辑校区
  editCampus (params) {
    return this.sendPost('/phoenix/campus/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default new Campus()
