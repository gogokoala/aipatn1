const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('aipath-server')

const config = require('./config')()
// const options = require('./config/config.json')

const response = require('./middlewares/response')
const bodyParser = require('./middlewares/bodyparser')

const jwtKoa = require('koa-jwt')

// 加载配置参数
debug('config: %o', config)

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// Middleware below this line is only reached if JWT token is valid
// unless the URL starts with '/api/login, /api/register'
const jwtSecret = config.jwtSecret
app.use(jwtKoa({ secret: jwtSecret }).unless({
    path: [/^\/api\/login/, /^\/api\/register/]
}))

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
