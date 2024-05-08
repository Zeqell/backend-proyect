const { productService, userService, cartService } = require('../repositories/service.js')
const { logger } = require('../util/logger.js')
const { sendPasswordResetEmail, verifyResetToken } = require('../util/resetPassword.js')
const { createHash, isValidPassword } = require('../util/passwords.js')
const { error } = require('winston')

class ViewsController {
    constructor(){
        this.productViewService = productService
        this.userViewService = userService
        this.cartViewService = cartService
    }

    home = async (req, res) => {
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            const user = await this.userViewService.getUserBy({ _id: userId })
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            
            res.render('home', {
                title: 'Home',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            logger.error(err)
            res.status(500).send({message:'Error del servidor'})
        }
    }

    realTimeProducts = async (req, res) => {
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            const user = await this.userViewService.getUserBy({ _id: userId })
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            
            res.render('realTimeProducts', {
                title: 'Real Time',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            logger.error(err)
            res.status(500).send({message:'Error del servidor'})
        }
    }

    chat = async (req,res) => {
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await this.userViewService.getUserBy({ _id: userId })
        try{
            res.render('chat', {
            title: "Chat",
            user,
            })
        }catch(err){
            logger.error(err)
            res.status(500).send({message:'Error del servidor'})
        }
    }

    products = async (req,res) =>{
        try{
            const { limit, pageNumber, sort, query } = req.query
            const parsedLimit = limit ? parseInt(limit, 10) : 10
            const userId = req.session && req.session.user ? req.session.user.user : null
            
            const user = await this.userViewService.getUserBy({ _id: userId })
            
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await this.productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
            
            res.render('productsView', {
                title: 'Products View',
                user,
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            })
        }catch(err){
            logger.error(err)
            res.status(500).send({message:'Error del servidor'})
        }
    }

    productsDetails = async (req,res) =>{
        try{
            
            const pid = req.params.pid
            
            const filteredProduct = await this.productViewService.getProductById(pid)
            
            if(filteredProduct){
                res.render('details', {
                    title: 'Product Detail',
                    filteredProduct
                })
            }
            else{
                res.status(404).send("El producto no existe")
            }
        }catch(error){
            logger.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    login = async (req,res) =>{
        res.render('login')
    }

    register = async (req,res) =>{
        res.render('register')
    }

    shoppingCart = async(req, res) => {
        try {
            
            const userId = req.session && req.session.user ? req.session.user.user : null
            if (!userId) {
                return res.status(400).send('Sesión no iniciada')
            }

            const user = await this.userViewService.getUserBy({ _id: userId })
            console.log("usuario en cart: ", user)
            const cartId = user.cart
            console.log("carrtido del user: ", cartId)
            if (!cartId) {
                return res.status(400).send('El usuario no tiene un carrito')
            }

            const cart = await this.cartViewService.getCartById(cartId)
            console.log('Cart:', cart)

            const productDetailsPromises = cart.map(async item => {
                const productId = item.product.toString()
                const productDetailArray = await this.productViewService.getProductById(productId)
                const productDetail = productDetailArray[0]
                return { productDetail, quantity: item.quantity }
            })
            
            const productsWithQuantities = await Promise.all(productDetailsPromises)
            res.json({
                title: 'Shopping Cart',
                cartId,
                productsWithQuantities,
            })
        }
        catch(err){
            logger.error(err)
            res.status(500).send('Error del servidor')
        }
    }

    resetPasswordView = async(req, res) => {
        res.render('resetPassword')
    }

    sendResetEmail = async (req, res) => {
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await this.userViewService.getUserBy({ _id: userId })
        logger.info(user._id)
        logger.info(user.email)
        try {
            
            await sendPasswordResetEmail(user._id, user.email)
            res.status(200).json({ message: 'Correo electrónico enviado correctamente' })
        } catch (error) {
            
            res.status(500).json({ error: 'Error al enviar correo electrónico' })
        }
    }

    resetPassword = async (req, res) => {
        const { token } = req.query
        const { newPassword, confirmPassword } = req.body
        
        if (!token) {
            return res.status(400).json({ error: 'Token es requerido' })
        }
    
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' })
        }

        try {
            const decodedToken = verifyResetToken(token)
            if (!decodedToken) {
                return res.status(400).json({ error: 'El token no es válido o ha caducado' })
            }
            const user = await this.userViewService.getUserBy(decodedToken.userId)
            if (!user) {
                return res.status(400).json({ error: 'Usuario no encontrado' })
            }
            if (isValidPassword(newPassword, { password: user.password })) {
                return res.status(400).json({ error: 'No puedes usar la misma contraseña' })
            }
            await this.userViewService.updateUserPassword(decodedToken.userId, createHash(newPassword))
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' })
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la contraseña' })
        }
    }

    resetPasswordViewToken = async(req, res) => {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({ error: 'Se requiere token' })
        }
        
        res.render('resetPasswordToken', { token })
    }

    adminView = async (req, res) => {
        try {
            const users = await this.userViewService.getUsers()

            res.render('adminView', { 
                title: 'Users',
                users 
            })
        } catch (error) {
            console.error('Error al recuperar usuarios:', error)
            res.status(500).json({ message: 'Error interno del servidor' })
        }
    }

}

module.exports = ViewsController