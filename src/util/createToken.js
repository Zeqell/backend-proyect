const configObject = require('../config/index.js')
const jwt = require('jsonwebtoken')

const JWT_PRIVATE_KEY = configObject.jwt_code;

const createToken = (user) => jwt.sign(user, JWT_PRIVATE_KEY, { expiresIn: "1d" });

module.exports = createToken;