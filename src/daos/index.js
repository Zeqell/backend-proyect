const ProductClass = require('./mongo/productsDaoMongo.js')
const UserClass = require('./mongo/userDaoMongo.js')
const CartClass = require('./mongo/cartsDaoMongo.js')
const MessageClass = require('./mongo/mesaggesDaoMongo.js')

module.exports = {
    ProductClass,
    UserClass,
    CartClass,
    MessageClass
}
