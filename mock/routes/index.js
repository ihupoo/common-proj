const city = require('./city.js')
const order = require('./order.js')
const table = require('./table.js')
const user = require('./user.js')
const map = require('./map.js')
const role = require('./role.js')
const permission = require('./permission.js')

const router = require('koa-router')()

// 用户api
router.use('/api/user', user.routes(), user.allowedMethods());
router.use('/api/role', role.routes(), role.allowedMethods());
router.use('/api/permission', permission.routes(), permission.allowedMethods());

module.exports = router
