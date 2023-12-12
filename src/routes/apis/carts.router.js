const { Router } = require('express')
const CartsManager = require('../../managers/cartsManager.js')

const cartsRouter = Router()
const cartsManager = new CartsManager('../../mockDB/carts.json')

// crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.createCart()
        res.status(200).json({ status: 'éxito', data: newCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', error: 'Error interno del servidor.' })
    }
})

// obtener productos del carrito por ID
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartsManager.getCartById(cartId)

        if (cart) {
            res.status(200).json({ status: 'éxito', data: cart.products })
        } else {
            res.status(404).json({ status: 'error', error: 'No se encuentra el Carrito.' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', error: 'Error interno del servidor.' })
    }
})

// agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body

        const updatedCart = await cartsManager.addToCart(cartId, productId, quantity)

        res.status(200).json({ status: 'éxito', data: updatedCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ status: 'error', error: 'Error interno del servidor.' })
    }
})

module.exports = cartsRouter