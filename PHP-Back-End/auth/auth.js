const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const authenticate = function (req, res, next) {
    let token = req.headers[process.env.AUTHORIZATION];
    if (token && process.env.SECRET_KEY) {
        token = token.slice(7)
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                // console.error(process.env.TOKEN_VERIFICATION_FAILD, err.message);
                res.status(process.env.HTTP_BAD_REQUEST).json(process.env.TOKEN_VERIFICATION_FAILD)
            } else {
                next()
            }
        });
    }
    else {
        res.status(process.env.HTTP_BAD_REQUEST).json(process.env.TOKEN_VERIFICATION_FAILD)
    }
}

module.exports = {
    authenticate
}