const { productService } = require('../repositories/service.js')
const customError = require('../services/CustomError.js')
const { EErrors } = require('../services/enums.js')
const { generateProductErrorInfo } = require('../services/generateErrorInfo.js')
const { logger } = require('../util/logger.js')

class ProdcutsController {
    constructor() {
        this.productService = productService
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productService.getProducts()
            return res.json({
                status: 'succes',
                payload: products
            });
        } catch (error) {
            logger.error(error);
            res.status(500).send('Server error')
        }
    }

    getProductById = async (req, res, next) => {
        try {
            const pid = req.params.pid
            if (!pid) {
            }
            customError.createError({
                name: 'Not found a product',
                cause: generateProductErrorInfo(filteredProduct),
                message: 'Error, trying to found a product',
                code: EErrors.INVALID_TYPES_ERROR
            })
            const filteredProduct = await this.productService.getProductById(pid)
            res.json({
                status: 'succes',
                payload: filteredProduct
            })
        } catch (error) {
            next(error)
        }
    }

    addProduct = async (req, res, next) => {
        try {
            const {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
            } = req.body

            if (!title || !price || !code || !stock) {
                customError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to add a product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            await this.productService.addProduct(title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product added successfully',
            });
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const { title, description, price, thumbnail, code, stock, status, category } = req.body
            if (!title || !price || !code || !stock) {
                customError.createError({
                    name: 'Product to update error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to update a product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product updated successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const pid = req.params.pid
            const userEmail = req.session.user.user

            const product = await this.productService.getProducrById(pid)
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            }
            if (req.session.user.role === 'admin' || product.owner === userEmail) {
                const deletedProduct = await this.productService.deleteProduct(pid)
                if (deletedProduct) {
                    return res.json({ status: 'success', message: 'Product deleted successfully' })
                }
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            } else {
                return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this product' })
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProdcutsController