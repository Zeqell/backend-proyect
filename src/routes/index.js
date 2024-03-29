const {Router} = require('express')

const productRouter = require('./apis/products.router.js')
const cartRouter = require('./apis/carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionRouter = require('./apis/sessions.router.js')
const mailRouter = require('./apis/mail.router.js')
const pruebasRouter = require('./apis/pruebas.router.js')
const { handleError } = require('../middleware/error/handleError.js')

const router = Router()

router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/', viewsRouter)
router.use('/api/session', sessionRouter)
router.use('/api', mailRouter)
router.use('/pruebas', pruebasRouter)
router.use(handleError)

module.exports = router