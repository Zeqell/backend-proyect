const {Router} = require('express')

const paymentsRouter = require('./payments.router.js')
const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionRouter = require('./sessions.router.js')
const mailRouter = require('./mail.router.js')
const pruebasRouter = require('./pruebas.router.js')
const { handleError } = require('../middleware/error/handleError.js')

const router = Router()

router.use('/payments', paymentsRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/', viewsRouter)
router.use('/api/session', sessionRouter)
router.use('/api', mailRouter)
router.use('/pruebas', pruebasRouter)
router.use(handleError)

module.exports = router