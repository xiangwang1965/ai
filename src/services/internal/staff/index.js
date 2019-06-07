import CRUD from '@/services/CRUD'

class Staff extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/liveOrgClass/myLives'
  }
  // 获取员工列表
  getStaffList (params) {
    return this.sendGet('/phoenix/users/list', params)
  }
  // 获取校区列表
  getCampusList (params) {
    return this.sendGet('/phoenix/campus/list', params).then(res => {
      return res.data.data
    })
  }
  // 获取权限数据
  getRolesGroup (params) {
    return this.sendGet('/phoenix/group_roles', params).then(res => {
      let list = []
      res.data.map((v, i) => {
        let roleList = []
        v.data.map((o, j) => {
          if (o.check * 1 === 1) {
            roleList.push(o.role_name)
          }
        })
        list.push({
          name: v.name,
          checkRoleList: roleList,
          data: v.data
        })
      })
      return list
    })
  }
  // 获取角色数据
  getPermissionGroup (params) {
    return this.sendPost('/phoenix/group_permissions', params).then(res => {
      let list = []
      res.data.map((v, i) => {
        let permissionList = []
        v.data.map((o, j) => {
          if (o.checked * 1 === 1) {
            permissionList.push(o.permission_name)
          }
        })
        list.push({
          group_name: v.group_name,
          checkList: permissionList,
          data: v.data,
          checkedAll: permissionList.length > 0
        })
      })
      return list
    })
  }
  // 创建员工
  createStaff (params) {
    return this.sendPost('/phoenix/users/add', params).then(res => {
      if (res.message && res.message.indexOf('账号密码发送失败') !== -1) {
        return {
          status_code: 200,
          key: '密码发送失败',
          message: '账号密码发送失败，可使用验证码登录'
        }
      }
      this.handleError(res)
      return res
    })
  }
  editStaff (params) {
    return this.sendPost('/phoenix/users/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取员工详情
  getStaffDetail (params) {
    return this.sendGet('/phoenix/users', params).then(res => {
      return res
    })
  }
  // 员工禁用
  disabledStaff (params) {
    return this.sendPost('/phoenix/users/modify_active', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取内容学科options
  getContentSubject (params) {
    return this.sendGet('/content/options/subjects', params).then(res => {
      return res
    })
  }
  // 获取内容年级options
  getContentGrades (params) {
    return this.sendGet('/content/options/subject/grades', params).then(res => {
      return res
    })
  }
  // 获取支付方式
  getPayments (params) {
    return this.sendGet('/content/options/payments', params).then(res => {
      return res
    })
  }
  // 获取内容包价钱
  getContentPrice (params) {
    return this.sendGet('/content/total_price', params).then(res => {
      return res
    })
  }
}

export default new Staff()
