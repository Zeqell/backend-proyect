const { Router } = require('express');
//const { PManager } = require('../daos/file/ProductManager');
const { ProductMongo } = require('../daos/mongo/productsDaoMongo.js');
const router = Router();

//const productsMock = new PManager('./src/daos/file/mock/Productos.json');
const productsMongo = new ProductMongo();

router.get('/', async (req, res) => {
    let product = await productsMongo.getProducts();
    product.forEach(prd => {
        prd.price = new Intl.NumberFormat('es-ES', { style: 'decimal' }).format(prd.price)
    })
    res.render('home', {
        title: 'Inicio',
        product,
        cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
        scriptPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`,
        scriptView: './js/home.js'
    });
});

router.get('/realTimeProducts', async (req, res) => {
    let product = await productsMongo.getProducts();
    product.forEach(prd => {
        prd.price = new Intl.NumberFormat('es-ES', { style: 'decimal' }).format(prd.price)
    })
    res.render('realTimeProducts', {
        title: 'Productos en tiempo Real',
        product,
        cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
        scriptPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`,
        scriptView: './js/home.js'
    });
})

router.get('/chat', async (req, res) => {
    res.render('chat', {
        cssPlus: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
    })
})

exports.viewsRouter = router;