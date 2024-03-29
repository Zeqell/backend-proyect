const fs = require('node:fs')
const { logger } = require('../../util/logger')
const path = './src/mockDB/products.json'

class ProductManagerFile{
    constructor(){
        this.path = path
    }
    readFile = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            logger.info(data)
            return JSON.parse(data)            
        } catch (error) {
            return []
        }        
    }
    getProducts = async () => {
        try {
            return await this.readFile()
        } catch (error) {
            return 'No se hay productos'
        }
    }
    getProduct = async (id) => {
        try {
            const products = await this.readFile()
            if(!products) return 'No hay productos'
            return products.find(product => product.id === id)                     
        } catch (error) {
            return  new Error(error)
        }
    }
    addProduct = async (newItem) => {
        try {   
            
            let products = await this.readFile()
            // si esta no lo voy a crear 
            const productDb = products.find(product => product.code === newItem.code)
            logger.info(productDb)
            if (productDb) {
                return `Se encuenta el producto`
            }
            if (products.length === 0 ) {
                // creando propieda id
                newItem.id = 1
                products.push(newItem) 
            } else {
                // products =  [...products, {...newItem, id: products[products.length - 1].id + 1 } ] 
                products =  [...products, {...newItem, id: products.length + 1 } ]
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
            return 'Producto agregado'
        } catch (error) {
            return new Error(error)
        }
    }
    async update(pid, updateToProduct){
        let products = await this.readFile()
        const productIndex = products.findIndex(product => pid === product.id)
        if (productIndex !== -1) { // ! = =
            products[productIndex] = updateToProduct
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
        return 'producto acualizado'
    }
    async deleteProduct(pid) {
        const products = await this.readFile()
        if (!products.some(product => product.id === pid)) return logger.warning('El producto que quiere borrar no existe.')
        const productsDelete = products.filter(product => product.id !== pid);
        await fs.promises.writeFile(this.path, JSON.stringify(productsDelete, null, 2),'utf-8')
        logger.info('Producto eliminado.')
    }
}

module.exports = ProductManagerFile
