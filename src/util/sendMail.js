const nodemailer = require('nodemailer')
const { configObject } = require('../config/index.js')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_pass_app
    }
})

exports.sendMail = async () => {
    return await transport.sendMail({
        from: 'Este mail lo envia <sch.r.ezequiel@gmail.com>',
        to: 'sch.r.ezequiel@gmail.com',
        subject: 'Mail de prueba',
        html: `<div>
                    <h1>Mail de prueba</h1>
                </div>`
    })
}