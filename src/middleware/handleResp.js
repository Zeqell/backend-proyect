const configObject= require('../config/index.js')
const CustomError = require('../util/err.js') 
const { development } = configObject;

const cookiesoptions = {
    maxAge: (1000 * 60 * 60 * 24),
    httpOnly: true,
    //secure: true,
    //sameSite:'strict'
}
const pageError = {
    page: 'error',
    title: 'Error'
}

let additional = { development }

const handleResponses = (req, res, next) => {
    // RESPONSES
    const responses = (statusCode, isError = false, message = "", data = {}) => res.status(statusCode).json({ isError, message, data });

    // SIMPLES
    res.sendSuccess = (data, message = "Success") => responses(200, false, message, data);
    res.sendCreated = (data, message = "Created") => responses(201, false, message, data);
    res.sendNoContent = (data, message = "No content") => responses(204, false, message, data);
    res.sendUserError = (message = "Bad Request", data) => responses(400, true, message, data);
    res.sendUserUnAuthorized = (message = "Unauthorized", data) => responses(401, true, message, data);
    res.sendUserForbidden = (message = "Forbidden", data) => responses(403, true, message, data);
    res.sendNotFound = (message = "Not Found", data) => responses(404, true, message, data);
    res.sendServerError = (message = "Internal Server Error", data) => responses(500, true, message, data);
    res.tokenCookie = (token) => res.cookie('token', token, cookiesoptions);

    res.sendSuccessOrNotFound = (variable, title) => variable ? res.sendSuccess(variable) : res.sendUserError(`${title} not found`);
    res.sendTokenCookieSuccess = (token, data) => res.tokenCookie(token).sendSuccess(data);
    res.sendCatchError = (error, message = "Internal Server Error") => (error instanceof CustomError) ? res.sendUserError(error.error, error) : res.sendServerError(message, error.toString());


    if (req.user) additional = { ...additional, ...req.user }

    res.renderPage = (page, title, configObject = {}) => res.render(page, { title, ...configObject, ...additional })
    res.renderPageEstruc = (page, title, options = {}, others = {}) => {
        const { control = {}, arrays = {}, pageControl = {} } = options
        const renderObject = {
            title,
            ...control,
            ...arrays,
            ...pageControl,
            ...others,
            ...additional
        }
        
        res.render(page, renderObject)
    };
    res.renderError = (answer = "Ocurrio un error, vuelva a intentarlo", error) => res.renderPage(pageError.page, pageError.title, { answer: answer, answerDetail: error.toString(), ...additional });

    res.renderPageTokenCookie = (token, page, title, configObject = {}) => res.tokenCookie(token).renderPage(page, title, configObject);

    next();
}

module.exports = handleResponses