const configObject = require('../config/index.js')
const { development } = configObject;

const cookiesoptions = {
    maxAge: (1000 * 60 * 60 * 24),
    httpOnly: true,
    //secure: true,
    //sameSite:'strict'
}

let additional = { development }

const handleResponses = (req, res, next) => {
    if (req.user) additional = { ...additional, ...req.user }
    //console.log(req.user);

    res.tokenCookie = (token) => res.cookie('token', token, cookiesoptions);

    res.sendSucess = (data, statusCode = 200) => res.status(statusCode).json({ isError: false, data });
    res.sendUserError = (error, statusCode = 400) => { res.status(statusCode).json({ isError: true, error }) };
    res.sendServerError = (error, statusCode = 500) => { res.status(statusCode).json({ isError: true, error }) };

    res.sendTokenCookieSucess = (token, data, statusCode = 200) => res.tokenCookie(token).sendSucess(data, statusCode);

    res.renderPage = (page, title, configObject = {}) => res.render(page, { title, ...configObject, ...additional })
    res.renderPageEstruc = (page, title, options = {}, others = {}) => {
        const { control = {}, arrays = {}, pageControl = {} } = options
        res.render(page, {
            title,
            ...control,
            ...arrays,
            ...pageControl,
            ...others,
            ...additional
        })
    };

    res.renderPageTokenCookie = (token, page, title, configObject = {}) => res.tokenCookie(token).renderPage(page, title, configObject);

    next();
}

module.exports = handleResponses