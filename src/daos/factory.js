const { configObject } = require('../config/index.js')

let UserDao
let ProductDao
let CartDao
let MessageDao
let ProductFile
let CartFile

console.log("Persistnece factory: ", configObject.persistence)

switch (configObject.persistence) {
    case 'MONGO':
        const UserDaoMongo = require('./mongo/userDaoMongo.js')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/productsDaoMongo.js')
        ProductDao = ProductDaoMongo

        const CartDaoMongo = require('./mongo/cartsDaoMongo.js')
        CartDao = CartDaoMongo

        const MessageDaoMongo = require('./mongo/mesaggesDaoMongo.js')
        MessageDao = MessageDaoMongo
        break;

    case 'FILE':
        const ProductFileManager = require('./file/productsManagerFile.js')
        ProductFile = ProductFileManager

        const CartFileManager = require('./file/cartsManager.js')
        CartFile = CartFileManager
        break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    MessageDao,
    ProductFile,
    CartFile,
}