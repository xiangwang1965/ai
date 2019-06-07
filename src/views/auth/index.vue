<template>
  <div class="authView">
    <!-- <appHeader is-login></appHeader> -->
   <el-form class="loginForm" ref="form" :model="form" size="mini" @keyup.enter.native="handleLogin">
       <h3 class="title">登录</h3>
       <el-form-item class="label" prop="uid">
        <el-input id="first" type="text" class="form-control" v-model="form.uid" placeholder="账号" :mexlength="11" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item class="label" prop="passwd">
        <el-input type="password" class="form-control" prefix-icon="el-icon-key" v-model="form.passwd" placeholder=密码 ></el-input>
      </el-form-item>
      <el-button type="primary" round icon="el-icon-search" @click="handleLogin">登录</el-button>
      </el-form>
    <toggleSchool v-if="multiple" :users="users" v-on:school="doLogin"></toggleSchool>
  </div>
</template>

<script>
import appHeader from '@/layouts/appHeader'
import authApi from '@/services/auth'
import toggleSchool from './components/toggleSchool'
export default {
  data () {
    return {
      multiple: false,
      users: [],
      token: '',
      form: {
        uid: '',
        passwd: ''
      }
    }
  },
  components: {
    appHeader,
    toggleSchool
  },
  methods: {
    handleLogin () {
      authApi.login(this.form).then(res => {
        if (res.code == '001') {
          res.multiple ? this.doToggle(res) : this.$router.push({ path: '/class' })
        }
      })
    },
    doToggle (res) {
      this.multiple = res.multiple
      this.users = res.data.users
      this.token = res.data.token
    },
    doLogin (data) {
      if (data === true) {
        this.multiple = false
        return false
      }
      data.token = this.token
      authApi.login(data).then(res => {
        if (res.ok) {
          this.$router.push({ path: '/' })
        }
      })
    }
  }
}
</script>

<style scoped>
.authView {
    width:100%;
    height:100%;
    background-image:url('../../../static/img/login_home_bg.png');
    background-size:cover;
    border: 1px solid #979797;
    box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.50);
}
 .loginForm {
     position:absolute;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;

    margin-left: -248px;
    margin-top: -271px;
    left:50%;
    top:50%;
    width: 496px;
    height:542px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,0.60);
    border: 3px solid #4B93F9;
    border-radius: 25px;
    box-shadow: 0 0 25px #cac6c6;
 }
   .title {
    font-size: 33px;
    color: #fff;
    letter-spacing: 20px;
    text-align: center;
    line-height: 48px;
    }
</style>
