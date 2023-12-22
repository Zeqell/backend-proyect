const express = require ('express')
const handlebars = require ('express-handlebars')
const productsRouter = require('./routes/apis/products.router.js')
const cartsRuter = require('./routes/apis/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const ProductManagerFile = require('./daos/file/productsManagerFile.js')
const { Server } = require('socket.io') 


const app = express()
const httpServer = require('http').Server(app)
const io = new Server(httpServer)
const productManager = new ProductManagerFile('./mockDB/products.json')
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

// localhost:8080  /api
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRuter)
app.use('/views', viewsRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error del servidor')
})


// Conectamos Socket.io.
io.on('connection', (socket) => {
    console.log('Cliente conectado')

    // agregar nuevos productos.
    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData)

            // actualización a todos los clientes conectados.
            const updatedProducts = await productManager.getProducts()
            io.emit('updateProducts', updatedProducts)
        } catch (error) {
            console.error(error)
        }
    })

    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId)

            // actualización a todos los clientes conectados.
            const updatedProducts = await productManager.getProducts()
            io.emit('updateProducts', updatedProducts)
        } catch (error) {
            console.error(error)
        }
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado')
    })
})

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})