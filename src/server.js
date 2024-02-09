const program = require ('./config/comander.js') 
const configObj = require ('./config/index.js') 
const express = require ('express') 
const {createServer} = require ('node:http') 
const serverIO = require ('./helpers/serverOI.js')
const cookieParser = require ('cookie-parser') 
const appRouter = require ('./routes/index.js') 

const handlebars = require ('express-handlebars') 
const passport = require ('passport') 
const initializePassport = require ('./config/passport.config.js') 

const {mode} = program.opts();
console.log('Mode config: ' + mode);

const port = process.env.PORT;
const app = express();
const server = createServer(app);

// configuraciones de la App
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(configObj.cookies_code))

serverIO(server);
configObj.connectDB();

// passport
initializePassport()
app.use(passport.initialize())

// handlebars
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(appRouter);

server.listen(port, () => {
    console.log(`Server andando en port ${port}`);
});