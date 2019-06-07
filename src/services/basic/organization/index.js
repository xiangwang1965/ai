import CRUD from '../../CRUD'

class Organization extends CRUD {
  constructor () {
    super()
    this.queryOrganizationUrl = '/phoenix/school/extra/info'
    this.saveOrganizationUrl = '/phoenix/school/extra/info'
  }

  // 获取机构信息数据
  queryOrganizationList (params) {
    return this.sendGet(this.queryOrganizationUrl, params)
  }
  // 保存机构信息数据
  postOrganization (params) {
    return this.sendPost(this.saveOrganizationUrl, params)
  }
}

export default new Organization()
