const router = require('koa-router')()

const user = require('./user.js')
const role = require('./role.js')
const permission = require('./permission.js')


// 用户api
router.use('/api/user', user.routes(), user.allowedMethods());
router.use('/api/role', role.routes(), role.allowedMethods());
router.use('/api/permission', permission.routes(), permission.allowedMethods());

module.exports = router
