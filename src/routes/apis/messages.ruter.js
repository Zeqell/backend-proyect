const { Router } = require('express')
const MessagesController = require('../../controllers/messages.controller.js')

const router = Router();

const mControl = new MessagesController()

// DELETE http://localhost:PORT/api/messages
router.delete('/', mControl.clearMessages)

module.exports = router;