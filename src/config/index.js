const dotenv = require('dotenv')
const {program} = require('./comander.js')
const { connect } = require('mongoose')

const {mode} = program.opts();
console.log('mode config: ', mode)

dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
})

const configObject = {
    port: process.env.PORT || 8080,
    jwt_code: process.env.JWT_SECRET_CODE,
    mongo_uri: process.env.MONGO_URI,
    persistence: process.env.PERSISTENCE,
    // uadmins: process.env.USERS_ADMIN,
    // uadmin_pass: process.env.USER_ADMIN_PASS,
    // gh_client_id: process.env.GITHUB_CLIENT_ID,
    // gh_client_secret: process.env.GITHUB_CLIENT_SECRET,
    gmail_user_app: process.env.GMAIL_USER_APP ,
    gmail_pass_app: process.env.GMAIL_PASS_APP,
    // twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    // twilio_atuh_token: process.env.TWILIO_ATUH_TOKEN,
    // twilio_number_phone: process.env.TWILIO_NUMBER_PHONE, 
}

const connectDb = async () => {
        try {
            MongoSingleton.getInstance()
            console.log("Db connected")
        } catch (error) {
            console.log(error)
    }  
}

class MongoSingleton {
    static instance
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

module.exports = {
    configObject,
    connectDb,
}





