const { Router } = require('express')
const viewsRouter = require('./views.router.js')
const productsRoute = require('./apis/products.router.js') 
const messagesRoute = require('./apis/messages.ruter.js') 
const sessionsRoute = require('./apis/sessions.router.js')
const cartRouter = require('./apis/carts.router.js')

const handleResponses = require('../middleware/handleResp.js') 

const router = Router()

// definiendo vistas
router.use('/', viewsRouter);

// definiendo las API
router.use('/api/products/', handleResponses, productsRoute);
router.use('/api/carts/', handleResponses, cartRouter);
router.use('/api/sessions/', handleResponses, sessionsRoute);
router.use('/api/messages', handleResponses, messagesRoute);
router.use('/api/users/', () => {});

router.use('*', (req, res) => res.status(404).send('Not Found'))
router.use((err, req, res, next) => res.status(500).json({message: "Error Server", err}))

module.exports = router;