const { Router } = require('express')
const ViewsController = require('../controllers/views.controller.js')
const { isAdmin, isUser } = require('../middleware/handleResp.js')
const { authenticateUser } = require('../middleware/handlePasp.js')


const router = Router()

const {
    home,
    realTimeProducts,
    chat,
    products,
    productsDetails,
    login,
    register,
    shoppingCart
} = new ViewsController()

router.get('/', home)

router.get('/realTimeProducts', isAdmin, realTimeProducts)

router.get('/chat',isUser , chat)

router.get('/products', products)

router.get('/products/details/:pid', productsDetails)

router.get('/login', login)

router.get('/register', register)

router.get('/cart', authenticateUser, shoppingCart)

module.exports = router