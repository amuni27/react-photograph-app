const express = require('express');
const router = express.Router();
const userController = require("../controller/user_controller")

router.route(process.env.FORWARD_ENDPONT)
    .post(userController.register)

router.route(process.env.LOGIN_ENDPOINT)
    .post(userController.login)

module.exports = router;