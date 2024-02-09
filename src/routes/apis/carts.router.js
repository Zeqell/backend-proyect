const { Router } = require('express') 
const CartsController = require('../../controllers/cart.controller.js') 
const router = Router();
const cControl = new CartsController();

// http://localhost:PORT/api/carts/
router
    .get('/', cControl.getCarts)
    .get('/:cid', cControl.getCartById)
    .post('/', cControl.create)
    .post('/:cid/product/:pid', cControl.addProduct)
    .put('/:cid', cControl.updateProducts) //+ body produc
    .delete('/:cid', cControl.removeProducts) //+ body produc
    .put('/:cid/product/:pid', cControl.updateProductQuantity) //+ body quantity
    .delete('/:cid/product/:pid', cControl.removeProductById);

module.exports = router;