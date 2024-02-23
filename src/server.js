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
const handlebarsHelpers = require('handlebars-helpers')()
const eq = handlebarsHelpers.eq

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookie())
app.use(cors())
app.use(session({
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 15000000000,
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(appRouter)

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
    console.log(`Conectado en el puerto ${PORT}`)
})

const io = configureSocketIO(serverHttp)

module.exports = { app, io }