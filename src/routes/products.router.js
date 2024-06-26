const { Router } = require('express')
const ProdcutsController = require('../controllers/products.controller.js')
const { isAdminOrPremium } = require('../middleware/roleVerification.js')

const router = Router()
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = new ProdcutsController()

router
    .get('/', getProducts)
    .get('/:pid', getProductById)
    .post('/', addProduct)
    .put('/:pid', updateProduct)
    .delete('/:pid', isAdminOrPremium, deleteProduct)


module.exports = router