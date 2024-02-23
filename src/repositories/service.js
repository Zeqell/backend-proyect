const { ProductDao, UserDao, CartDao, MessageDao } = require('../daos/factory.js')
const ProductRepository = require('./product.repository.js')
const UserRepository = require('./user.repository')
const CartRepository = require('./cart.repository.js')
const MessageRepository = require('./message.repository.js')

const productService = new ProductRepository(new ProductDao)
const userService = new UserRepository(new UserDao)
const cartService = new CartRepository(new CartDao)
const messageService = new MessageRepository(new MessageDao)

module.exports = {
    productService,
    userService,
    cartService,
    messageService,
}