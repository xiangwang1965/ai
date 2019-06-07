import Base from '../Base'
import authUtils from './utils'
import store from '@/vuex/store.js'
class Auth extends Base {
  constructor () {
    super()
    this.authUrl = '/auth'
    this.loginUrl = '/auth/login'
    this.codeLoginUrl = '/auth/code_login'
    this.logoutUrl = '/auth/logout'
    this.queryUserInfoUrl = '/auth/current'
    this.queryUserListUrl = '/auth/users'
  }

  /**
   * 认证接口
   * @param { Object } params {telephone, password, type: 1 教师APP、2教师PC、3学生端}
   */
  auth (params) {
    params.type = 2
    return this.sendPost(this.authUrl, params).then(res => {
      if (res.status_code === 200) {
        authUtils.removeToken()
        // 只有一个直接登录
        if (res.data.users.length === 1) {
          return this.login({
            id: res.data.users[0].id, // TODO 如果登录在这里用需要判断学校个数来提示选择
            token: res.data.token
          })
        } else {
          // 多个机构切换
          res.multiple = true
          return res
        }
      }
      this.handleError(res, {
        errorOnly: true
      })
    })
  }

  /**
   * 登录接口
   * @param { Object } params {id, token, type: 1 教师APP、2教师PC、3学生端}
   */
  login (params) {
    params.type = 2
    return this.sendPost(this.loginUrl, params).then(res => {
      if (res.status_code === 200) {
        authUtils.setToken(res.data.token)
        let { id, name, role_name, school, avatar_url } = res.data.user
        let brands = ''
        this.$store.state.brandList = school.brands
        school.brands.map((v, i) => {
          brands += ',' + v.name
        })
        authUtils.setUser({
          id,
          name,
          role_name,
          school_id: school.id,
          school_name: school.name,
          third_part: school.third_part,
          brands: brands.substring(1, brands.length),
          brandList: JSON.stringify(school.brands),
          permissions: school.permissions ? school.permissions : 'academic_affairs',
          is_self_live: school.is_self_live,
          avatar_url,
          is_teach: school.is_teach,
          is_live: school.is_live
        })
      }
      this.handleError(res, {
        success: '登录成功'
      })
      return res
    })
  }

  /**
   * 退出登录
   */
  logout () {
    let params = {
      type: 2
    }
    return this.sendPost(this.logoutUrl, params).then(res => {
      if (res.ok) {
        return new Promise((resolve, reject) => {
          authUtils.removeToken()
          authUtils.removeUser()
          resolve({
            ok: true
          })
        })
      }
    })
  }

  /**
   * 获取当前用户信息
   */
  queryUserInfo (params) {
    return this.sendGet(this.queryUserInfoUrl, params).then((res) => {
      if (res.ok) {
        this.setBrandList(res.data.school.brands)
      }
      return res
    })
  }
  setBrandList (list) {
    store.state.brandList = list
  }
  /**
   * 获取当前用户学校
   */
  fetchSchool () {
    return this.sendGet(this.queryUserListUrl)
  }
}

export default new Auth()
