const { connect } = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const dotenv = require('dotenv')
const program = require('./comander.js')

const opts = program.opts();

dotenv.config({
    path: opts.mode == 'production' ? './.env.production' : './.env.development'
})

const configObject = {
    //conexion Mongo Atlas a traves de mongoose
    port: process.env.PORT = 8080,
    jwt_code: process.env.JWT_SECRET_CODE = 'SECRET',
    cookies_code: process.env.COOKIES_SECRET_CODE,
    mongo_uri: process.env.MONGO_URI = ('mongodb+srv://schrezequiel:fQWo3jPqws72nKLV@cluster0.0xvbopt.mongodb.net/'),
    uadmin: process.env.USER_ADMIN,
    uadmin_pass: process.env.USER_ADMIN_PASS,
    gh_client_id: process.env.GITHUB_CLIENT_ID = 'Iv1.89e297da0de35b33',
    gh_client_secret: process.env.GITHUB_CLIENT_SECRET = 'ea5a9ae2945796ffb01eb824c56f8dee4520f0f9',
    development: opts.mode == 'development',

    connectDB: async () => {
        // await mongoose.connect(process.env.MONGO_URI);
        // console.log('Base de datos conectada');
        MongoSingleton.getInstance();
    },
    //conexion Mongo Atlas session
    sessionAtlas: (app) => {
        app.use(
            session({
                store: MongoStore.create({
                    mongoUrl: process.env.MONGO_URI,
                    mongoOptions: {

                    },
                    ttl: 3600, // milisegundos --> hs
                }),
                secret: process.env.COOKIES_SECRET_CODE,
                resave: true,
                saveUninitialized: true,
            })
        );
    },
}
class MongoSingleton {
    static instance //
    constructor() {
        connect(process.env.MONGO_URI);
    }

    static getInstance() {
        if (!this.instance) {
            console.log('Conectado a Base de Datos');
            return this.instance = new MongoSingleton();
        }
        console.log('Base de Datos ya conectada');
        return this.instance;
    }
}
module.exports = configObject





