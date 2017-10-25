const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('aipath-server')

const configs = require('./config')()

const response = require('./middlewares/response')
const bodyParser = require('./middlewares/bodyparser')

const jwtKoa = require('koa-jwt')

debug('using config: %o', configs)

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// Middleware below this line is only reached if JWT token is valid
// unless the URL starts with '/api/login, /api/register'
const jwtSecret = configs.jwtSecret
app.use(jwtKoa({ secret: jwtSecret }).unless({
    path: [/^\/api\/login/, /^\/api\/register/]
}))

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(configs.port, () => debug(`listening on port ${configs.port}`))
