const mongoose = require("mongoose");
require('dotenv').config()
require('../model/photographer')
require('../model/user')

const mongodbIsConnected = function () {
    console.log(process.env.MONGODB_CONNECTED + process.env.DB_NAME )
}

const mongodbIsDisconnected = function () {
    console.log(process.env.MONGODB_DISCONNECTED);
}

const mongodbError = function (err) {
    console.log(process.env.MONGODB_ERROR + err)
}

mongoose.connect(process.env.MONGODB_URL+"/"+process.env.DB_NAME)

mongoose.connection.on(process.env.CONNECTED, mongodbIsConnected)
mongoose.connection.on(process.env.DISCONNECTED, mongodbIsDisconnected)
mongoose.connection.on(Error, mongodbError)
process.on(process.env.SIGINT, function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});
process.on(process.env.SIGTERM, function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGTERM_MESSAGE);
        process.exit(0);
    });
});
process.once(process.env.SIGUSR2, function () {
    mongoose.connection.close(function () {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.kill(process.pid, process.env.SIGUSR2);
    });
});