const { Router } = require('express')
const CartsManagerFile = require('../../managers/cartsManager')
const cartsService = new CartsManagerFile()
const router = Router()

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartsService.getCartById(parseInt(cid))

        if (cart) {
            res.send({
                status: 'success',
                payload: cart
            })
        } else {
            res.status(404).send({
                status: 'error',
                payload: cart
            });
        }
    } catch {
        res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor'
        })
    }
})

router.post('/', async (req, res) => {
    const products = await cartsService.readFile()
    res.send({
        status: 'success',
        payload: products
    })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const resp = await cartsService.addProductToCart(cid, pid)
    if (typeof (resp) === "string") {
        res.status(400).json({
            status: "fail",
            data: resp
        })
    } else {
        res.status(200).json({
            status: "ok",
            data: resp
        })
    }
})
module.exports = router

// async await  swgar suntax de promesas