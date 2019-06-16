'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
console.log()
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_URL: '"http://localhost:8080"',
    LOGIN_URL: '"http://localhost:8080/auth/login"', // 增加‘/login’和主站保持一致
    MAIN_URL: '"localhost"',
    WB_MAIN_URL: '"http://localhost:8080"',
    IMS_URL: '"http://localhost:8080"'
  })
