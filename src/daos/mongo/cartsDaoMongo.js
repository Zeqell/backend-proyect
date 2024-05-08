const { logger } = require("../../util/logger.js");
const { cartModel } = require("./models/carts.model.js")

class cartDaoMongo {
    constructor(){
        this.model = cartModel
    }

    async create() {
        const newCart = new this.model({
            products: [],
        });

        await newCart.save()

        return newCart.toObject()
    }

    async get() {
        const carts = await this.model.find()
        return carts
    }

    async getById(cid) {
        console.log("cart id en el dao:", cid)
        const cart = await this.model.findOne({ _id: cid }).lean()
        console.log("Carrito exitoso", cart)
        if (cart) {
            return cart.products
        } else {
            logger.error("Este carrito no existe")
            return { cart: { products: [] } }
        }
    }

    async add(cId, pid) {
        console.log("datpssss", cId, pid)
        let cart = await this.model.findOne({ _id: cId })
            
        if (!cart) {
            const newCart = await this.model.create({
                products: [],
            })
            cart = newCart
        }

        const existingProductIndex = cart.products.findIndex((item) => item.product.equals(pid))

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({
            product: pid,
            quantity: 1,
            })
        }

        await cart.save()

        logger.info("Producto agregado al carrito exitosamente")
        return {
            success: true,
            message: 'Producto agregado al carrito exitosamente',
        }
    }

    async remove(cartId, productId) {
        const cart = await this.model.findOne({ _id: cartId })
        
        if (!cart) {
            return { success: false }
        }
        
        cart.products = cart.products.filter(
            (product) => product.product.toString() !== productId
        )
        
        await cart.save()
        
        return { success: true }
        
    }

    async update(cartId, newProduct) {
        const cart = await this.model.findOne({ _id: cartId })

        if(!cart){
            return { success: false}
        }

        cart.products = newProduct

        await cart.save()

        return { success: true }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        const cart = await this.model.findOne({ _id: cartId })

        if (!cart) {
            return { success: false }
        }

        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        )

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity

            await cart.save()

            return { success: true }
        } else {
            return { success: false }
        }
    }

    async deleteAll(cartId) {
        const cart = await this.model.findOne({ _id: cartId })

        if (!cart) {
            return { success: false, message: 'Carrito no encontrado' }
        }
    
        cart.products = []
    
        await cart.save()
    
        return { success: true, message: 'Todos los productos eliminados del carrito.' }
    }


}

module.exports = cartDaoMongo