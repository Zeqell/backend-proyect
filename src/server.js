const express = require('express')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const cors = require('cors')
const { connectDb } = require('./config/index.js')
const passport = require('passport')
const { initializePassport } = require('./helpers/jwt/passport.config.js')
const appRouter = require('./routes/index.js')
const cookie = require('cookie-parser')
const configureSocketIO = require('./helpers/serverOI.js')
const handlebars = require('express-handlebars')
const { addLogger, logger } = require('./util/logger.js')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const handlebarsHelpers = require('handlebars-helpers')()
const eq = handlebarsHelpers.eq

const PORT = process.env.PORT
const app = express()
// app.get('/realTimeProducts.js', (req, res) => {
//     res.type('application/javascript');
// });
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookie())
app.use(cors())
app.use(session({
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        },
        ttl: 15000000000,
    }),
    secret: process.env.JWT_SECRET_CODE,
    resave: true,
    saveUninitialized: true
}))

app.use(addLogger)
app.use(appRouter)
// app.use(handleError)

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion Ecommerce',
            description: 'Doc API para ecommerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

initializePassport()
app.use(passport.initialize())

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        eq: eq
    }
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

connectDb()

const serverHttp = app.listen(PORT, () => {
    logger.info(`Conectado en el puerto ${PORT}`)
})

const io = configureSocketIO(serverHttp)

module.exports = { app, io }