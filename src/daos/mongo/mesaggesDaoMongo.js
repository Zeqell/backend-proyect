const { logger } = require('../../util/logger.js')
const { messageModel } = require('./models/messages.model.js')

class messageDaoMongo {
    constructor() {
        this.model = messageModel 
    }

    async user(user) {
        return await this.model.findOne({ user: user })
    }

    async messages() {
        return await this.model.find({ })
    }

    async add(user, message) {
        try {
            const userDocument = await this.model.findOne({ user: user })
            if (!userDocument) {
                logger.error(`Usuario ${user} no encontrado`)
                return null
            }
            userDocument.messages.push(message)
            await userDocument.save()
            return userDocument
        } catch (error) {
            logger.error('Error al agregar el mensaje al usuario:', error)
            throw error
        }
    }

    async create(user, message) {
        try {
            const newUserDocument = new this.model({
                user: user,
                messages: [message]
            })
            await newUserDocument.save()
            return newUserDocument
        } catch (error) {
            logger.error('Error al crear:', error)
            throw error
        }
    }
}

module.exports = messageDaoMongo