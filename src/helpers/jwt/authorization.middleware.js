const customError = require('../../util/err.js')
const { renderPage } = require('../../helpers/responses.js')

const authorizationJwt = (roleArray) => {
    return (req, res, next) => {
        try {
            if (!req.user) throw new customError('Unauthorized', 401)
            if (!roleArray.includes(req.user.role.toUpperCase())) throw new CustomError('Not permissions', 403)
            next()
        } catch (error) {
            if (error instanceof customError) {
                renderPage(res, "login", "Inicio", { control: { answer: error.message } });
            } else {
                renderPage(res, "login", "Inicio", { control: { answer: 'Ocurrio un error, vuelva a intentarlo' } });
            }
        }
    };
};

module.exports = authorizationJwt