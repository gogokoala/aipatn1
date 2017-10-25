/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/api' // 定义所有路由的前缀都已 /cnipr 开头
})
const controllers = require('../controllers')
// Cnipr SDK
// const cnipr = require('../cnipr-sdk')

/*
const {
    auth: { initialize },
    api: { sf1Middleware }
} = cnipr(config)
*/
// 初始化Cnipr OAuth2.0接口
// initialize()

// --- 登录与授权 --- //
// 登录接口 /api/login
router.post('/login', controllers.login)
// 注册接口 /api/register
router.post('/register', controllers.register)

// GET  专利信息概览检索接口 /api/sf1
// router.get('/sf1', sf1Middleware, controllers.cnipr.sf1)

module.exports = router
