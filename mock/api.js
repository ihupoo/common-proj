const Koa = require('koa')
const koaBody = require('koa-body')
const bodyparser = require('koa-bodyparser')
const app = new Koa()
const cors = require('koa2-cors')
const router = require('./routes/index.js')

// 处理跨域问题
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

// middlewares
// 处理原生的node还是koa都无法直接解析request的body
app.use(koaBody()).use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

// routes
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen('8090', () => {
  console.log('监听端口 8090')
})
