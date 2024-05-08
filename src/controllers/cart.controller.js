const mongoose = require('mongoose')
const { cartService, userService, productService } = require('../repositories/service.js')
const { ticketModel } = require('../daos/mongo/models/ticket.model.js')
const customError = require('../services/CustomError.js')
const { generateCartErrorInfo, generateCartRemoveErrorInfo  } = require('../services/generateErrorInfo.js')
const { EErrors } = require('../services/enums.js')
const { logger } = require('../util/logger.js')
const { sendMail } = require('../util/sendMail.js')

class CartController {
    constructor(){
        this.cartService = cartService
        this.userService = userService
        this.productService = productService
        this.ticketModel = ticketModel
    }

    getCarts = async (req,res)=>{
        try{
            const allCarts = await this.cartService.getCarts()
            res.json({
                status: 'success',
                payload: allCarts
            })
        }catch(error){
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    createCart = async (req,res)=>{
        try{
            const newCart = await this.cartService.createCart()
            res.json({
                status: 'success',
                payload: newCart
            })
        }catch(error){
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    getCartById = async (req,res)=> {
        try{
            const cid = req.params.cid
            const filteredCart = await this.cartService.getCartById(cid)
            if(filteredCart){
                res.json({
                    status: 'success',
                    payload: filteredCart
                })
            }
            else{
                res.status(404).send("El producto no existe");
            }
        }catch(error){
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    addProductToCart = async (req,res)=>{
        try{
            const { cid, pid} = req.params
            const cartId = new mongoose.Types.ObjectId(cid)
            const productId = new mongoose.Types.ObjectId(pid)
            const productInCart = await this.cartService.addProductToCart(cartId, productId)
            res.json({
                status: 'success',
                payload: productInCart
            })
            
        }catch(error){
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    removeProductFromCart = async (req,res, next) =>{
        try {
            const { cid, pid } = req.params
            if(!cid || !pid){
                customError.createError({
                    name:'Error al eliminar el producto del carrito',
                    cause: generateCartRemoveErrorInfo(cid, pid),
                    message: 'No puede eliminar el producto del carrito',
                    code:EErrors.DATABASES_ERROR
                })
            }
            const result = await this.cartService.removeProductFromCart(cid, pid)

            if (result.success) {
                res.json({
                status: 'success',
                message: 'Producto eliminado del carrito con éxito',
                })
            } else {
                res.status(404).json({
                status: 'error',
                message: 'Producto o carrito no encontrado',
                })
            }
        } catch (error) {
            next(error)
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { products } = req.body
            const result = await this.cartService.updateCart(cid, products)
        
            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Carrito actualizado exitosamente',
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado',
                })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
        
            const result = await this.cartService.updateProductQuantity(cid, pid, quantity)
        
            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Cantidad de producto actualizada correctamente',
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Carrito o producto no encontrado',
                })
            }
        } catch (error) {
            logger.error(error);
            res.status(500).send('Error del servidor')
        }
    }

    deleteAllProducts = async (req, res) => {
        try {
            const { cid } = req.params
            const result = await this.cartService.deleteAllProducts(cid)
        
            if (result.success) {
                return res.json({
                    status: 'success',
                    message: result.message,
                })
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: result.message,
                })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    addProductToCart2 = async (req, res, next) => {
        try {
            console.log("Entre al add");
            const { pid } = req.params;
            console.log("PID:", pid);
            const {user} = req.body
            console.log("Soy el user:", user);
            const cId = user.cart;
            console.log("Carrito ID:", cId);
            
            if (user.role === 'premium') {
                console.log("Soy premium");
                const productInfo = await this.productService.getProductById(pid);
                
                if (!productInfo) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Producto no encontrado',
                    });
                }
    
                if (productInfo && productInfo.owner && productInfo.owner.toString() === user._id.toString()) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'No autorizado para agregar este producto a su carrito',
                    });
                }
            }
            
            await this.cartService.addProductToCart(cId, pid);
            res.json({
                status: 'success',
                message: 'Producto agregado al carrito exitosamente',
            });
        } catch (error) {
            console.error("Error en addProductToCart2:", error);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    }

    purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { user } = req.body
            console.log("Entree al purchase ", cid)
            console.log("Compra iniciado por el usuario:", user)
            const cart = await this.cartService.getCartById(cid)
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
            }
            const productUpdates = []
            const productsNotPurchased = []
            let totalAmount = 0
            const purchasedProducts = []
            for (const item of cart) {
                const productId = item.product.toString()
                const productArray = await this.productService.getProductById(productId)
                const product = productArray[0]
                const productPrice = product.price
                if (!product) {
                    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
                }
                if (product.stock < item.quantity) {
                    productsNotPurchased.push(item.product)
                    continue
                }
                product.stock -= item.quantity
                logger.info(product)
                console.log(product)
                productUpdates.push(this.productService.updateProduct(productId,
                    product.title, 
                    product.description, 
                    product.price, 
                    product.thumbnail, 
                    product.code, 
                    product.stock, 
                    product.status, 
                    product.category
                ))

                const quantity = item.quantity
                totalAmount += (quantity * productPrice)

                purchasedProducts.push({
                    title: product.title,
                    quantity,
                    price: product.price
                })
            }

            logger.info(totalAmount)
            const userEmail = user.email
            console.log(userEmail)
            const ticketData = {
                code: 'TICKET-' + Date.now().toString(36).toUpperCase(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userEmail
            }
    
            const ticket = new this.ticketModel(ticketData)
            await ticket.save()

            if (productsNotPurchased.length > 0) {
                cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.product))
                await cart.save()
            } else {
                await this.cartService.deleteAllProducts(cid)
                logger.info('----------Carrito vacio----------')
            }

            const emailSubject = `Detalles de la compra - Ticket ${ticketData.code}`;
            const emailBody = `
                <p>Gracias por su compra, ${user.first_name} ${user.last_name}!</p>
                <p>Detalles de tu ticket:</p>
                <ul>
                    <li><strong>Ticket Code:</strong> ${ticketData.code}</li>
                    <li><strong>Fecha de compra:</strong> ${ticketData.purchase_datetime}</li>
                    <li><strong>Cantidad total:</strong> ${ticketData.amount.toFixed(2)}</li>
                </ul>
                <p>Productos comprados:</p>
                <ul>
                    ${purchasedProducts.map(product => `
                        <li>
                            <strong>${product.title}</strong> - Quantity: ${product.quantity}, Price: $${product.price.toFixed(2)}
                        </li>
                    `).join('')}
                </ul>
            `
            await sendEmail(user.email, emailSubject, emailBody)

            try {
                await Promise.all(productUpdates)
                return res.status(200).json({ status: 'success', message: 'Stock actualizado exitosamente' })
            } catch (error) {
                return res.status(500).json({ status: 'error', message: 'Failed to update el stock' })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).json({ status: 'error', message: 'Error del servidor' })
        }
    }

}

module.exports = CartController