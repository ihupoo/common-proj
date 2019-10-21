const router = require('koa-router')()

const config = require('./config.js')
const login = require('./login.js')
const home = require('./home.js')
const plat = require('./plat.js')
const core = require('./core.js')

// 用户api
router.use('/mock/config', config.routes(), config.allowedMethods());
router.use('/mock/login', login.routes(), login.allowedMethods());
router.use('/mock/home', home.routes(), home.allowedMethods());
router.use('/mock/plat', plat.routes(), plat.allowedMethods());
router.use('/mock/core', core.routes(), core.allowedMethods());

module.exports = router
