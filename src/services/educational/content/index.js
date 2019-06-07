import CRUD from '../../CRUD'

class Content extends CRUD {
  constructor () {
    super()
    this.getOptionsUrl = '/liveOrgClass/options'
    this.getContentUrl = '/phoenix/content/list'
    this.getAllMainTeacherUrl = '/phoenix/eduadmin/scene/listSceneTeacher'
    this.contentBindUrl = '/phoenix/content/bind'
    this.contentChangeUrl = '/phoenix/content/modify'
  }

  // 获取年级，班级类型，学科的下拉框数据
  getOptions (params) {
    return this.sendGet(this.getOptionsUrl, params)
  }
  // 获取课程(内容)包列表页数据
  getContentList (params) {
    return this.sendGet(this.getContentUrl, params)
  }
  // 获取所有的面授主讲
  getAllMainTeacherList (params) {
    return this.sendGet(this.getAllMainTeacherUrl, params)
  }
  // 课程(内容)包绑定面授主讲
  contentBind (params) {
    return this.sendPost(this.contentBindUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 课程(内容)包更换面授主讲
  contentChange (params) {
    return this.sendPost(this.contentChangeUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default new Content()
