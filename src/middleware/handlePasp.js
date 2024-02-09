const passport = require('passport');
const UsersController = require('../controllers/users.controller.js')

const uControl = new UsersController();

// Policies => ['PUBLIC', 'USER', 'USER_PREMIUM', 'ADMIN']
const handleAuthFront = (policies) => {
    return async (req, res, next) => {
        try {
            passport.authenticate('jwt', { session: false }, async function (err, user, info) {
                if (err) next(err)

                if (user) {
                    req.user = await uControl.getDataUserById(user.id)
                    //console.log(req.user);
                }

                if (policies[0] === 'PUBLIC') return next();

                if (!user) return res.clearCookie('token').render("login", { title: "Login", answer: 'Usuario no logueado' })

                if (user.role.toUpperCase() === 'ADMIN') return next();
                if (!policies.includes(user.role.toUpperCase())) return res.render('error', { title: 'Ha ocurrido un error', answer: 'User not authorized', ...req.user })

                next();
            })(req, res, next);
        } catch (error) {
            next(error)
        }
    };
};

const handleAuth = async (policies) => {
    return async (req, res, next) => {
        try {
            passport.authenticate('jwt', { session: false }, async function (err, user, info) {
                if (err) next(err)

                if (user) {
                    req.user = await uControl.getDataUserById(user.id)
                }

                if (policies[0] === 'PUBLIC') return next();

                if (!user) return res.sendUserError('Invalid token')

                if (user.role.toUpperCase() === 'ADMIN') return next();
                if (!policies.includes(user.role.toUpperCase())) return res.sendUserError('User not authorized')
                next();
            })(req, res, next);
        } catch (error) {
            next(error)
        }
    };
};

module.exports = {
    handleAuthFront,
    handleAuth
}
