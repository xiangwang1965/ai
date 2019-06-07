import Vue from 'vue'
import Router from 'vue-router'
import authUtils from '@/services/auth/utils'
import { LOGIN_URL, WB_MAIN_URL } from '@/config'

const home = () => import('@/views/home')
const notFound = () => import('@/views/notFound')

const auth = () => import('@/views/auth')
const thirdPartAuth = () => import('@/views/auth/thirdpartauth')
const classroom = () => import('@/views/classroom')// 班级管理
const classroomWrap = () => import('@/views/classroom/detailWrap')// 班级容器
const createClass = () => import('@/views/classroom/createclass')// 创建班级
const classEdit = () => import('@/views/classroom/edit')// 编辑班级
const classDetail = () => import('@/views/classroom/detail')// 班级详情
const teachingClassDetail = () => import('@/views/classroom/classdetail')// 班级详情

const campus = () => import('@/views/basic')// 校区
const campusWrap = () => import('@/views/basic/campuswrap')// 校区容器
const createCampus = () => import('@/views/basic/createCampus')// 创建校区

const student = () => import('@/views/student')// 学生管理
const studentWrap = () => import('@/views/student/studentWrap')// 学生管理容器
const studentEdit = () => import('@/views/student/edit')// 创建修改学生

const live = () => import('@/views/live')// 双师管理
const liveWrap = () => import('@/views/live/liveWrap')// 双师管理容器
const livedetail = () => import('@/views/live/livedetail')// 双师管理详情

const courseList = () => import('@/views/platform/course/index')// 课程列表
const courseDetail = () => import('@/views/platform/course/detail')// 课程详情
const courseWrap = () => import('@/views/platform/course/detailWrap')// 课程列表容器
const createCourse = () => import('@/views/platform/course/createCourse')// 创建课程

const teacherClassList = () => import('@/views/platform/teacher_class/index')// 主讲班级列表
const teacherClassDetail = () => import('@/views/platform/teacher_class/detail')// 主讲班级详情
const teacherClassWrap = () => import('@/views/platform/teacher_class/teacherClassWrap')// 主讲班级容器
const createTeacherClass = () => import('@/views/platform/teacher_class/createTeacherClass')// 创建主讲班级

const studentClassroom = () => import('@/views/platform/student_class/index')// 班级管理
const studentClassroomWrap = () => import('@/views/platform/student_class/detailWrap')// 班级管理容器
const studentClassroomEdit = () => import('@/views/platform/student_class/edit')// 创建编辑班级
const studentClassroomDetail = () => import('@/views/platform/student_class/detail')// 班级详情
// const live = () => import('@/views/live')

const platformTeacherList = () => import('@/views/platform/teacher/index')// 主讲列表
const platformTeacherWrap = () => import('@/views/platform/teacher/teacherWrap')// 主讲列表容器
const createPlatformTeacher = () => import('@/views/platform/teacher/createTeacher')// 创建主讲
const platformTeacherDetail = () => import('@/views/platform/teacher/detail')// 主讲详情

const liveClassroomList = () => import('@/views/platform/live_classroom/index')// 直播间列表
const liveClassroomWrap = () => import('@/views/platform/live_classroom/liveClassroomWrap')// 直播间列表容器
const createLiveClassroom = () => import('@/views/platform/live_classroom/createLiveClassroom')// 创建直播间
const LiveClassroomDetail = () => import('@/views/platform/live_classroom/detail')// 直播间详情

const platformClassroomList = () => import('@/views/platform/classroom/index')// 直播间列表
const platformClassroomWrap = () => import('@/views/platform/classroom/classroomWrap')// 直播间列表容器
const createPlatformClassroom = () => import('@/views/platform/classroom/createClassroom')// 创建直播间
const platformClassroomDetail = () => import('@/views/platform/classroom/detail')// 直播间详情

const reception = () => import('@/views/reception/business')// 前台业务
// 业务办理
const receptionWrap = () => import('@/views/reception/business/receptionwrap')// 业务办理容器
const studentEntry = () => import('@/views/reception/business/studententry')// 学生报名
const changeClass = () => import('@/views/reception/business/changeclass')// 学生转班
const quitClass = () => import('@/views/reception/business/quitclass')// 学生退班
const addStudent = () => import('@/views/reception/business/addstudent')// 添加学生
const addFee = () => import('@/views/reception/business/addfee')// 补费
const receptionStudentDetail = () => import('@/views/reception/business/studentdetail')// 学生详情
// 订单
const orderWrap = () => import('@/views/reception/order/orderwrap')// 订单容器
const order = () => import('@/views/reception/order')
// 账单核对
const checkBillWrap = () => import('@/views/reception/checkbill/checkbillwrap')// 订单容器
const checkBill = () => import('@/views/reception/checkbill')

const platformCourseWrap = () => import('@/views/platform/platform/platformcoursewrap')// 双师平台课程
const platformClassWrap = () => import('@/views/platform/platform/platformclasswrap')// 双师平台班级
const platformStudentWrap = () => import('@/views/platform/platform/platformstudentwrap')// 双师平台学生

const staffWrap = () => import('@/views/internal/staff/staffWrap')// 员工管理
const staff = () => import('@/views/internal/staff')// 员工列表
const createStaff = () => import('@/views/internal/staff/createstaff')// 创建员工
const staffDetail = () => import('@/views/internal/staff/staffdetail')// 员工详情

const wisroomWrap = () => import('@/views/wisroom/courseware/wisroomwrap')// wisroom容器
const wisroomCourseWare = () => import('@/views/wisroom/courseware')// wisroom课件列表
const wisroomCourseWareDetail = () => import('@/views/wisroom/courseware/detail')// wisroom课件详情
const wisroomCourseWrap = () => import('@/views/wisroom/course/wisroomcoursewrap')// wisroom课程容器
const wisroomCourse = () => import('@/views/wisroom/course')// wisroom课程列表
const wisroomCourseDetail = () => import('@/views/wisroom/course/detail')// wisroom课程详情
const createWisroomCourse = () => import('@/views/wisroom/course/createcourse')// wisroom课程详情

const wisroomClassWrap = () => import('@/views/wisroom/class/wisroomclasswrap')// wisroom班级容器
const wisroomClass = () => import('@/views/wisroom/class')// wisroom班级列表
const createWisroomClass = () => import('@/views/wisroom/class/createclass')// 创建wisroom班级
const wisroomClassDetail = () => import('@/views/wisroom/class/detail')// wisroom班级详情

const wisroomStudentWrap = () => import('@/views/wisroom/student/wisroomstudentwrap')// wisroom学生容器
const wisroomStudent = () => import('@/views/wisroom/student')// wisroom学生
const wisroomCreateStudent = () => import('@/views/wisroom/student/createstudent')// 创建wisroom学生
const wisroomStudentDetail = () => import('@/views/wisroom/student/detail')// wisroom学生详情

const prepareLessonWrap = () => import('@/views/preparelesson/preparelessonwrap')// 主辅备课容器
const prepareLesson = () => import('@/views/preparelesson')// 我的主辅备课
const scheduleLesson = () => import('@/views/preparelesson/schedulelesson')// 排课
const prepareLessonDetail = () => import('@/views/preparelesson/detail')// 排课详情

const consultWrap = () => import('@/views/enroll/consult/consultWrap')// 招生中心容器
const consultList = () => import('@/views/enroll/consult/index')// 咨询本列表页
const consultEdit = () => import('@/views/enroll/consult/consultEdit')// 咨询本编辑
const consultDetail = () => import('@/views/enroll/consult/consultDetail')// 咨询本详情页

const enrollBoard = () => import('@/views/enroll/enrollBoard/index')
const renewHistoryWarp = () => import('@/views/enroll/renewHistory/index')
const renewHistoryList = () => import('@/views/enroll/renewHistory/list')
const renewHistoryDetail = () => import('@/views/enroll/renewHistory/detail')

const activityWrap = () => import('@/views/enroll/activity/activityWrap')// 运营活动容器
const activityList = () => import('@/views/enroll/activity/activityList')// 活动列表页
const attendanceList = () => import('@/views/enroll/activity/attendanceList')// 打卡列表页
const lectureList = () => import('@/views/enroll/activity/lectureList')// 讲座列表页
const studentActivityDetail = () => import('@/views/enroll/activity/studentDetail')// 学生详情页

// 机构信息
const organizationWrap = () => import('@/views/basic/organization/organizationWrap')// 机构信息容器
const organization = () => import('@/views/basic/organization') // 机构信息

// 商品管理
const myGoodWrap = () => import('@/views/goods/myGood/myGoodWrap')// 商品管理容器
const myGood = () => import('@/views/goods/myGood') // 商品列表

// 课程(内容)包
const contentWrap = () => import('@/views/educational/content/contentWrap') // 课程(内容)包容器
const contentList = () => import('@/views/educational/content') // 课程(内容)包列表页
const contentDetail = () => import('@/views/educational/content/detail') // 课程(内容)包详情

const coursewareDownloadWrap = r => require.ensure([], () => r(require('@/views/wisroom/download/wisroomDownloadWrap')), 'coursewareDownloadWrap')// 课件下载容器
const coursewareDownloadList = r => require.ensure([], () => r(require('@/views/wisroom/download')), 'coursewareDownloadList')// 课件下载容器

Vue.use(Router)

function requireAuth (to, from, next) {
  var firstPage = '/'
  if (!authUtils.loggedIn()) {
    if (location.search.toLowerCase().indexOf('token') !== -1) {
      // if (!authUtils.thirdLoggedIn()) {
      firstPage = '/thirdPartAuth'
      // }
    }
      firstPage = '/auth'
  } else {
    // 验证有登录信息再判断重定向
    // 根据是否为平台双师来判断首页是什么
    let num = 0
    let brandArr = ['MS', '自营双师']
    brandArr.map((v) => {
      if (authUtils.getUser().brands && authUtils.getUser().brands.indexOf(v) >= 0) {
        num++
      }
    })
    var roleList = []
    if (authUtils.getUser() && authUtils.getUser().role_name) {
      roleList = authUtils.getUser().role_name.split(',')
    }
    if (roleList.indexOf('校长') >= 0 || roleList.indexOf('校区主管') >= 0 || roleList.indexOf('双师平台-校区主管') || roleList.indexOf('魔法双师-校区主管') || roleList.indexOf('前台') >= 0) {
      firstPage = '/reception'
    } else if (roleList.indexOf('教务') >= 0) {
      if (num > 0) {
        firstPage = '/course'
      } else {
        firstPage = '/wisroomCourseWare'
      }
    }
    if (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('前台') < 0) {
      if (roleList.indexOf('魔法双师主管') >= 0) {
        firstPage = '/studentClassroom'
      }
      if (roleList.indexOf('双师主管') >= 0) {
        firstPage = '/platformCourse'
      }
      if (roleList.indexOf('AI主管') >= 0) {
        firstPage = '/wisroomClass'
      }
    }
    if (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('前台') < 0) {
      if (roleList.indexOf('教务') >= 0) {
        let cooperationsName = []
        let brandList = JSON.parse(authUtils.getUser().brandList)
        brandList.map((v, i) => {
          v.cooperations.map((o, j) => {
            cooperationsName.push(o.cooperation_name)
          })
        })
        if (cooperationsName.indexOf('面授') >= 0) {
          firstPage = '/course'
        } else {
          firstPage = '/student'
        }
      }
    }
    if (roleList.indexOf('招生') >= 0 && roleList.length === 1) {
      firstPage = 'enroll'
    }
    if (roleList.indexOf('招生') >= 0 && roleList.indexOf('教师') >= 0 && roleList.length === 2) {
      firstPage = 'enroll'
    }
    if ((roleList.indexOf('辅导老师') >= 0 || roleList.indexOf('老师') >= 0) && (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('魔法双师主管') < 0 && roleList.indexOf('双师主管') < 0 && roleList.indexOf('AI主管') < 0 && roleList.indexOf('教务') < 0 && roleList.indexOf('前台') < 0 && roleList.indexOf('面授主讲') < 0 && roleList.indexOf('双师主讲') < 0 && roleList.indexOf('招生') < 0)) {
      window.location.href = WB_MAIN_URL + '/auth/setProfile?loggedIn=true&backUrl=' + location.href
    }
    if (roleList.indexOf('双师主讲') >= 0 && (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('双师主管') < 0 && roleList.indexOf('魔法双师主管') < 0 && roleList.indexOf('AI主管') < 0 && roleList.indexOf('前台') < 0 && roleList.indexOf('教务') < 0)) {
      firstPage = '/platform'
    }
    if (roleList.indexOf('面授主讲') >= 0 && (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('双师主管') < 0 && roleList.indexOf('魔法双师主管') < 0 && roleList.indexOf('AI主管') < 0 && roleList.indexOf('前台') < 0 && roleList.indexOf('教务') < 0)) {
      firstPage = '/teaching'
    }
    // redirect中没有next则不执行
    typeof next === 'function' && next()
  }
  return firstPage
}

const router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '*',
      name: 'notFound',
      component: notFound,
      redirect: '/'
    },
    {
      path: '/auth/login',
      name: 'auth',
      component: auth
    },
    {
      path: '/thirdPartAuth',
      name: 'thirdPartAuth',
      component: thirdPartAuth
    },
    {
      path: '/',
      component: home,
      beforeEnter: requireAuth,
      redirect: requireAuth,
      children: [
        {
          path: '/teaching',
          component: courseWrap,
          children: [
            { path: '/course', name: 'courseList', component: courseList, props: { source: 'teaching' } },
            { path: '/course/courseDetail', name: 'courseDetail', component: courseDetail, props: { source: 'course' } },
            { path: '/course/createCourse', name: 'createCourse', component: createCourse, props: { source: 'course' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/teacherClass',
          component: teacherClassWrap,
          children: [
            { path: '/', name: 'teacherClassList', component: teacherClassList },
            { path: 'teacherClassDetail', name: 'teacherClassDetail', component: teacherClassDetail },
            { path: 'createTeacherClass', name: 'createTeacherClass', component: createTeacherClass }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/studentClassroom',
          component: studentClassroomWrap,
          children: [
            { path: '/', name: 'studentClassroom', component: studentClassroom, props: { source: 'studentClassroom' }, beforeEnter: requireAuth },
            { path: 'studentClassroomDetail', name: 'studentClassroomDetail', component: studentClassroomDetail, props: { source: 'studentClassroom' } },
            { path: 'studentClassroomEdit', name: 'studentClassroomEdit', component: studentClassroomEdit, props: { source: 'studentClassroom' } },
            { path: 'addStudent', name: 'addStudent', component: addStudent, props: { source: 'studentClassroom' } },
            { path: 'studentClassroomChangeClass', name: 'studentClassroomChangeClass', component: changeClass, props: { source: 'studentClassroom' } },
            { path: 'studentClassroomQuitClass', name: 'studentClassroomQuitClass', component: quitClass, props: { source: 'studentClassroom' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/platformTeacher',
          component: platformTeacherWrap,
          children: [
            { path: '/', name: 'platformTeacherList', component: platformTeacherList },
            { path: 'platformTeacher', name: 'platformTeacher', component: platformTeacherList },
            { path: 'platformTeacherDetail', name: 'platformTeacherDetail', component: platformTeacherDetail },
            { path: 'createPlatformTeacher', name: 'createPlatformTeacher', component: createPlatformTeacher }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/liveClassroom',
          component: liveClassroomWrap,
          children: [
            { path: '/', name: 'liveClassroomList', component: liveClassroomList },
            { path: 'LiveClassroomDetail', name: 'LiveClassroomDetail', component: LiveClassroomDetail },
            { path: 'createLiveClassroom', name: 'createLiveClassroom', component: createLiveClassroom }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/classroom',
          component: platformClassroomWrap,
          children: [
            { path: '/', name: 'classroomList', component: platformClassroomList, props: { source: 'classroom' } },
            { path: 'classroomDetail', name: 'classroomDetail', component: platformClassroomDetail, props: { source: 'classroom' } },
            { path: 'createClassroom', name: 'createClassroom', component: createPlatformClassroom, props: { source: 'classroom' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/class',
          component: classroomWrap,
          children: [
            { path: '/', name: 'classroom', component: classroom, props: { source: 'teaching' } },
            { path: 'classedit', name: 'classEdit', component: classEdit, props: { source: 'teaching' } },
            { path: 'createClass', name: 'createClass', component: createClass, props: { source: 'teaching' } },
            { path: 'teachingClassDetail', name: 'teachingClassDetail', component: teachingClassDetail, props: { source: 'teaching' } },
            { path: 'addClassStudent', name: 'addClassStudent', component: addStudent, props: { source: 'teaching' } },
            { path: 'teachingChangeClass', name: 'teachingChangeClass', component: changeClass, props: { source: 'teaching' } },
            { path: 'teachingQuitClass', name: 'teachingQuitClass', component: quitClass, props: { source: 'teaching' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/campus',
          component: campusWrap,
          children: [
            { path: '/', name: 'campus', component: campus },
            { path: 'createCampus', name: 'createCampus', component: createCampus }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/organization',
          component: organizationWrap,
          children: [
            { path: '/', name: 'organization', component: organization }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/student',
          component: studentWrap,
          children: [
            { path: '/', name: 'student', component: student, props: { source: 'teaching' } },
            { path: 'edit', name: 'studentEdit', component: studentEdit },
            { path: 'createStudent', name: 'createStudent', component: studentEntry, props: { source: 'teaching' } },
            { path: 'studentDetail', name: 'studentDetail', component: receptionStudentDetail, props: { source: 'student' } },
            { path: 'studentChangeClass', name: 'studentChangeClass', component: changeClass, props: { source: 'student' } },
            { path: 'studentAddFee', name: 'studentAddFee', component: addFee, props: { source: 'student' } },
            { path: 'studentQuitClass', name: 'studentQuitClass', component: quitClass, props: { source: 'student' } }
            // { path: 'detail', name: 'studentDetail', component: studentDetail }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/live',
          component: liveWrap,
          children: [
            { path: '/', name: 'live', component: live },
            { path: 'liveClassedit', name: 'liveClassedit', component: classEdit, props: { source: 'live' } },
            { path: 'livedetail', name: 'livedetail', component: livedetail }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/reception',
          component: receptionWrap,
          children: [
            { path: '/', name: 'reception', component: reception },
            { path: 'studentEntry', name: 'studentEntry', component: studentEntry, props: { source: 'reception' } },
            { path: 'receptionStudentDetail', name: 'receptionStudentDetail', component: receptionStudentDetail, props: { source: 'reception' } },
            { path: 'addFee', name: 'addFee', component: addFee, props: { source: 'reception' } },
            { path: 'changeClass', name: 'changeClass', component: changeClass, props: { source: 'reception' } },
            { path: 'quitClass', name: 'quitClass', component: quitClass, props: { source: 'reception' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/order',
          component: orderWrap,
          children: [
            { path: '/', name: 'order', component: order }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/checkBill',
          component: checkBillWrap,
          children: [
            { path: '/', name: 'checkBill', component: checkBill }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'platform',
          component: platformCourseWrap,
          children: [
            { path: '/platformCourse', name: 'platformCourse', component: courseList, props: { source: 'platform' } },
            { path: '/platformCourse/platformCourseDetail', name: 'platformCourseDetail', component: courseDetail, props: { source: 'platform' } },
            { path: '/platformCourse/platformCreateCourse', name: 'platformCreateCourse', component: createCourse, props: { source: 'platform' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'platformClass',
          component: platformClassWrap,
          children: [
            { path: '/', name: 'platformClass', component: classroom, props: { source: 'platform' } },
            { path: 'platformClassDetail', name: 'platformClassDetail', component: teacherClassDetail },
            { path: 'platformCreateClass', name: 'platformCreateClass', component: createTeacherClass, props: { source: 'platform' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'platformStudent',
          component: platformStudentWrap,
          children: [
            { path: '/', name: 'platformStudent', component: studentClassroom, props: { source: 'platform' } },
            { path: 'platformStudentDetail', name: 'platformStudentDetail', component: classDetail, props: { source: 'platform' } },
            { path: 'platformStudentEdit', name: 'platformStudentEdit', component: studentClassroomEdit, props: { source: 'platform' } },
            { path: 'platformAddStudent', name: 'platformAddStudent', component: addStudent, props: { source: 'platform' } },
            { path: 'platformChangeClass', name: 'platformChangeClass', component: changeClass, props: { source: 'platform' } },
            { path: 'platformQuitClass', name: 'platformQuitClass', component: quitClass, props: { source: 'platform' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'platformLiveClassroom',
          name: 'platformLiveClassroom',
          component: liveClassroomList,
          beforeEnter: requireAuth
        },
        {
          path: 'staff',
          component: staffWrap,
          children: [
            { path: '/', name: 'staff', component: staff },
            { path: 'createStaff', name: 'createStaff', component: createStaff },
            { path: 'staffDetail', name: 'staffDetail', component: staffDetail }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'wisroomCourseWare',
          component: wisroomWrap,
          children: [
            { path: '/', name: 'wisroomCourseWare', component: wisroomCourseWare },
            { path: 'wisroomCourseWareDetail', name: 'wisroomCourseWareDetail', component: wisroomCourseWareDetail }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/wisroomCourse',
          component: wisroomCourseWrap,
          children: [
            { path: '/', name: 'wisroomCourse', component: wisroomCourse },
            { path: 'wisroomCourseDetail', name: 'wisroomCourseDetail', component: wisroomCourseDetail, props: { source: 'wisroom' } },
            { path: 'createWisroomCourse', name: 'createWisroomCourse', component: createWisroomCourse, props: { source: 'wisroom' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/wisroomClass',
          component: wisroomClassWrap,
          children: [
            { path: '/', name: 'wisroomClass', component: wisroomClass },
            { path: 'wisroomClassdit', name: 'wisroomClassEdit', component: classEdit, props: { source: 'wisroom' } },
            { path: 'createWisroomClass', name: 'createWisroomClass', component: createWisroomClass, props: { source: 'wisroom' } },
            { path: 'wisroomClassDetail', name: 'wisroomClassDetail', component: wisroomClassDetail, props: { source: 'wisroom' } },
            { path: 'wisroomAddStudent', name: 'wisroomAddStudent', component: addStudent, props: { source: 'wisroom' } },
            { path: 'wisroomChangeClass', name: 'wisroomChangeClass', component: changeClass, props: { source: 'wisroom' } },
            { path: 'wisroomQuitClass', name: 'wisroomQuitClass', component: quitClass, props: { source: 'wisroom' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/wisroomStudent',
          component: wisroomStudentWrap,
          children: [
            { path: '/', name: 'wisroomStudent', component: wisroomStudent, props: { source: 'wisroom' } },
            { path: 'wisroomCreateStudent', name: 'wisroomCreateStudent', component: wisroomCreateStudent, props: { source: 'wisroom' } },
            { path: 'wisroomStudentDetail', name: 'wisroomStudentDetail', component: wisroomStudentDetail, props: { source: 'wisroom' } },
            { path: 'wisroomStudentAddFee', name: 'wisroomStudentAddFee', component: addFee, props: { source: 'wisroom' } },
            { path: 'wisroomStudentChangeClass', name: 'wisroomStudentChangeClass', component: changeClass, props: { source: 'wisroom' } },
            { path: 'wisroomStudentQuitClass', name: 'wisroomStudentQuitClass', component: quitClass, props: { source: 'wisroom' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/wisroomCoursewareDownload',
          component: coursewareDownloadWrap,
          children: [
            { path: '/', name: 'coursewareDownloadList', component: coursewareDownloadList }
          ],
          beforeEnter: requireAuth
        },
        {
          path: 'prepareLesson',
          component: prepareLessonWrap,
          children: [
            { path: '/', name: 'prepareLesson', component: prepareLesson },
            { path: 'scheduleLesson', name: 'scheduleLesson', component: scheduleLesson },
            { path: 'prepareLessonDetail', name: 'prepareLessonDetail', component: prepareLessonDetail }
          ]
        },
        {
          path: '/enroll',
          component: consultWrap,
          children: [
            { path: '/', name: 'consultList', component: consultList, meta: { title: '招生中心-咨询本列表' } },
            { path: 'editConsult', name: 'consultEdit', component: consultEdit, meta: { title: '招生中心-咨询本编辑' } },
            { path: 'consultDetail', name: 'consultDetail', component: consultDetail, meta: { title: '招生中心-咨询本详情' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/activityList',
          component: activityWrap,
          children: [
            { path: '/', name: 'activityList', component: activityList, meta: { title: '运营活动-活动列表' } },
            { path: 'attendanceList', name: 'attendanceList', component: attendanceList, meta: { title: '运营活动-打卡活动列表' } },
            { path: 'lectureList', name: 'lectureList', component: lectureList, props: { source: 'wisroom' }, meta: { title: '运营活动-讲座活动列表' } },
            { path: 'studentDetail', name: 'studentActivityDetail', component: studentActivityDetail, meta: { title: '运营活动-学生详情' } }
          ]
        },
        {
          path: '/enrollBoard',
          component: enrollBoard,
          children: [
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/renewHistory',
          component: renewHistoryWarp,
          children: [
            { path: '/', name: 'renewHistoryList', component: renewHistoryList, props: { source: 'wisroom' }, meta: { title: '历史续报-续报列表' } },
            { path: '/renewHistoryDetail', name: 'renewHistoryDetail', component: renewHistoryDetail, props: { source: 'wisroom' }, meta: { title: '历史续报-续报详情' } }
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/myGood',
          component: myGoodWrap,
          children: [
            { path: '/', name: 'myGood', component: myGood },
            { path: '/MSClassDetail', name: 'MSClassDetail', component: studentClassroomDetail }, // 即魔法双师的班级详情
            { path: '/MSClassEdit', name: 'MSClassEdit', component: studentClassroomEdit } // 即魔法双师的班级编辑
          ],
          beforeEnter: requireAuth
        },
        {
          path: '/content',
          component: contentWrap,
          children: [
            { path: '/', name: 'contentList', component: contentList }, // 课程(内容)包列表
            { path: '/contentDetail', name: 'contentDetail', component: contentDetail } // 课程(内容)包详情
          ],
          beforeEnter: requireAuth
        }
      ]
    }
  ]
})

export default router
