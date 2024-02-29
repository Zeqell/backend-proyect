const { Router } = require('express')
const { generateProducts } = require('../../pruebas/pruebas.js')


const router = Router()

router.get('/mockproducts', (req, res) =>{

    let products = []

    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.json({
        status: 'success',
        payload: products
    })
})

module.exports = router