const artwork = require('./artwork')
const photographer = require('./photographer')
const express = require("express")
const router = express.Router()

router.use(artwork)
router.use(photographer)



module.exports = router;