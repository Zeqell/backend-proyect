const { EErrors } = require("../../services/enums");

exports.handleError = (err, req, res, next) =>{
    switch (err.code) {
        case EErrors.DATABASES_ERROR:
            return res.status(400).send({status: 'error', error: err.message})
            break; 
        default:
            return res.status(500).send({status: 'error', error: 'Error del servidor'})
            break;
    }
}