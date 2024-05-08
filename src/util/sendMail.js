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

async function sendMail (to, subject, html) {
    try {
        await transport.sendMail({
            from: 'Este mail lo envia <tu_email@gmail.com>',
            to,
            subject,
            html
        })
        console.log(`Correo electrónico enviado a ${to}`)
    } catch (error) {
        console.error(`Error al enviar correo electrónico a ${to}:`, error)
    }
}

module.exports = {sendMail}