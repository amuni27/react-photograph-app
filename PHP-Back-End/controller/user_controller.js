const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

const User = mongoose.model(process.env.USER_MODEL)

const _createResponseObject = function () {
    const response = {
        status: process.env.HTTP_OK,
        data: ""
    }
    return response
}

const _sendResponse = function (response, res) {
    res.status(parseInt(response.status)).json(response.data)
    return
}

const _setResponseData = function (response, data) {
    response.status = 200
    response.data = data
}

const _setResponseInternalError = function (response, error) {
    response.status = 500
    response.data = error.message
}

const _setResponseUserError = function (response, error) {
    response.status = 500
    response.data = error
}
const _setResponseToUnautherized = function (response) {
    response.status = 401
    response.data = process.env.UNAUTHERIZED
}
const _createNewUserObject = function (req, hashPassword) {
    return new Promise((resolve, reject) => {
        if (req.body) {
            req.body.password = hashPassword
            resolve(req.body)
        } else {
            reject(process.env.BODY_EMPTY_EXCEPTION)
        }
    })
}

const _doesUserExist = function (databaseUser, response) {
    return new Promise((resolve, reject) => {
        if (!databaseUser) {
            reject()
        } else {
            response.data = databaseUser;
            resolve(databaseUser)
        }
    })
}

const _doesPasswordMatch = function (passwordMatch) {

    return new Promise((resolve, reject) => {
        if (!passwordMatch) {
            reject()
        } else {
            resolve()
        }
    })
}

const _setResponseToLoginSuccess = async function (response) {
    let user = response.data;
    user.token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET_KEY)
    response.data = user.token;
    response.status = 200;
}

const register = function (req, res) {
    const response = _createResponseObject()
    if (!req.body || !req.body.password || !req.body.name || !req.body.username) {
        _setResponseUserError(response, process.env.BODY_EMPTY_EXCEPTION)
        _sendResponse(response, res)
    } else {
        bcrypt.genSalt(parseInt(process.env.HASH_SALT_ROUNDS))
            .then(salt => bcrypt.hash(req.body.password, salt))
            .then(hashPassword => _createNewUserObject(req, hashPassword))
            .then(newUserObject => User.create(newUserObject))
            .then(createdUser => _setResponseData(response, createdUser))
            .catch(error => _setResponseInternalError(response, error))
            .finally(() => _sendResponse(response, res))
    }
}

const login = function (req, res) {
    const response = _createResponseObject()
    if (req.body && req.body.username && req.body.password) {
     
        User.findOne({ username: req.body.username })
            .then(databseUser => _doesUserExist(databseUser, response))
            .catch(() => _setResponseToUnautherized(response))
            .then(databaseUser => bcrypt.compare(req.body.password, databaseUser.password))
            .then(passwordMatch => _doesPasswordMatch(passwordMatch))
            .catch(() => _setResponseToUnautherized(response))
            .then(() => _setResponseToLoginSuccess(response))
            .catch(error => _setResponseInternalError(response, error))
            .finally(() => _sendResponse(response, res))
    } else {
        _setResponseUserError(response, process.env.LOGIN_INFO_MISSING)
        _sendResponse(response, res)
    }
}

module.exports = {
    register,
    login
}