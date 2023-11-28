const { Router } = require('express')
const ProductManagerFile = require('../managers/productsManagerFile')

const router = Router()
const productsService = new ProductManagerFile()
router
    .get('/', async (req, res)=> {
        const products = await productsService.getProducts()
        res.send({
            status: 'success', 
            payload: products
        })
    })
    .get('/:pid', async (req, res)=> {
        const {pid} = req.params
        const product = await productsService.getProduct(parseInt(pid))
        if (!product) {
            return res.status(400).send({
                status: 'error', 
                mensagge: 'No se encuentra el producto'
            })
        }
        res.send({
            status: 'success',
            payload: product
        })
    })
    .post('/', async (req, res)=> {
        try {
            const newproduct = req.body
            const resp = await productsService.addProduct(newproduct)
            if (!resp) {
                return res.status(400).send({
                    status: 'error',
                    message: resp
                })
            } 
                res.status(200).send({
                    status:'success',
                    message: resp
                })
            
        } catch{
            res.status(500).send({
                status:'error',
                message:'Error interno del servidor'
            })
        }
    })
    .put('/:pid', async (req, res)=> {
        const {pid} = req.params
        const updateProduct = await productsService.update(parseInt(pid))
        if (!updateProduct) {
            return res.status(400).send({
                status: 'error',
                message: updateProduct
            })
        } 
            res.status(200).send({
                status:'success',
                message: updateProduct
            })
    })
    .delete('/:pid', async (req, res)=> {
        const {pid} = req.params
        const deletProduct = await productsService.deleteProduct(parseInt(pid))
        if (!deletProduct) {
            return res.status(200).send({
                status:'success',
                message: deletProduct
                
            })
        } 
            res.status(400).send({
            status: 'error',
            message: deletProduct
            })
    })
module.exports = router