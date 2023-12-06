const fs = require('node:fs')
const path = './src/mockDB/carts.json'

class CartsManagerFile {
    constructor() {
        this.path = path
    }
    readFile = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            console.log(data)
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }
    getCartById = async (cid) => {
        const carts = await this.readFile()
        const cart = carts.find(cart => cart.id === cid)
        if (!cart) {
            return res.status(404).send('No se encuentra el carrito con el id dado')
        }
        res.status(200).send(cart)
    }
    createCart = async () => {
        const carts = this.readFile()
        let newCart
        if (carts.length === 0) {
            newCart = { id: 1, products: [] }
        } else {
            newCart = { id: carts.length + 1, products: [] }
        }
        carts.push(newCart)
        const results = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8')
        return results
    }
    addProductToCart = async (cid, pid) => {
        const carts = await this.readFile()
        const cart = carts.find(cart => cart.id === cid)
        if (!cart) {
            return res.status(404).send('No se encuentra el carrito con el id dado')
        }
        const products = this.readFile()
        const productId = products.find(product => product.id ===pid)
        if (!productId) {
            return res.status(404).send('No se encuentra el producto con el id dado')
        }
        const newProduct = {
            productId: pid,
            quantity: 1
        }
        cart.products.push(newProduct)
        res.status(201).send(newProduct)
    }
    deleteCart = async (cid) => {
        const carts = await this.getCartById()
        if (!carts.some(cart => cart.id === cid)) return console.log('error al eliminar producto de carrito.')
        const cartsDelete = carts.splice(carts, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(cartsDelete, null, 2), 'utf-8')
        console.log('Producto eliminado del carrito.')
    }
}
module.exports = CartsManagerFile