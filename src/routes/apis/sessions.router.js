const configObject = require('../../config/index.js')
const { Router } = require('express')
const passport = require('passport')
const { userClass } = require('../../daos/index.js')

const createToken = require ('../../util/createToken.js')
const authPJwt = require('../../helpers/jwt/authorization.middleware.js')
const passportCall = require('../../helpers/jwt/passportCall.middleware.js')

const handleResponses = require('../../middleware/handleResp.js')
const { handleAuth, handleAuthFront } = require('../../middleware/handlePasp.js')

const { createHash, isValidPassword } = require('../../util/passwords.js')
const CustomError = require('../../util/err.js')
const validateFields = require('../../util/validate.js')

const router = Router();
const users = new userClass();

// * POST http://localhost:PORT/api/sessions/register
router.post('/register', handleResponses, async (req, res) => {
    try {
        const requieredfield = ['first_name', 'last_name', 'email', 'birthday', 'password'];
        const userData = validateFields(req.body, requieredfield);
        userData.password = createHash(userData.password)

        const userFound = await users.getUserByMail(userData.email);

        if (userFound) throw new CustomError(`Ya existe un usuario con ese email. pruebe con otro`, 400, 'POST /api/sessions/register')

        await users.createUser(userData)

        res.renderPage("login", "Login", { answer: 'Se ha registrado satisfactoriamente' })

    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.renderPage("register", "Nuevo Registro", { answer: error.message })
        } else {
            res.renderPage("register", "Nuevo Registro", { answer: 'Ocurrio un error, vuelva a intentarlo' })
        }
    }
});

// * POST http://localhost:PORT/api/sessions/login
router.post('/login', handleResponses, async (req, res) => {
    const requieredfield = ['email', 'password'];
    const userData = validateFields(req.body, requieredfield);

    try {
        if (userData.email == configObject.uadmin && isValidPassword(userData.password, { password: configObject.uadmin_pass })) {

            const token = createToken({ id: 0, role: "Admin" })
            return res.sendTokenCookieSucess(token, "Log In exitoso con Id: " + 0)
        }

        const userFound = await users.getUserByMail(userData.email);

        if (!userFound || !isValidPassword(userData.password, userFound)) {
            throw new CustomError(`Email o contraseña equivocado`, 400, 'POST /api/sessions/login');
        }

        const token = createToken({ id: userFound._id, role: userFound.role })
        res.sendTokenCookieSucess(token, "Log In exitoso con Id: " + userFound._id)

    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            res.sendUserError(error)
        } else {
            res.sendServerError(error)
        }
    }
});

// DEPRECADO POST http://localhost:PORT/api/sessions/login
router.post('/loginSession', async (req, res) => {
    const requieredfield = ['email', 'password'];
    const userData = validateFields(req.body, requieredfield);

    try {
        if (userData.email == configObject.uadmin && isValidPassword(userData.password, { password: configObject.uadmin_pass })) {
            req.session.user = {
                first_name: "Admin",
                email: userData.email,
                role: "Admin"
            };
            return res.redirect('/products');
        }

        const userFound = await users.getUserByMail(userData.email);
        if (!userFound || isValidPassword(createHash(userData.password), userFound)) {
            throw new CustomError(`Email o contraseña equivocado`, 400, 'POST .../api/sessions/login');
        }

        req.session.user = {
            user: userFound._id,
            first_name: userFound.first_name,
            last_name: userFound.last_name,
            email: userFound.email,
            role: userFound.role,
        };

        res.redirect('/products');

    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            //resError(res, 400, "Email o contraseña equivocado")
            res.sendUserError(error)
        } else {
            //resError(res, 500, "Ocurrio un error, vuelva a intentarlo")
            res.sendServerError(error)
        }
    }
});

// * GET http://localhost:PORT/api/sessions/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

// * GET http://localhost:PORT/api/sessions/githubcallhub
router.get('/githubcallback', handleResponses, passport.authenticate('github', { session: false, failureRedirect: '/' }), (req, res) => {
    //req.session.user = req.user
    const token = createToken({ id: req.user._id, role: req.user.role })

    res.tokenCookie(token).redirect('/products');
})

// * GET http://localhost:PORT/api/sessions/logout
router.get('/logout', (req, res) => {
    /*req.session.destroy((err) => {
    if (err) return res.send({ status: 'error', error: err });
    });*/
    res.clearCookie('token').redirect('/');
});

// ? GET http://localhost:PORT/api/sessions/current
router.get('/current', handleAuthFront(['USER']), handleResponses, (req, res) => {
    //router.get('/current', handleResponses, passportCall('jwt'), /*authPJwt('admin'),*/ (req, res) => {
    try {
        const datosP = { message: "Datos sensibles", reqUser: req.user }
        res.renderPage('current', 'PRUEBA', { contenido: JSON.stringify(datosP) })
    } catch (error) {
        let message = error.error
        return res.renderPage('error', 'Ha ocurrido un error', { message })
    }
})

module.exports = router;