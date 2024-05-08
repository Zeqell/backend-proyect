const { logger } = require("../../util/logger.js")
const { productModel } = require("./models/products.model.js")

class productDaoMongo {
    constructor(){
        this.model = productModel
    }

    async add({title, description, price, thumbnail, code, stock, status, category, owner}){
        
        const existingProduct = await this.model.findOne({ code })
        if (existingProduct) {
            const error = new Error("Este producto ya ha sido agregado.")
            error.code = 'PRODUCT_EXISTS'
            throw error
        } else {
            if (!title || !description || !price || !code || !stock) {
                const error = new Error("Producto incorrecto: Una de estas propiedades no es válida")
                error.code = 'INVALID_PRODUCT'
                throw error
            }
                const newProduct = new this.model({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category,
                    owner
                })

                await newProduct.save()

                return newProduct
        }
    }

    async get({ limit = 10, pageNumber, sort, query } = {}){
        const filter = { isActive: true }
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ]
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(pageNumber),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        }

        const result = await this.model.paginate(filter, options)
        return {
            docs: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        }
    }

    async getById(pid){
        const product = await this.model.findOne({ _id: pid }).lean()

        if (product) {
            return [product]
        } else {
            logger.error("este producto no existe")
            return []
        }
    }

    async update(id, title, description, price, thumbnail, code, stock, status, category){
        const updatedProduct = await this.model.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category,
                },
            },
            { new: true } 
        )
    
        if (updatedProduct) {
            logger.info("Producto actualizado exitosamente")
        } else {
            logger.error("No se encontró el producto a actualizar")
        }
    }

    async delete(pid){
        try {
            const result = await this.model.deleteOne({ _id: pid })
    
            if (result.deletedCount > 0) {
                logger.info("Producto eliminado exitosamente")
                return { success: true, message: "Producto eliminado exitosamente" }
            } else {
                const errorMessage = "No existe tal producto"
                logger.error(errorMessage)
                throw new Error(errorMessage)
            }
        } catch (error) {
            logger.error("Error al eliminar el producto:", error)
            throw error
        }
    }

}

module.exports = productDaoMongo