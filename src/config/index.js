const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect("mongodb+srv://schrezequiel:fQWo3jPqws72nKLV@cluster0.0xvbopt.mongodb.net/")
    console.log('Base de datos conectada')
}