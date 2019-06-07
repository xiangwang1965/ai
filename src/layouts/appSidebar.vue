<template>
  <div class="appSideWrap" v-scrollBar>
    <el-aside class='appSidebar' width='362' v-scrollBar>
      <el-menu
        ref="sideBar"
        class="cac-shadow"
        width="230px"
        mode='vertical'
        :default-active='defaultActive'
        text-color='#FFFFFF'
        text-align='left'
        :router='true'
        unique-opened>
        <el-menu-item v-for="item in liveList" style="background-color:transparent;" @click.stop.native="go(item)" :key="item.path" :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}{{item.hidden}}</span>
            </template>
        </el-menu-item>
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
          path: '/class',
          title: '班级管理',
          icon: 'icon-cac-reception',
          child:[
            {path:'/',title:'classroom'}
          ]
        },
        {
          path: '/teacher',
          title: '教师档案',
          icon: 'icon-cac-platform'
        },
        {
          path: '/buy',
          title: '购买激活码',
          icon: 'icon-cac-magic'
        },
        {
          path: '/course',
          title: '课程订单',
          icon: 'icon-cac-wisroom'
        }
      ],
      routes: ['/class', '/teacher', '/buy', '/course','/classroom'],
      is_live: 1,
      temp: []
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
    //this.handleSelect(this.$route.path)
    eventHub.$on('updateUser', this.getUser)
  },
  methods: {
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
    go (item) {
      
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
  .el-menu-item.is-active {
    color: #FFF !important;
    opacity: 1;
    border-radius: 25px 0 0 25px;
  }
  .appSidebar > .el-menu > .el-menu-item {
    font-size: 16px;
  }
  .appSidebar > .el-menu > .el-menu-item.is-active {
    color: #FFF !important;
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
