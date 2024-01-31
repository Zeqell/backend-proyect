const passport = require('passport')
const { userClass } = require('../daos/index.js')

const userService = new userClass();

// Policies => ['PUBLIC', 'USER', 'USER_PREMIUM', 'ADMIN']
const handleAuthFront = (policies) => {
    return async (req, res, next) => {
        try {
            passport.authenticate('jwt', { session: false }, async function (err, user, info) {
                if (err) next(err)

                if (user) {
                    const result = await userService.getUserById(user.id)
                    req.user = {
                        userId: user.id,
                        userName: result.first_name,
                        userLName: result.last_name,
                        userEmail: result.email,
                        userRole: user.role,
                        userCart: result.cart
                    };
                }

                if (policies[0] === 'PUBLIC') return next();

                if (!user) return res.clearCookie('token').render("login", { title: "Login", answer: 'Usuario no logueado' })

                if (user.role.toUpperCase() === 'ADMIN') return next();
                if (!policies.includes(user.role.toUpperCase())) return res.render('error', { title: 'Ha ocurrido un error', message: 'User not authorized', ...req.user })

                next();
            })(req, res, next);
        } catch (error) {
            next(error)
        }
    };
};

const handleAuth = (policies) => {
    return async (req, res, next) => {
        try {
            passport.authenticate('jwt', { session: false }, async function (err, user, info) {
                if (err) next(err)

                if (user) {
                    const result = await userService.getUserById(user.id)
                    req.user = {
                        userId: user.id,
                        userName: result.first_name,
                        userLName: result.last_name,
                        userEmail: result.email,
                        userRole: user.role,
                        userCart: result.cart
                    };
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

module.exports ={
    handleAuthFront,
    handleAuth
}