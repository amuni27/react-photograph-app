const mongoose = require("mongoose");
const path = require('path')
const fs = require('fs')
const Photographer = mongoose.model(process.env.PHOTOGRAPHER_MODEL)

const response = {
    status: 200,
    message: null
}

const _sendResponse = function (status, data, res) {
    response.status = parseInt(status);
    response.message = data;
    res.status(response.status).json(response.message)
}

const _isDatabaseResponsehasData = function (data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            reject("error")
        } else {
            resolve(data)
        }
    })
}

const _noContentResponse = function () {
    response.status = process.env.HTTP_OK
    response.message = process.env.RESOURCE_NOT_FOUND_EXCEPTION
    _sendResponse(response, res)
}

const _addArtwork = function (res, artwork, photographer) {
    photographer.artworks.push(artwork)
    photographer.save()
        .then(photographer => _sendResponse(process.env.HTTP_OK, photographer, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
}

const _updateArtwork = function (res, artworkId, artwork, photographer) {
    
    
    const databaseArtwork = photographer.artworks.find(artwork=> artwork._id==artworkId)
    
    if (!databaseArtwork) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.NOT_FOUND_ARTWORK, res)
        return;
    }
   
    
    databaseArtwork.title = artwork.title
    databaseArtwork.createdYear = artwork.createdYear;
    databaseArtwork.picture_url = artwork.picture_url
    
    photographer.artworks = photographer.artworks.filter(artwork => artwork._id != artworkId)
    photographer.artworks.push(artwork)
   
    photographer.save()
        .then(photographer => _sendResponse(process.env.HTTP_OK, photographer, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
}


const _findArtWorkById = function (res, artworkId, photographer) {
    

    const artwork = photographer.artworks.find(artwork => artwork._id.toString() === artworkId)
    if (artwork) {
        response.message = artwork;
        _sendResponse(200, artwork, res)
    } else {
        _sendResponse(400, process.env.NOT_FOUND_ARTWORK, res)
    }

}


const _deleteImage = function (photographer, artworkId) {
    const artworks = photographer.artworks.filter(artwork => artwork._id == artworkId)[0]
    if (artworks) {
        const imagePath = path.join(__dirname, process.env.BACKDIR, process.env.PUBLIC_DIR, artworks.picture_url)
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (error) => {
                if (error) {
                    console.error( error);
                }
            })
        } else {
            console.info(artworks.title + process.ID_NOT_FOUND_EXCEPTION);

        }
    } else {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.RESOURCE_NOT_FOUND_EXCEPTION)
    }

}

const _deleteArtWorkById = function (res, artworkId, photographer) {
    _deleteImage(photographer, artworkId)
    photographer.artworks = photographer.artworks.filter(artwork => artwork._id != artworkId)
    photographer.save()
        .then(photographer => _sendResponse(process.env.HTTP_OK, process.env.RESOURCE_DELETED_MESSAGE, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))

}

const getPhotographerAllArtwork = function (req, res) {
    const photographerId = req.params.id;
    if (!photographerId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_FOUND_EXCEPTION, res)
    }
    if (!mongoose.isValidObjectId(photographerId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    Photographer.findById(photographerId)
        .then(_isDatabaseResponsehasData)
        .catch(_noContentResponse)
        .then(photographer => _sendResponse(process.env.HTTP_OK, photographer.artworks, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
}
const getPhotographerArtWorkByID = function (req, res) {
    const photographerId = req.params.id;
    const artworkId = req.params.artworkId;
    if (!photographerId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_FOUND_EXCEPTION, res)
    }
    if (!mongoose.isValidObjectId(photographerId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    Photographer.findById(photographerId)
        .then(_isDatabaseResponsehasData)
        .catch(_noContentResponse)
        .then(photographer => _findArtWorkById(res, artworkId, photographer))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
}

const addPhotographerArtwork = function (req, res) {
    const photographerId = req.params.id;
    const artwork = req.body;
    if (!mongoose.isValidObjectId(photographerId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    if (!artwork || !req.file || !photographerId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, proAcess.env.BODY_EMPTY_EXCEPTION, res)
    } else {
        artwork.picture_url = req.file.filename
        Photographer.findById(photographerId).populate(process.env.ARTWORK_SUB_COLL)
            .then(_isDatabaseResponsehasData)
            .catch(_noContentResponse)
            .then(photographer => _addArtwork(res, artwork, photographer))
            .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
    }

}


const deletePhotographerArtWorkByID = function (req, res) {
    const photographerId = req.params.id;
    const artworkId = req.params.artworkId;
    if (!photographerId && !artworkId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_FOUND_EXCEPTION, res)
    }
    if (!mongoose.isValidObjectId(photographerId) && !mongoose.isValidObjectId(artworkId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    Photographer.findById(photographerId)
        .then(_isDatabaseResponsehasData)
        .catch(_noContentResponse)
        .then(photographer => _deleteArtWorkById(res, artworkId, photographer))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
}

const fullUpdatePhotographerAetwork = function (req, res) {
   
    
    const photographerId = req.params.id;
    const artworkId = req.params.artworkId;
    const artwork = req.body;
    if (!mongoose.isValidObjectId(photographerId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    if (!artwork || !req.file || !photographerId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, proAcess.env.BODY_EMPTY_EXCEPTION, res)
    } else {
        
        artwork.picture_url = req.file.filename
        Photographer.findById(photographerId)
            .then(_isDatabaseResponsehasData)
            .catch(_noContentResponse)
            .then(photographer => _updateArtwork(res, artworkId, artwork, photographer))
            .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));

    }
}

const partialUpdatePhotographerAetwork = function (req, res) {
    const id = req.params.id;
    req.body.picture_url = req.file.originalname;
    Photographer.findByIdAndUpdate({ _id: id }, { $set: req.body })
        .then(() => _sendResponse(process.env.HTTP_OK, process.env.UPDATE_SUCCESSFULL, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
}

module.exports = {
    addPhotographerArtwork,
    getPhotographerAllArtwork,
    getPhotographerArtWorkByID,
    deletePhotographerArtWorkByID,
    fullUpdatePhotographerAetwork,
    partialUpdatePhotographerAetwork
}