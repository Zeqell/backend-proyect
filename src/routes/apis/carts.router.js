const { Router } = require('express')
const CartController = require('../../controllers/cart.controller.js')
const { authenticateUser, isAuthenticated } = require('../../middleware/handlePasp.js')

const router = Router()
const {
    getCarts,
    getCartById,
    createCart,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProducts,
    addProductToCart2,
    purchaseCart,
} = new CartController()

router
    .get('/', getCarts)
    .post('/', createCart)
    .get('/:cid', getCartById)
    .post('/:cid/product/:pid', addProductToCart)
    .delete('/:cid/product/:pid', removeProductFromCart)
    .put('/:cid', updateCart)
    .put('/:cid/products/:pid', updateProductQuantity)
    .delete('/:cid', deleteAllProducts)
    .post('/:pid', isAuthenticated, addProductToCart2)
    .post('/:cid/purchase', isAuthenticated, purchaseCart)


module.exports = router