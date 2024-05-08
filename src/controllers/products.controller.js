const { productService, userService } = require('../repositories/service.js')
const customError = require('../services/CustomError.js')
const { EErrors } = require('../services/enums.js')
const { generateProductErrorInfo } = require('../services/generateErrorInfo.js')
// const { logger } = require('../util/logger.js')
// const {sendMail} = require('../util/sendMail.js')

class ProdcutsController {
    constructor(){
        this.productService = productService
        this.userService = userService
    }

    getProducts = async (req,res)=>{
        try{
            const { limit, pageNumber, sort, query } = req.query
        
            const parsedLimit = parseInt(limit) || 10
            const parsedPageNumber = parseInt(pageNumber) || 1
            const sortOrder = sort === 'asc' ? 1 : -1

            const productsData = await this.productService.getProducts({
                limit: parsedLimit,
                pageNumber: parsedPageNumber,
                sort: sortOrder,
                query: query || '',
            })
            res.json({
                status: 'success',
                payload: productsData,
            })


        }catch (error){
            console.error(error)
            res.status(500).send('Error del servidor')
        }
    }

    getProductById = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            if(!pid){
                customError.createError({
                    name: 'No se encontró un producto',
                    cause: generateProductErrorInfo(filteredProduct),
                    message: 'Error al intentar encontrar un producto',
                    code: EErrors.DATABASES_ERROR,
                })
            }
            const filteredProduct = await this.productService.getProductById(pid)
            res.json({
                status: 'succes',
                payload: filteredProduct
            })    
        }catch(error) {
            next(error)
        }
    }

    addProduct = async (req,res,next)=>{
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

            const user = req.session.user
            if (user.role !== 'premium' && user.role !== 'admin') {
                return res.status(403).json({ status: 'error', message: 'Solo el usuario premium o administrador puede crear un producto' })
            }
            console.log('pase el verificador, soy admin')
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Error de creación del producto',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category
                    }),
                    message: 'Error al intentar agregar un producto',
                    code: EErrors.DATABASES_ERROR
                })
            }

            const owner = user.user
            const newProduct = await this.productService.addProduct({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
                owner, 
            })
            res.json({
                status: 'success',
                payload: newProduct,
                message: 'Producto agregado exitosamente',
            })
        } catch (error) {
            if (error.code === 'PRODUCT_EXISTS') {
                res.status(400).json({ status: 'error', message: 'El producto ya existe' })
            } else if (error.code === 'INVALID_PRODUCT') {
                res.status(400).json({ status: 'error', message: 'Datos de producto no válidos' })
            } else {
                res.status(500).json({ status: 'error', message: 'Error del servidor' })
            }
        }
    }

    updateProduct = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Error de actualización del producto',
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
                    message: 'Error al intentar actualizar un producto',
                    code: EErrors.DATABASES_ERROR
                })
            }
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Producto actualizado exitosamente',
            })
        }catch(error){
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const user = req.session.user
    
            const product = await this.productService.getProductById(pid)
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
            }

            if (user.role === 'admin' || product.owner.equals(user._id)) {
                const deletedProduct = await this.productService.deleteProduct(pid)
                if (deletedProduct) {
                    if (product.owner && user.role === 'premium') {
                        const ownerEmail = product.owner.email
                        const subject = 'Producto eliminado'
                        const html = `
                            <p>Estimado ${product.owner.first_name},</p>
                            <p>Nos gustaría informarle que su producto "${deletedProduct.title}" ha sido eliminado de nuestra plataforma.</p>
                            <p>Si tiene alguna pregunta, no dude en contactarnos..</p>
                            <p>Gracias por usar nuestra plataforma..</p>
                        `

                        await sendEmail(ownerEmail, subject, html)
                    }
                    
                    return res.json({ status: 'success', message: 'Producto eliminado exitosamente' })
                }
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
            } else {
                return res.status(403).json({ status: 'error', message: 'No autorizado para eliminar este producto' })
            }
        } catch (error) {
            next(error)
        }
    };


}

module.exports = ProdcutsController