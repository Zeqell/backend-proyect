const passport = require('passport')

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(401).json({ message: 'No autorizado' })
    }
}

function authenticateUser(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        req.user = user
        next()
    })(req, res, next)
}

module.exports = {
    isAuthenticated,
    authenticateUser
}