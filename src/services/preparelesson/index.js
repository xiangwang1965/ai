import CRUD from '@/services/CRUD'
class Preparelesson extends CRUD {
  // 备课列表
  getPreparelessonList (params) {
    return this.sendGet('/liveOrgClass/myPrepares', params)
  }
  // 备课详情
  getPreparelessonDetail (params) {
    return this.sendGet('/liveOrgClass/prepareClass/detail', params).then(res => {
      if (res.status_code !== 200) {
        this.handleError(res)
      }
      return res
    })
  }
  // 创建备课
  scheduleLesson (params) {
    return this.sendPost('/liveOrgClass/createPrepare', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  modifyScheduleLesson (params) {
    return this.sendPost('/liveOrgClass/modifyClass', params).then(res => {
      this.handleError(res)
      return res
    })
  }
}
export default new Preparelesson()
