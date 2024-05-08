const { ne } = require("@faker-js/faker")

function isAdminOrPremium(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'premium')) {
        next()
    } else {
        res.status(403).send('Acceso Prohibido')
    }
}

function isAdmin(req, res, next) {
    if (req.session.user && (req.session.user.role === 'admin')) {
        next()
    } else {
        res.status(403).send('Acceso Prohibido')
    }
}

function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Acceso Prohibido')
    }
}

module.exports = {
    isAdminOrPremium,
    isAdmin,
    isUser,
}