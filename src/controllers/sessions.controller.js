const configObject = require('../config/index.js')
const { UserClass } = require('../daos/index.js')
const createToken = require('../util/createToken.js')
const CustomError = require('../util/err.js')
const { createHash, isValidPassword } = require('../util/passwords.js') 
const validateFields = require('../util/validate.js')

const userService = new UserClass();

class SessionsController {
    constructor() {
        this.service = "";
    }
    requieredfield = {
        register: ['first_name', 'last_name', 'email', 'birthday', 'password'],
        login: ['email', 'password']
    }
    admins = configObject.uadmins || []
    admin_pass = configObject.uadmin_pass

    register = async (req, res) => {
        try {
            const userData = validateFields(req.body, this.requieredfield.register);
            userData.password = createHash(userData.password)

            const userFound = await userService.getUserByMail(userData.email);

            if (userFound) throw new CustomError(`Ya existe un usuario con ese email. pruebe con otro`)

            await userService.createUser(userData)

            res.renderPage("login", "Login", { answer: 'Se ha registrado satisfactoriamente' })

        } catch (error) {
            if (error instanceof CustomError) {
                res.renderPage("register", "Nuevo Registro", { answer: error.message })
            } else {
                res.renderPage("register", "Nuevo Registro", { answer: 'Ocurrio un error, vuelva a intentarlo' })
            }
        }
    }  // Respuesta Visual

    login = async (req, res) => {
        const userData = validateFields(req.body, this.requieredfield.login);

        try {
            if (this.admins.includes(userData.email) && isValidPassword(userData.password, { password: this.admin_pass })) {

                const token = createToken({ id: 0, role: "Admin" })
                return res.sendTokenCookieSuccess(token, "Log In exitoso con Usuario Administrador")
            }

            const userFound = await userService.getUserByMail(userData.email);

            if (!userFound || !isValidPassword(userData.password, userFound)) {
                throw new CustomError(`Email o contraseña equivocado`);
            }

            const token = createToken({ id: userFound._id, role: userFound.role })
            res.sendTokenCookieSuccess(token, "Log In exitoso con Id: " + userFound.first_name)

        } catch (error) {
            res.sendCatchError(error)
        }
    }

    loginSession = async (req, res) => {
        const userData = validateFields(req.body, this.requieredfield.login);

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
                throw new CustomError(`Email o contraseña equivocado`);
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
            if (error instanceof CustomError) {
                //resError(res, 400, "Email o contraseña equivocado")
                res.sendUserError(error)
            } else {
                //resError(res, 500, "Ocurrio un error, vuelva a intentarlo")
                res.sendServerError(error)
            }
        }
    }

    logout = (req, res) => {
        /*req.session.destroy((err) => {
        if (err) return res.send({ status: 'error', error: err });
        });*/
        res.clearCookie('token').redirect('/');
    }

    // GITHUB
    github = async (req, res) => { }
    githubcallback = (req, res) => {
        //req.session.user = req.user
        const token = createToken({ id: req.user._id, role: req.user.role })

        res.tokenCookie(token).redirect('/products');
    }

    // TODO Pruebas --> http://localhost:PORT/api/sessions/current
    pruebasCurrent = (req, res) => {
        //router.get('/current', handleResponses, passportCall('jwt'), /*authPJwt('admin'),*/ (req, res) => {
        try {
            const datosP = { message: "Datos sensibles", reqUser: req.user }
            res.renderPage('current', 'PRUEBA', { contenido: JSON.stringify(datosP) })
        } catch (error) {
            return res.renderError(error.error)
        }
    }
}

module.exports = SessionsController;