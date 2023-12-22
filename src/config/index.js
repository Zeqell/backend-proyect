const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect()
    console.log('Base de datos conectada')
}