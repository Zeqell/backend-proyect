const cookiesoptions = {
    httpOnly: true,

}

const resJson = (res, statusCode, data, token = null) => {
    res.status(statusCode).json({
        error: false,
        data,
        token
    })
};

const resCookieJson = (res, statusCode, data, token, maxAge = (1000 * 60 * 60 * 24)) => {
    res.cookie('token', token, {
        maxAge,
        ...cookiesoptions
    }).status(statusCode).json({
        error: false,
        data,
        token: "ver: " + token
    })
};

const resError = (res, statusCode, message, context = '', error = true) => {
    statusCode = Number.parseInt(statusCode);
    statusCode = Number.isNaN ? 500 : statusCode
    res.status(statusCode).json({
        error,
        message,
        context
    })
};

const resCatchError = (res, error) => {
    //, statusCode, message, context=''
    let { statusCode } = error
    statusCode = Number.parseInt(statusCode);
    statusCode = Number.isNaN ? 500 : statusCode
    res.status(error.statusCode || 500).json({
        error: true,
        message: error.message,
        context: error.context || ''
    })
};

const renderPage = (res, page, title, options = {}, others = {}) => {
    const { user = {}, control = {}, arrays = {}, pageControl = {} } = options
    res.render(page, {
        title,
        ...user,
        ...control,
        ...arrays,
        ...pageControl,
        ...others
    })
};

const renderPageC = (res, page, title, options = {}, others = {}) => {
    const { user = {}, control = {}, arrays = {}, pageControl = {} } = options
    res.render(page, {
        title,
        ...user,
        ...control,
        ...arrays,
        ...pageControl,
        ...others
    })
};

module.exports = {
    resJson,
    resCookieJson,
    resError,
    resCatchError,
    renderPage,
    renderPageC
}