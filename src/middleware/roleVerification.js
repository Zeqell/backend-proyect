function isAdminOrPremium(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin' || req.session.user && req.session.user.role === 'premium') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

module.exports = {
    isAdminOrPremium,
    isUser,
}