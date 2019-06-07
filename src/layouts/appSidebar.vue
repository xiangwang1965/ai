<template>
  <div class="appSideWrap" v-scrollBar>
    <el-aside class='appSidebar' width='230px' v-scrollBar>
      <el-menu
        ref="sideBar"
        class="cac-shadow"
        width="230px"
        mode='vertical'
        :default-active='defaultActive'
        text-color='#FFFFFF'
        text-align='left'
        :router='true'
        unique-opened
        @select='handleSelect'
        @close="closeSubMenu">
        <el-submenu v-if="item.children && hasRole(item)" v-for="item in liveList" style="background-color:transparent;" :key="item.path" :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}{{item.hidden}}</span>
            </template>
            <el-menu-item v-if="hasRole(child)" style="background-color:transparent;padding-left:36px;margin-left:-10px;" v-for="child in item.children" :key="child.path" :index="child.path" @click.native.stop="go(child)">
              <!--{{child.title}}-->
              <span v-if="!child.external">{{ child.title }}</span>
              <span class="goItem" v-if="child.external" @click.stop="go(child)">{{ child.title }}</span>
            </el-menu-item>
        </el-submenu>
        <template v-else>
          <el-menu-item v-if="hasRole(item) && !item.children" :key="item.path" :index="item.path" style="background-color:transparent;opacity:.6;padding-left:20px;margin-left:0;border:none;" @click="closeSubMenu">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <!-- 侧栏下部纹理 -->
    </el-aside>
  </div>
</template>
<script>
import authUtils from '@/services/auth/utils'
import eventHub from '@/utils/eventHub'
import {IMS_URL} from '@/config'
export default {
  data () {
    return {
      menuList: [],
      logoImg: '../../static/img/logo-white.png',
      liveList: [
        {
          path: '/reception',
          title: '前台业务',
          specialRole: ['1', '2', '3', '4', '5', '6', '7', '8'],
          icon: 'icon-cac-reception',
          role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管', '前台'],
          children: [
            { path: '/reception', title: '业务办理', role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管', '前台'] },
            { path: '/order', title: '订单', specialRole: ['1'], role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管', '前台'], permissions: ['enroll_charge'] },
            { path: '/checkBill', title: '账单核对', specialRole: ['1'], role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管', '前台'], permissions: ['enroll_charge'] }
          ]
        },
        {
          path: '/platformCourse',
          specialRole: ['5'],
          title: '双师平台',
          icon: 'icon-cac-platform',
          role: ['校长', '校区主管', '双师平台-校区主管', '双师主管', '双师主讲'],
          children: [
            { path: '/platformCourse', title: '课程', role: ['校长', '校区主管', '双师平台-校区主管', '双师主管'] },
            { path: '/platformClass', title: '主讲班', role: ['校长', '校区主管', '双师平台-校区主管', '双师主管'] },
            { path: '/platformStudent', title: '学生班', role: ['校长', '校区主管', '双师平台-校区主管', '双师主管'] },
            { path: '/platformTeacher', title: '主讲管理', role: ['校长', '校区主管', '双师平台-校区主管', '双师主管'] },
            { path: '/liveClassroom', title: '直播间管理', role: ['校长', '校区主管', '双师平台-校区主管', '双师主管'] },
            { path: IMS_URL, title: '双师互动配置', role: ['校长', '校区主管', '双师主管', '双师主讲'], external: true, scope: 1 }
          ]
        },
        {
          path: '/magic',
          specialRole: ['1'],
          title: '魔法双师',
          icon: 'icon-cac-magic',
          role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'],
          children: [
            { path: '/studentClassroom', title: '学生班级管理', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'] },
            { path: '/live', title: '我的双师班级', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'] },
            { path: '/prepareLesson', title: '我的主辅备课', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'] }
            // { path: '/teachersubsidy', title: '辅导老师激励', role: ['校长', '双师管理', '教务'] }
          ]
        },
        {
          path: '/wisroom',
          title: 'AI双师',
          specialRole: ['2', '7'],
          icon: 'icon-cac-wisroom',
          role: ['校长', '校区主管', 'AI主管'],
          children: [
            { path: '/wisroomCourseWare', title: '我的AI课程', role: ['校长', 'AI主管', '校区主管'] },
            { path: '/wisroomClass', title: '我的AI班级', role: ['校长', 'AI主管', '校区主管'] },
            { path: '/wisroomCoursewareDownload', title: '课件下载', role: ['校长', 'AI主管', '校区主管'] }
          ]
        },
        {
          path: '/teaching',
          title: '教务中心',
          specialRole: ['1', '2', '3', '4', '6', '7', '8'],
          specialViewAI: true,
          icon: 'icon-cac-education',
          role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管', '双师主管', '魔法双师主管', 'AI主管', '教务', '面授主讲'],
          children: [
            { path: '/content', title: '我的课程包', role: ['校长', '校区主管', '教务', '双师平台-校区主管', '魔法双师-校区主管'], specialRole: ['3', '4', '6'] },
            { path: '/course', title: '课程', role: ['校长', '校区主管', '教务', '双师平台-校区主管', '魔法双师-校区主管'], specialRole: ['3', '4', '6'] },
            { path: '/class', title: '班级管理', role: ['校长', '校区主管', '教务', '双师平台-校区主管', '魔法双师-校区主管'], specialRole: ['3', '4', '6'] },
            { path: '/student', title: '学生管理', specialView: true, role: ['校长', '校区主管', '教务', '双师平台-校区主管', '魔法双师-校区主管', '双师主管', '魔法双师主管', 'AI主管'] },
            { path: IMS_URL, specialRole: ['3', '4', '6', '8'], title: '面授互动配置', role: ['校长', '校区主管', '面授主讲'], external: true, scope: 2 }
          ]
        },
        {
          path: '/myGood',
          title: '商品管理',
          permissions: ['enroll_charge'],
          specialRole: ['1'],
          icon: 'icon-cac-good',
          role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'],
          children: [
            { path: '/myGood', title: '商品', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管'], meta: { keepAlive: true } }
          ]
        },
        {
          path: '/staff',
          title: '基础设置',
          specialRole: ['1', '2', '3', '4', '5', '6', '7', '8'],
          icon: 'icon-cac-internal',
          role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管'],
          children: [
            { path: '/staff', title: '员工管理', role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管'] },
            { path: '/classroom', title: '教室管理', role: ['校长', '校区主管', '双师平台-校区主管', '魔法双师-校区主管'], meta: { keepAlive: true } },
            { path: '/campus', title: '校区管理', role: ['校长'], meta: { keepAlive: true } }
            // { path: '/organization', title: '机构信息', role: ['校长', '校区主管', '魔法双师-校区主管'], specialRole: ['1', '2', '3', '4'], meta: { keepAlive: true } }
          ]
        },
        {
          path: '/enroll',
          title: '招生中心',
          specialRole: ['1', '3', '4'],
          icon: 'icon-cac-enroll',
          role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管', '教务', '前台', '招生'],
          children: [
            { path: '/enroll', title: '咨询本', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管', '教务', '前台', '招生'] },
            { path: '/activityList', title: '运营活动管理', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管', '招生'] },
            { path: '/enrollBoard', title: '招生看板', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管', '招生'] },
            { path: '/renewHistory', title: '历史续报', role: ['校长', '校区主管', '魔法双师-校区主管', '魔法双师主管', '招生'] }
          ]
        }
      ],
      routes: ['/class', '/student', '/campus', '/permission', '/live', '/teachersubsidy', '/course', '/platformCourse', '/platformClass', '/platformStudent', '/platformTeacher', '/platformLiveClassroom', '/teacherClass', '/studentClassroom', '/liveClassroom', '/classroom', '/teacher', '/myDoubleClass', '/myDoubleClassDetail', '/reception', '/staff', '/studentClassroomDetail', '/wisroom', '/wisroomCourse', '/wisroomClass', '/wisroomCourseWare', '/wisroomStudent', '/prepareLesson', '/enroll', '/activityList', '/wisroomCoursewareDownload', '/enrollBoard', '/renewHistory', '/order', '/checkBill', '/organization', '/myGood', '/content'],
      is_live: 1,
      temp: [],
      faceTeachingBrand: ['MS', '自营双师']
    }
  },
  computed: {
    defaultActive () {
      let index = this.routes.indexOf('/' + this.$route.path.split('/')[1])
      if (index !== -1) {
        return this.routes[index]
      }
      return ''
    },
    hasFaceTeaching () {
      let num = 0
      this.faceTeachingBrand.map((v) => {
        if (authUtils.getUser().brands.indexOf(v) >= 0) {
          num++
        }
      })
      if (num === 0) {
        return false
      }
      return true
    }
  },
  created () {
    this.temp = this.menuList
    // this.getUser()
    this.handleSelect(this.$route.path)
    eventHub.$on('updateUser', this.getUser)
  },
  methods: {
    handleSelect (path) {
    },
    getUser () {
      // this.is_live = authUtils.getUser() && authUtils.getUser().is_live
      // this.menuList = this.is_live ? this.liveList : this.tofaceList
      // 判断是否是平台双师1或魔法双师0
      this.is_self_live = authUtils.getUser() && authUtils.getUser().is_self_live
      this.menuList = []
      this.menuList = this.is_self_live ? this.platformList : this.liveList
      // 如果third_part存在，使用对应的第三方侧栏
      if (authUtils.getUser().third_part) {
        this.menuList = this[authUtils.getUser().third_part + 'List']
      }
    },
    hasRole (item) {
      // 根据权限展示
      if (authUtils.getUser().role_name) {
        if (authUtils.getUser().brandList) {
          var brandList = JSON.parse(authUtils.getUser().brandList)
          var brandNameList = []
          var cooperationsList = []
          brandList.map((v) => {
            brandNameList.push(v.name)
            v.cooperations.map((o) => {
              cooperationsList.push(o.cooperation_id)
            })
          })
          if (item.specialViewAI) {
            if (authUtils.getUser().permissions.indexOf('enroll_charge') >= 0) {
              if (brandNameList.length === 1 && brandNameList.indexOf('WISROOM') >= 0) {
                return false
              } else if (cooperationsList.length === 1 && (cooperationsList.indexOf(1) >= 0 || cooperationsList.indexOf(2) >= 0)) {
                return false
              } else {
                let useRoleList = ['校长', '校区主管', '教务', '双师平台-校区主管', '魔法双师-校区主管', '面授主讲']
                let num = 0
                for (let i = 0; i < useRoleList.length; i++) {
                  if (authUtils.getUser().role_name.split(',').indexOf(useRoleList[i]) >= 0) {
                    num++
                  }
                }
                if (num === 0) {
                  return false
                }
              }
            }
          }
          if (item.specialView) {
            if (authUtils.getUser().permissions.indexOf('enroll_charge') >= 0) {
              return false
            }
          }
          if (item.specialRole) {
            var numRole = 0
            for (let j = 0; j <= item.specialRole.length; j++) {
              if (cooperationsList.indexOf(item.specialRole[j] * 1) >= 0) {
                numRole++
              }
            }
            if (numRole > 0) {
              if (item.permissions) {
                for (let i = 0; i < item.permissions.length; i++) {
                  if (authUtils.getUser().permissions.indexOf(item.permissions[i]) >= 0) {
                    for (let i = 0; i <= item.role.length; i++) {
                      if (authUtils.getUser().role_name.split(',').indexOf(item.role[i]) >= 0) {
                        return true
                      }
                    }
                  } else {
                    return false
                  }
                }
              }
              for (let k = 0; k <= item.role.length; k++) {
                if (authUtils.getUser().role_name.split(',').indexOf(item.role[k]) >= 0) {
                  return true
                }
              }
            } else {
              return false
            }
          }
          if (item.permissions) {
            for (let i = 0; i < item.permissions.length; i++) {
              if (authUtils.getUser().permissions.indexOf(item.permissions[i]) >= 0) {
                for (let i = 0; i <= item.role.length; i++) {
                  if (authUtils.getUser().role_name.split(',').indexOf(item.role[i]) >= 0) {
                    return true
                  }
                }
              } else {
                return false
              }
            }
          }
          for (let i = 0; i <= item.role.length; i++) {
            if (authUtils.getUser().role_name.split(',').indexOf(item.role[i]) >= 0) {
              return true
            }
          }
        }
      }
    },
    closeSubMenu () {
      let arr = ['/platformCourse', '/magic', '/teaching', '/staff', '/enroll']
      arr.map((v, index) => {
        this.$refs.sideBar.close(v)
      })
    },
    go (child) {
      if (child.external) {
        window.open(child.path + '?token=' + authUtils.getToken() + '&source=2' + '&scope=' + child.scope)
      }
    }
  }
}
</script>

<style lang="less">
.appSideWrap{
  position: relative;
  width: 230px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .logo{
    width: 118px;
    height: 18px;
    margin-top: 38px;
  }
  .appSidebar {
    position: relative;
    text-align: left;
    margin-top: 136px;
    left: 0;
    padding-left: 20px;
  }
  .appSidebar > .el-menu {
    width: 100%;
    border-right: none;
    height:100%;
    background-color: transparent !important;
    box-shadow: none;
  }
  .appSidebar > .el-menu  .el-menu{
    background-color: transparent !important;
  }
  .appSidebar .el-menu-item {
    margin-left: 20px;
    background-color: transparent !important;
    font-family:PingFangSC-Regular;
    font-weight:400;
    border-left: 3px solid transparent;
    opacity: .6;
    position: relative;
  }
  .appSidebar .el-menu-item:hover {
    /* color: #ffffff !important; */
  }
  .appSidebar .el-submenu{
    opacity: .6;
  }
  .appSidebar .el-submenu.is-opened {
    opacity: 1;
  }
  .appSidebar .el-submenu__title:hover {
    background-color: transparent !important;
    opacity: 1;
  }
  .el-menu-item.is-active {
    color: #FFF !important;
    opacity: 1;
    background-color: #110B61 !important;
    border-radius: 25px 0 0 25px;
  }
  .appSidebar > .el-menu > .el-menu-item {
    font-size: 16px;
  }
  .appSidebar > .el-menu > .el-menu-item.is-active {
    color: #FFF !important;
    background-color: #110B61 !important;
    border-radius: 25px 0 0 25px;
    opacity: 1 !important;
  }
  .appSidebar > .el-menu .el-menu > .el-menu-item::before {
    display: inline-block;
    content: " ";
    height: 6px;
    width: 6px;
    margin-right: 20px;
    background-image: url('../../static/img/item_icon.png');
    background-size: 100%;
  }
  .appSidebar > .el-menu .el-menu > .el-menu-item.is-active::before {
    display: inline-block;
    content: " ";
    height: 6px;
    width: 6px;
    background-image: url('../../static/img/item_icon_active.png');
    background-size: 100%;
  }
  .el-aside {
    background-color: transparent;
  }
  .el-aside > .el-menu > li{
    border-bottom: none;
  }
  .goItem{
    display: inline-block;
    width: 100%;
    position: absolute;
    left: 0px;
    padding-left: 62px;
  }

  .el-submenu>.el-submenu__title .el-submenu__icon-arrow{
    background: #3d396d;
    border-radius: 100%;
    padding: 2px;
  }
  /*菜单展开*/
  .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
    background: #3d396d;
    border-radius: 100%;
    padding: 2px;
  }
  .appSidebarWrap .ps__rail-y {
    width: 6px;
    border-radius: 3px;
    background-color: #D8D8D8;
  }
  .appSidebarWrap .ps__rail-y:hover .ps__thumb-y {
    width: 6px;
    border-radius: 3px;
  }
  .appSidebarWrap .ps__rail-y .ps__thumb-y {
    right: 0;
  }
  .ps__rail-y {
    width: 6px;
    .ps__thumb-y {
      width: 6px;
      right: 0;
    }
  }
}
</style>
