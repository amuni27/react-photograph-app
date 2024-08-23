const mongoose = require("mongoose")

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdYear: {
        type: Date,
        required: true,
    },
    picture_url: {
        type: String,
        required: true
    }
});

const photographerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true,
    },
    picture_url: {
        type: String,
        required: true
    },
    artworks: [artworkSchema]
});



mongoose.model(process.env.PHOTOGRAPHER_MODEL, photographerSchema);
