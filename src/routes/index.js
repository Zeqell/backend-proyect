const { Router } = require('express')
const viewsRouter = require('./views.router.js')
const { productsRoute, sessionsRoute  } = require('./apis/index.js')
const UsersCRouter = require('./apis/usersClass.router.js')

const router = Router()
const usersRouter = new UsersCRouter();

// definiendo vistas
router.use('/', viewsRouter);

// definiendo las API
router.use('/api/products/', productsRoute);
router.use('/api/carts/', ()=>{});

router.use('/api/sessions/', sessionsRoute);
router.delete('/api/messages', ()=>{});

router.use('/api/users/', usersRouter.getRouter());

module.exports = router;