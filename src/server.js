const express = require('express');
const { createServer } = require('node:http');
const serverIo = require('./routes/serverIo.js');
const { connectDB } = require('./config/index.js');

const mongoStore = require('connect-mongo')

const session = require('express-session')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')

const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const { viewsRouter } = require('./routes/views.router.js');
const appRouter = require('./routes');

const port = 8080;
const app = express();
const server = createServer(app)
serverIo(server)

connectDB()

// configuraciones de la App
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session({
    store: mongoStore.create({
        mongoUrl: 'mongodb+srv://schrezequiel:fQWo3jPqws72nKLV@cluster0.0xvbopt.mongodb.net/',
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

initializePassport()
app.use(session({
    secret: 'secret'
}))
app.use(passport.initialize())


// motor de plantilla
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// definiendo vistas
app.use('/', viewsRouter);
app.use(appRouter)

// Confirmacion de inicio
server.listen(port, () => {
    console.log(`Server andando en port ${port}`);
});