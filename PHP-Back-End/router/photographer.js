const express = require('express');
const router = express.Router()
const photographerController = require('../controller/photographer_controller');
const auth = require("../auth/auth")
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.IMAGE_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});



const upload = multer({ storage: storage })

router.route(process.env.FORWARD_ENDPONT)
    .get(photographerController.getAll)
    .post(upload.single(process.env.PICTURE_URL_ATTRIBUTE),auth.authenticate, photographerController.create);

router.route(process.env.FORWARD_WITH_ID_ENDPONT)
    .get(photographerController.getOne)
    .put(upload.single(process.env.PICTURE_URL_ATTRIBUTE),auth.authenticate,photographerController.fullUpdate)
    .patch(upload.single(process.env.PICTURE_URL_ATTRIBUTE),auth.authenticate,photographerController.partialUpdate)
    .delete(auth.authenticate,photographerController.deleteOne);

module.exports = router;