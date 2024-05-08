const { Server } = require('socket.io')
const MessageController = require('../controllers/messages.controller.js')
const ProdcutsController = require('../controllers/products.controller.js')
const { logger } = require('../util/logger.js')


function configureSocketIO(serverHttp) {

    const io = new Server(serverHttp)
    const productsController = new ProdcutsController()
    const messageController = new MessageController()

    io.on('conexión', socket => {
        logger.info('Nuevo cliente conectado')

        socket.on('newProduct', async addProduct => {
            await productsController.addProduct(addProduct)
            const productsList = await productsController.getProducts()
            socket.emit('products', productsList)
        })

        socket.on('deleteProduct', async deleteProductById => {
            await productsController.deleteProduct(deleteProductById)
            const productsList = await productsController.getProducts()
            logger.info('Productos enviados:', productsList);
            socket.emit('products', productsList)
        })

        socket.on('message', async (data) => {
            logger.info(`${data.user}: ${data.message}`)

            try {
                const newMessage = {
                    message: data.message,
                    timestamp: new Date()
                }

                await messageController.addMessageToUser(data.user, newMessage)

                io.emit('messageLogs', { user: data.user, message: newMessage })
            } catch (error) {
                logger.error('Error al guardar el mensaje en la base de datos:', error)
            }
        })
    })
    return io
}
module.exports = configureSocketIO