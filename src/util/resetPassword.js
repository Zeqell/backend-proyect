const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { configObject } = require('../config/index.js')
const { logger } = require('./logger.js')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user_app,
        pass: configObject.gmail_pass_app
    }
})

exports.sendPasswordResetEmail = async (userId, userEmail) => {

    const token = jwt.sign({ userId }, 'secreto', { expiresIn: '1h' })

    
    const resetUrl = `https://localhost:4000/api/reset-password?token=${token}`


    await transport.sendMail({
        from: 'Tu aplicación <Ecommerce>',
        to: userEmail,
        subject: 'Restablecer contraseña',
        html: `
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
        `
    })
}

exports.verifyResetToken = (token) => {
    try {
        
        const decoded = jwt.verify(token, 'secreto')
        return decoded
    } catch (error) {

        logger.error('Token no encontrado')
        return null
    }
}