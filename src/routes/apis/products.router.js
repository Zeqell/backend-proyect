const { Router } = require('express') 
const ProductsController = require('../../controllers/products.controller.js') 
const router = Router();

const { getProducts, getProductsById, createProduct, updateProductById, deleteProductById, deleteProductByCode, getCategorys } = new ProductsController

// * http://localhost:PORT/api/products
router
    .get("/", getProducts)       
    .get("/:pid", getProductsById)
    .post("/", createProduct)      
    .put("/:pid", updateProductById)  
    .delete("/:pid", deleteProductById)
    .delete("/", deleteProductByCode)
    .get("/group/categorys", getCategorys)

module.exports = router;