const express = require ('express')
const handlebars = require ('express-handlebars')
const productsRouter = require('./routes/apis/products.router.js')
const cartsRuter = require('./routes/apis/carts.router.js')
const hbsrouter = require('./routes/apis/hbs.router.js')
// const viewsRouter = require ('./routes/views.router.js')
const ProductManagerFile = require('./managers/productsManagerFile.js')
const productManager = new ProductManagerFile('./mockDB/products.json')
const { Server } = require('socket.io') 


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

// localhost:8080  /api/users
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRuter)
app.use('/product', hbsrouter)
// app.use('/views', viewsRouter)


const httpServer = app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`server running on ${PORT}`);
});

const io = new Server(httpServer);
io.on('connection',socket=>{    
    console.log('Nueva conexion entrante.. por WS');      
    socket.on('addProduct',formData => {                    
        const status=productManager.addProduct(formData.title,
            formData.description,
            formData.price,
            formData.thumbnail,
            formData.code,
            formData.stock)        
        socket.emit('resultado.addproduct',status)
        socket.broadcast.emit('productosactualizados',status       
        
        );
        })
    socket.on('getproducts',limit =>{
        console.log("Data solicitada por getProducts "+ limit);
        let products=productManager.getProduct(parseInt(limit))        
        socket.emit('resultado.getproducts',products);
        });
    socket.on('eliminaProducto',id =>{
            console.log("Eliminando Producto ID = "+ id);
            let resultado=productManager.deleteProduct(id);
            socket.broadcast.emit('productosactualizados',resultado);
            });
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('error de server');
});
