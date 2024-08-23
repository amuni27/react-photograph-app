const express = require('express');
const router = express.Router()
const artworkController = require('../controller/artwork_controller')
const multer = require('multer');
const auth = require("../auth/auth")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.IMAGE_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

router.route(process.env.ARTWORK_ENDPOINT)
    .get(artworkController.getPhotographerAllArtwork)
    .post(auth.authenticate,upload.single(process.env.PICTURE_URL_ATTRIBUTE), artworkController.addPhotographerArtwork)
router.route(process.env.ARTWORK_ENDPOINT_WITH_ID)
    .get(artworkController.getPhotographerArtWorkByID)
    .delete(auth.authenticate,artworkController.deletePhotographerArtWorkByID)
    .put(auth.authenticate,upload.single(process.env.PICTURE_URL_ATTRIBUTE),artworkController.fullUpdatePhotographerAetwork)

module.exports = router;