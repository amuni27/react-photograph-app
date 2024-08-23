const mongoose = require("mongoose");
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

const _isDatabaseResponsehasData = function (response) {
    return new Promise((resolve, reject) => {
        if (!response) {
            reject(process.env.ERROR)
        } else {
            resolve(response)
        }
    })
}

const _noContentResponse = function () {
    response.status = process.env.HTTP_OK
    response.message = process.env.RESOURCE_NOT_FOUND_EXCEPTION
    _sendResponse(response, res)
}




const getOne = function (req, res) {
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
        .then(photographer => _sendResponse(process.env.HTTP_OK, photographer, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
}

const getAll = function (req, res) {
    let offset = req.query.offset;
    let limit = req.query.limit;
   

    if (!offset && !limit || limit > 10) {
        offset = process.env.DEFAULT_OFFSET
        limit = process.env.DEFAULT_LIMIT
    }
    Photographer.find({}).skip(offset).limit(limit)
        .then(_isDatabaseResponsehasData)
        .catch(_noContentResponse)
        .then(photographer => _sendResponse(process.env.HTTP_OK, photographer, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res));
}

const create = function (req, res) {
    const photographer = req.body;
    if (!photographer | !req.file) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.BODY_EMPTY_EXCEPTION, res)
    } else {

        photographer.picture_url = req.file.originalname
        Photographer.create(photographer)
            .then(photographer => _sendResponse(process.env.HTTP_OK, photographer, res))
            .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
    }
}

const fullUpdate = function (req, res) {
    const id = req.params.id;
    req.body.picture_url = req.file.originalname;
    Photographer.findByIdAndUpdate({ _id: id }, { $set: req.body })
        .then(() => _sendResponse(process.env.HTTP_OK, process.env.UPDATE_SUCCESSFULL, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))

}

const partialUpdate = function (req, res) {
    const id = req.params.id;
    req.body.picture_url = req.file.originalname;
    Photographer.findByIdAndUpdate({ _id: id }, { $set: req.body })
        .then(() => _sendResponse(process.env.HTTP_OK, process.env.UPDATE_SUCCESSFULL, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
}

const deleteOne = function (req, res) {
    const photographerId = req.params.id;
    if (!photographerId) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_FOUND_EXCEPTION, res)
    }
    if (!mongoose.isValidObjectId(photographerId)) {
        _sendResponse(process.env.HTTP_BAD_REQUEST, process.env.ID_NOT_VALID_EXCEPTION, res)
    }
    Photographer.deleteOne({ _id: photographerId })
        .then(_sendResponse(process.env.HTTP_OK, process.env.RESOURCE_DELETED_MESSAGE, res))
        .catch(error => _sendResponse(process.env.HTTP_BAD_REQUEST, error, res))
}




module.exports = {
    getOne,
    getAll,
    create,
    fullUpdate,
    partialUpdate,
    deleteOne
}
