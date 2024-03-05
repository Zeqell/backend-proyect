const winston = require('winston')
const { program } = require('../config/comander')

const { mode } = program.opts()

const customLevelOption = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
        http: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
    }
}

const transportOption = {
    development: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOption.colors }),
                winston.format.simple()
            )
        }),
    ],
    production: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOption.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: '/errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
}

const logger = winston.createLogger({
    levels: customLevelOption.levels,
    transports: transportOption[mode]
})


//middleware para mostrar por consola los logg de consultas http
const addLogger = (req, res, next) => {
    req.logger = logger
    //req.logger.http(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = {
    addLogger,
    logger
}