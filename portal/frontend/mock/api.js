const Koa = require('koa')
const koaBody = require('koa-body')
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
app.use(koaBody())

// routes
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen('8099', () => {
  console.log('监听端口 8099')
})
