const { messageService } = require('../repositories/service.js')
const { logger } = require('../util/logger.js')

class messageController {
    constructor(){
        this.messageService = messageService
    }

    async getAllMessages() {
        try {
            return await this.messageService.getAllMessages()
        } catch (error) {
            logger.error('Error al recibir mensajes:', error)
            throw error
        }
    }

    async getMessagesByUser(user) {
        try {
            return await this.messageService.getMessagesByUser(user)
        } catch (error) {
            logger.error('Error al recibir mensajes del usuario:', error)
            throw error
        }
    }

    async addMessageToUser(user, message) {
        try {
            return await this.messageService.addMessageToUser(user, message)
        } catch (error) {
            logger.error('Error del usuario al agregar el mensaje:', error)
            throw error
        }
    }

    async createUserWithMessage(user, message) {
        try {
            return await this.messageService.createUserWithMessage(user, message)
        } catch (error) {
            logger.error('Error del usuario al crear mensaje:', error)
            throw error
        }
    }

}

module.exports = messageController