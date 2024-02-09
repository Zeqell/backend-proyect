const { CartClass, ProductClass } = require('../daos/index.js') 

const productsService = new ProductClass();

class CartsController {
    constructor() {
        this.service = new CartClass();
    }

    getCarts = async (req, res) => {
        try {
            const populate = req.query.populate || true;

            let carts
            if (populate) {
                carts = await this.service.getCartsPopulate();
            } else {
                carts = await this.service.getCarts();
            }

            res.sendSuccess(carts)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    getCartById = async (req, res) => {
        try {
            const cid = req.params.cid;
            const populate = req.query.populate || true;

            let carts
            if (populate) {
                carts = await this.service.getCartsByIdPopulate(cid);
            } else {
                carts = await this.service.getCartsById(cid);
            }

            res.sendSuccess(carts)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    create = async (req, res) => {
        try {
            const resp = await this.service.create();
            res.sendSuccess(resp)
        } catch (err) {
            res.sendCatchError(err)
        }
    }

    addProduct = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');
            const product = await productsService.getProductsById(pid);
            if (!product) return res.sendNotFound('Producto no encontrado');

            const updatedCart = await this.service.increaseProductQuantity(cid, pid);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    decreaseProductQuantityById = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');

            const product = await products.getProductsById(pid);
            if (!product) return res.sendNotFound('Producto no encontrado');

            const updatedCart = await this.service.decreaseProductQuantity(cid, pid);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body * 1

            if (isNaN(quantity)) res.sendUserError("Se ha introducido mal la cantidad")

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');
            const product = await productsService.getProductsById(pid);
            if (!product) return res.sendNotFound('Producto no encontrado');

            const updatedCart = await this.service.updateProductQuantity(cid, pid, quantity);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    removeProductById = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');
            const product = await productsService.getProductsById(pid);
            if (!product) return res.sendNotFound('Producto no encontrado');

            const updatedCart = await this.service.removeProduct(cid, pid);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    updateProducts = async (req, res) => {
        try {
            const { cid } = req.params;
            const newProducts = req.body

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');

            const updatedCart = await this.service.updateCartProducts(cid, newProducts);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }

    removeProducts = async (req, res) => {
        try {
            const { cid } = req.params;

            const cart = await this.service.getCartsById(cid);
            if (!cart) return res.sendNotFound('Carrito no encontrado');

            const updatedCart = await this.service.removeCartProducts(cid);

            res.sendSuccess(updatedCart)
        } catch (error) {
            res.sendCatchError(error)
        }
    }
}

module.exports = CartsController;