const { Router } = require('express')
const { viewsRouter } = require('./views.router.js');
const { productsRouter } = require('./apis/products.router.js');
const { cartsRouter } = require('./apis/carts.router.js');
const { MessageMongo } = require('../daos/mongo/mesaggesDaoMongo.js');
const { sessionRouter } = require('./apis/sessions.router.js') 

const router = Router()
const messages = new MessageMongo();

// definiendo vistas
router.use('/', viewsRouter);
// definiendo API
router.use('/api/products/', productsRouter);
router.use('/api/carts/', cartsRouter);
router.use('/api/sessions', sessionRouter);
router.delete('/api/messages', async (req, res) => {
    await messages.clearMessages();
    res.status(200).json({
        status: 'ok',
    });
})
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error de server');
});

module.exports = router