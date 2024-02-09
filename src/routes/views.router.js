const { Router } = require('express')
const handleResponses = require('../middleware/handleResp.js')
const { handleAuthFront } = require('../middleware/handlePasp.js')
const ViewsController = require('../controllers/views.controller.js')
const router = Router();
const vControl = new ViewsController()

// http://localhost:PORT/
router
    .get("/", handleAuthFront(['PUBLIC']), handleResponses, vControl.login)
    .get("/register", handleAuthFront(['PUBLIC']), handleResponses, vControl.register)
    .get("/products", handleAuthFront(['PUBLIC']), handleResponses, vControl.products)
    .get("/products/:pid", handleAuthFront(['PUBLIC']), handleResponses, vControl.productById)
    .get("/cart", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, vControl.cart)
    .get("/realTimeProducts", handleAuthFront(['USER_PREMIUM']), handleResponses, vControl.realTimeProducts)
    .get("/chat", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, vControl.chat)
    .get('/user', handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, vControl.user);

module.exports = router