<template>
  <div class="authView">
    <appHeader is-login></appHeader>
    <el-form class="loginForm" size="mini" @keyup.enter.native="handleLogin">
      <el-form-item prop="telephone" label="用户名">
        <el-input id="first" type="text" class="form-control" v-model="form.telephone" placeholder="usename" :mexlength="11"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" class="form-control" v-model="form.password" placeholder="password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleLogin">登录</el-button>
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
        telephone: '',
        password: ''
      }
    }
  },
  components: {
    appHeader,
    toggleSchool
  },
  methods: {
    handleLogin () {
      authApi.auth(this.form).then(res => {
        if (res.ok) {
          res.multiple ? this.doToggle(res) : this.$router.push({ path: '/' })
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
.loginForm {
  width: 500px;
  margin: 100px auto;
}
</style>
