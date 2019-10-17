const router = require('koa-router')()

const user = require('./user.js')
const role = require('./role.js')
const login = require('./login.js')
const home = require('./home.js')
const plat = require('./plat.js')
const core = require('./core.js')

// 用户api
router.use('/mock/user', user.routes(), user.allowedMethods());
router.use('/mock/role', role.routes(), role.allowedMethods());
router.use('/mock/login', login.routes(), login.allowedMethods());
router.use('/mock/home', home.routes(), home.allowedMethods());
router.use('/mock/plat', plat.routes(), plat.allowedMethods());
router.use('/mock/core', core.routes(), core.allowedMethods());

module.exports = router
