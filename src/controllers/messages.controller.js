const { MessageClass } = require ('../daos/index.js') 


class MessagesController {
    constructor() {
        this.service = new MessageClass
    };

    clearMessages = async (req, res) => {
        try {
            await this.service.clearMessages();
            res.sendSuccess({})
        } catch (error) {
            res.sendCatchError(error)
        }
    }
}

module.exports = MessagesController;