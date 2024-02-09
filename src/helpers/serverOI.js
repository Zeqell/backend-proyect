const { MessageClass, ProductClass } = require('../daos/index.js') 
const CustomError = require('../util/err.js') 
const { Server } = require('socket.io') 

module.exports = function (server) {

    const io = new Server(server)

    const products = new ProductClass();
    const messages = new MessageClass();

    io.on('connection', ios => {
        //console.log("Nuevo cliente conectado");

        //REAL TIME PRODUCT
        ios.on('nuevoProducto', async newProduct => {
            try {
                await products.addProduct(newProduct);

                let resp = await fetch(`http://localhost:8080/api/products?limit=100`);
                resp = await resp.json()
                const listProduct = resp.data.data;

                io.emit('productos', listProduct)

            } catch (error) {
                let message = 'Error interno del servidor'
                if (error instanceof CustomError) {
                    message = error.message
                }
                io.emit('error', message)
            }
        })

        ios.on('eliminarProducto', async code => {
            await products.deleteProductByCode(code);

            let resp = await fetch(`http://localhost:8080/api/products?limit=100`);
            resp = await resp.json()
            const listProduct = resp.data.data;

            io.emit('productos', listProduct)
        })

        //CHAT
        ios.on('message', async (data) => {
            const newMessaegs = await messages.addMessage(data);
            io.emit('messageLogs', newMessaegs)
        })

        ios.on('init', async () => {
            ios.emit('messageLogs', newMessaegs)
        })

        ios.on('clean', async () => {
            await messages.clearMessages()
            io.emit('messageLogs', newMessaegs)
        })
    })
}