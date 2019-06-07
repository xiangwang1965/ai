import CRUD from '../../CRUD'

class Basic extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/liveOrgClass/myLives'
    this.queryDetailUrl = '/mall/commodity/detail'
    this.updateUrl = '/campus/modify'
    this.disabledUrl = '/campus/modify_active'
    this.createClassOptionUrl = '/class/filter'
    this.querySubsidyUrl = '/data/org/teacherSalaryList'
  }
  // 查询课程列表
  queryCourseList (params) {
    return this.sendGet('/content/course/list', params)
  }
  // 查询面授课程列表
  faceCourseList (params) {
    return this.sendGet('/phoenix/eduadmin/course/list', params).then(res => {
      if (!res.data.list) {
        res.data.list = []
      }
      res.data.list.map((v, index) => {
        v.class_level_name = v.class_type_name
      })
      return res
    })
  }
  // 设置课程是否启用
  courseDisable (params) {
    return this.sendPost('/content/course/valid', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 课程详情
  platformCourseDetail (params) {
    return this.sendGet('/content/course/detail', params)
  }
  // 面授课程详情
  courseDetail (params) {
    return this.sendGet('/phoenix/eduadmin/course/detail', params)
  }
  // 讲次列表
  platformCourseLessonList (params) {
    return this.sendGet('/content/lesson/list', params)
  }
  // 添加讲次
  createLesson (params) {
    return this.sendPost('/content/lesson/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 编辑讲次
  editLesson (params) {
    return this.sendPost('/content/lesson/update', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 删除讲次
  deleteLesson (params) {
    return this.sendPost('/content/lesson/delete', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 删除课程
  courseDelete (params) {
    return this.sendPost('/content/course/delete', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 创建课程里的获取课程类型
  getCourseType (params) {
    return this.sendGet('/content/course/type', params).then(res => {
      return res
    })
  }
  // 获取教学产品列表
  getProductList (params) {
    return this.sendGet('/content/product/list', params).then(res => {
      return res
    })
  }
   // 获取教学产品列表
  getProductListNew (params) {
    return this.sendGet('http://admin.server.cactus.100tal.com/content/product/list', params).then(res => {
      return res
    })
  }
  // 获取课程名称
  getCourseName (params) {
    return this.sendGet('/content/course/name', params)
  }
  // 获取教学产品配置项
  courseOptions (params) {
    return this.sendGet('/content/product/base_class/options', params)
  }
  // 创建课程
  createCourse (params) {
    return this.sendPost('/content/course/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 创建面授课程
  createFaceCourse (params) {
    return this.sendPost('/phoenix/eduadmin/course/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授课程类型
  courseType (params) {
    return this.sendGet('/phoenix/eduadmin/course/type', params).then(res => {
      var data = []
      if (res.status_code === 200) {
        res.data.map((v, i) => {
          data.push({
            courseTypeId: v.course_type_id,
            courseTypeName: v.course_type_name
          })
        })
        return data
      }
    })
  }
  // 获取面授课程学期
  getTermList (params) {
    return this.sendGet('/phoenix/eduadmin/course/term', params).then(res => {
      var data = []
      if (res.status_code === 200) {
        res.data.map((v, i) => {
          data.push({
            termId: v.term_id,
            termName: v.term_name,
            schoolId: v.school_id
          })
        })
        return data
      }
    })
  }
  // 新增学期
  termAdd (params) {
    return this.sendPost('/phoenix/eduadmin/course/add-new-term', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授课程学科
  getSubjectList (params) {
    return this.sendGet('/phoenix/eduadmin/course/subject', params).then(res => {
      var data = []
      if (res.status_code === 200) {
        res.data.map((v, i) => {
          data.push({
            subjectId: v.subject_id,
            subjectName: v.subject_name,
            schoolId: v.school_id
          })
        })
        return data
      }
    })
  }
  // 新增学科
  subjectAdd (params) {
    return this.sendPost('/phoenix/eduadmin/course/add-new-subject', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授课程年级
  getGradeList (params) {
    return this.sendGet('/phoenix/eduadmin/course/grade', params).then(res => {
      var data = []
      if (res.status_code === 200) {
        res.data.map((v, i) => {
          data.push({
            grade_id: v.grade_id,
            grade_name: v.grade_name,
            school_id: v.school_id
          })
        })
        return data
      }
    })
  }
  // 新增年级
  gradeAdd (params) {
    return this.sendPost('/phoenix/eduadmin/course/add-new-grade', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授课程班级类型
  getClassLevelList (params) {
    return this.sendGet('/phoenix/eduadmin/course/class-type', params).then(res => {
      var data = []
      if (res.status_code === 200) {
        res.data.map((v, i) => {
          data.push({
            class_level_id: v.class_type_id,
            class_level_name: v.class_type_name,
            school_id: v.school_id
          })
        })
        return data
      }
    })
  }
  // 新增班级类型
  classTypeAdd (params) {
    return this.sendPost('/phoenix/eduadmin/course/add-new-class-type', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取校区列表
  getCampusList (params) {
    return this.sendGet('/campus/list', params).then(res => {
      return res.data.data
    })
  }
  // 禁用/启用面授课程
  validCourse (params) {
    return this.sendPost('/phoenix/eduadmin/course/valid', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取面授课程讲次列表
  courseLessonList (params) {
    return this.sendGet('/phoenix/eduadmin/lesson/list', params).then(res => {
      res.data.map((v, index) => {
        v.index = index + 1
      })
      return res
    })
  }
  // 添加面授课程讲次
  addFaceLesson (params) {
    return this.sendPost('/phoenix/eduadmin/lesson/create', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 删除面授课程讲次
  deleteFaceLesson (params) {
    return this.sendPost('/phoenix/eduadmin/lesson/delete', params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 编辑面授课程讲次
  editFaceLesson (params) {
    return this.sendPost('/phoenix/eduadmin/lesson/modify', params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default new Basic()
