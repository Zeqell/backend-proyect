const { Router } = require('express');
const { ProductMongo } = require('../daos/mongo/productsDaoMongo.js');
const router = Router();

const productsMongo = new ProductMongo();

router.get('/', async (req, res) => {
    res.redirect("/products");
})

router.get('/products', async (req, res) => {
    // handle fetching products
    const { page = 1, sort, category, availability } = req.query;
    let others = '';
    if (sort) others += '&sort=' + sort;
    if (category) others += '&category=' + category;
    if (availability) others += '&availability=' + availability;

    let resp = await fetch(
        `http://localhost:8080/api/products?page=${page}&limit=5${others}`,
    );
    resp = await resp.json();

    // inform error
    let productError = false;
    let pageError = false;
    if (resp.status === 'error') {
        productError = true;
    }
    // update product
    let product;
    if (!productError) {
        product = await resp.payload;
        product.forEach((prd) => {
            prd.price = new Intl.NumberFormat('es-ES', { style: 'decimal' }).format(
                prd.price,
            );
            prd['unavailability'] = prd.stock == 0;
            prd['link'] = `/products/${prd._id}`;
        });
    }
    // update url and security
    let workingUrl = req.url.split('?')[1];
    let arrayString;

    if (workingUrl) {
        arrayString = workingUrl.split('&');

        let secPage = arrayString.findIndex((elm) => elm.split('=')[0] == 'page');
        if (secPage != -1) {
            secPage = arrayString[secPage].split('=')[1]
            if (secPage > resp.totalPages || secPage < 0) {
                pageError = true;
            }
        }
    }

    function filterUrl(array, filter) {
        if (!workingUrl) return '/products?';
        //let array = string.split('&');
        array = array.filter((elm) => elm.split('=')[0] != filter);
        array = array.filter((elm) => elm.split('=')[0] != 'page');
        if (array.length === 0) {
            finalText = '/products?';
        } else {
            finalText = '/products?' + array.join('&') + '&';
        }
        return finalText;
    }
    const url = filterUrl(arrayString, 'category');

    res.render('products', {
        title: 'Inicio',
        pageError,
        productError,
        product,
        page: resp.page,
        totalPages: resp.totalPages,
        hasPrevPage: resp.hasPrevPage,
        hasNextPage: resp.hasNextPage,
        prevLink: `${filterUrl(arrayString, 'x')}${resp.prevLink}`,
        nextLink: `${filterUrl(arrayString, 'x')}${resp.nextLink}`,
        category: await productsMongo.getCategorys(),
        ascend: `${filterUrl(arrayString, 'sort')}sort=asc`,
        descend: `${filterUrl(arrayString, 'sort')}sort=desc`,
        disorderly: `${filterUrl(arrayString, 'sort')}sort=disorderly`,
        availability: `${filterUrl(arrayString, 'availability')}availability=false`,
        unavailability: `${filterUrl(arrayString, 'availability')}availability=true`,
        url,
    });
});

router.get('/products/:pid', async (req, res) => {
    const objectRender = { title: 'Producto' }
    const pid = req.params.pid;

    let resp = await fetch(`http://localhost:8080/api/products/${pid}`);
    resp = await resp.json();

    const product = resp.payload;

    if (resp.status == "ok") {
        objectRender['productError'] = false
        objectRender['product'] = product
        objectRender['cart'] = `6591b1a1419b33fbcb57e2b1`
    } else {
        objectRender['productError'] = true
    }
    //console.log(objectRender);
    res.render('product', objectRender)
})

router.get('/cart', async (req, res) => {
    const objectRender = { title: 'Carrito' }
    let resp = await await fetch(
        `http://localhost:8080/api/carts/6591b1a1419b33fbcb57e2b1`,
    );
    resp = await resp.json();
    const cart = resp.payload;
    const products = cart.products;
    products.forEach(prd => {
        prd['total'] = prd.product.price * prd.quantity;
    })

    if (resp.status == "ok") {
        objectRender['cartError'] = false;
        objectRender['cartId'] = cart._id;

        if (products.length != 0) {
            objectRender['cartNoEmpty'] = true;
            objectRender['products'] = products;
        }

    } else {
        objectRender['cartError'] = true
    }

    res.render('cart', objectRender)
})

router.get('/realTimeProducts', async (req, res) => {
    let resp = await fetch(`http://localhost:8080/api/products?limit=100`);
    resp = await resp.json();
    const product = resp.payload;

    product.forEach((prd) => {
        prd.price = new Intl.NumberFormat('es-ES', { style: 'decimal' }).format(
            prd.price,
        );
    });
    res.render('realTimeProducts', {
        title: 'Productos en tiempo Real',
        product,
        cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
    });
});

router.get('/chat', async (req, res) => {
    res.render('chat', {});
});

exports.viewsRouter = router;