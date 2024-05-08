const { logger } = require("../../util/logger.js")
const { userModel } = require("./models/user.model.js")

class userDaoMongo {
    constructor(){
        this.userModel = userModel
    }

    async get() {
        return await this.userModel.find({})
    }

    async getBy(filter) {
        return await this.userModel.findOne(filter)
    }

    async create(newUser) {
        return await this.userModel.create(newUser)
    }

    async update(uid, userUpdate) {
        return await this.userModel.findOneAndUpdate({_id: uid}, userUpdate)
    }

    async updateRole(userId, newRole){
        try{
            return await this.userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true })
        }catch (err){
            logger.error('Error al actualizar el rol de usuario:', err)
        }
    }

    async updatePassword(uid, newPassword) {
        try {
            return await this.userModel.findByIdAndUpdate(uid, { password: newPassword }, { new: true })
        } catch (error) {
            logger.error('Error al actualizar la contraseña del usuario:', error)
        }
    }

    async delete(uid) {
        return await this.userModel.findOneAndDelete({_id: uid})
    }

    async findInactive(dateThreshold) {
        try {
            const inactiveUsers = await this.userModel.find({
                last_connection: { $lt: dateThreshold }
            })

            return inactiveUsers
        } catch (error) {
            logger.error('Error al encontrar usuarios inactivos:', error)
            throw new Error('Error al encontrar usuarios inactivos')
        }
    }
}

module.exports = userDaoMongo