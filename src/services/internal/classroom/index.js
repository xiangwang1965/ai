import CRUD from '@/services/CRUD'

class Classroom extends CRUD {
  /**
   * 教室管理
   */
  // 获取教室列表
  getClassroomList (params) {
    var serverParams = {
      type: params.type,
      page: params.page,
      page_size: params.page_size,
      usage: params.usage,
      is_active: params.is_active,
      campus_id: params.campus_id
    }
    if (params.key) {
      serverParams.key = params.key
    }
    return this.sendGet('/phoenix/room/list', serverParams)
  }
  // 创建教室
  createClassroom (params) {
    return this.sendPost('/phoenix/room/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取教室详情
  getClassroomDetail (params) {
    return this.sendGet('/phoenix/room/detail', params)
  }
  // 禁用教室
  changeClassroomStatus (params) {
    return this.sendPost('/phoenix/room/modify_active', params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default new Classroom()
