<template>
  <div class="staffDetail">
    <div class="breadcrumb cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/staff' }">员工管理</router-link>
        <el-breadcrumb-item>员工详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="staffDetailContent">
      <p>基本信息</p>
      <div class="staffInfo">
        <div class="left">
          <img :src="userData.avatar_url || defaultAvatar" alt="">
        </div>
        <div class="right">
          <div>
            <span>姓名</span>
            <span>{{userData.name}}</span>
          </div>
          <div>
            <span>性别</span>
            <span v-if="userData.gender === 3">未知</span>
            <span v-else>{{userData.gender === 1 ? '男' : '女'}}</span>
          </div>
          <br>
          <div>
            <span>手机号</span>
            <span>{{userData.telephone}}</span>
          </div>
          <div>
            <span>所属校区</span>
            <span>{{userData.campus_name || '无'}}</span>
          </div>
        </div>
      </div>
      <p>角色管理</p>
      <div class="roleInfo">
        <span>管辖校区</span>
        <div>
          <span v-if="userData.role_campus * 1 === 0">全部校区</span>
          <span v-else>{{userData.role_campus_name || '无'}}</span>
        </div>
        <span>角色</span>
        <div class="roleContent">
          <span>{{userData.role_name}}</span>
          <!-- <div class="roleList" v-for="(role, index) in rolesList" :key="index">
            <p>{{role.name}}</p>
            <el-checkbox-group v-model="checkRoleList" @change="getPermissionGroup">
              <el-checkbox v-for="childRole in role.data" :key="childRole.role_name" :label="childRole.role_name"></el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="permissionContent">
            <div class="permissionList" v-for="(permission, index) in permissionList" :key="index">
              <el-checkbox disabled :indeterminate="permission.checked===1" v-model="permission.checkedAll" :label="permission.group_name"></el-checkbox>
              <el-checkbox-group v-model="permission.checkList">
                <el-checkbox disabled v-for="(childPermission,i) in permission.data" :key="i" :label="childPermission.permission_name"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import staffApi from '@/services/internal/staff'
export default {
  data () {
    return {
      userId: this.$route.query.id,
      userData: {},
      checkRoleList: [],
      rolesList: [],
      permissionList: [],
      defaultAvatar: '../../static/img/default_avatar.png'
    }
  },
  created () {
    this.getStaffDetail()
  },
  methods: {
    getStaffDetail () {
      staffApi.getStaffDetail({user_id: this.userId}).then(res => {
        this.rolesList = res.data.permission_role.split(',')
        this.userData = res.data
        this.getPermissionGroup()
      })
    },
    getPermissionGroup () {
      staffApi.getPermissionGroup({role: this.rolesList}).then(res => {
        this.permissionList = res
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/staff') {
      to.meta.keepAlive = true
      this.$destroy()
    } else {
      to.meta.keepAlive = false
      this.$destroy()
    }
    next()
  }
}
</script>
<style lang="less">
.staffDetail {
  text-align: left;
  .staffDetailContent {
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin: 30px 0;
    }
    .staffInfo {
      .left, .right {
        display: inline-block;
        vertical-align: top;
      }
      .left {
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        div {
          display: inline-block;
          width: 300px;
          margin-left: 30px;
          margin-bottom: 20px;
          span {
            display: block;
            font-size: 13px;
            line-height: 20px;
            &:first-of-type {
              color: #7A808D;
              font-size: 12px;
            }
          }
        }
      }
    }
    .roleInfo {
      &>span {
        display: block;
        color: #7A808D;
        font-size: 12px;
        margin-bottom: 5px;
      }
      &>div {
        margin-bottom: 10px;
      }
      .roleContent {
        &>span {
          display: block;
          margin-bottom: 15px;
        }
        .permissionContent {
          font-size: 13px;
          padding: 30px;
          background-color: #F9FBFC;
          .el-checkbox__label {
            font-size: 13px;
            color: #ABB9C6;
          }
          .el-checkbox__input.is-disabled.is-checked {
            .el-checkbox__inner {
              background-color: #ABB9C6;
            }
          }
          .el-checkbox__inner::after {
            color: #FFF;
            border-color: #FFF;
            font-weight: bold;
          }
          .permissionList {
            margin-bottom: 20px;
          }
        }
      }
    }
    .contentInfo{
      .content_tips{
        background: rgba(255,141,65,0.1);
        height:36px;
        border-radius:3px;
        margin: 20px 0px;
        display: flex;
        align-items: center;
        img{
          margin: 0px 15px;
          width: 14px;
          height: 14px;
        }
        span{
          color: rgba(255,141,65,1);
          font-size:13px;
        }
      }
      .content_time{
        font-size:13px;
        font-weight:400;
        color:rgba(122,128,141,1);
        span{
          color: #3E434C;
          font-weight: 500;
        }
      }
      .content_subject{
        margin-top: 30px;
        p{
          font-size:13px;
          font-weight:500;
          color:rgba(122,128,141,1);
          margin-bottom: 10px;
        }
      }
      .content_grades{
        margin-top: 30px;
        p{
          margin-bottom: 10px;
          font-size:13px;
          font-weight:500;
          color:rgba(122,128,141,1);
        }
        .grade_item_style{
          margin-bottom: 6px;
          display: flex;
          >span{
            font-size:13px;
            font-weight:400;
            color:rgba(122,128,141,1);
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
