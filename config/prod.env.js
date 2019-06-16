'use strict'

const PROD_ENV_API_HASH = {
  testing: '"http://edu.wiser-bot.com/school/"',
  staging: '"http://edu.wiser-bot.com/school/"',
  production: '"http://edu.wiser-bot.com/school/"'
}
const PROD_ENV_LOGIN_URL = {
  testing: '"http://edu.wiser-bot.com/school/auth"',
  staging: '"http://edu.wiser-bot.com/school/auth"',
  production: '"http://edu.wiser-bot.com/school/auth"'
}
// 主站地址
const PROD_ENV_WB_MAIN_URL = {
  testing: '"http://edu.wiser-bot.com/school/"',
  staging: '"http://edu.wiser-bot.com/school/"',
  production: '"http://edu.wiser-bot.com/school/"'
}
// 缓存的域
const PROD_ENV_MAIN_URL = {
  testing: '"edu.wiser-bot.com"',
  staging: '"edu.wiser-bot.com"',
  production: '"edu.wiser-bot.com"'
}
module.exports = {
  NODE_ENV: '"production"',
  API_URL: PROD_ENV_API_HASH[process.env.PROD_ENV], // 生产环境 API 地址
  LOGIN_URL: PROD_ENV_LOGIN_URL[process.env.PROD_ENV],
  MAIN_URL: PROD_ENV_MAIN_URL[process.env.PROD_ENV],
  WB_MAIN_URL: PROD_ENV_WB_MAIN_URL[process.env.PROD_ENV],
}
