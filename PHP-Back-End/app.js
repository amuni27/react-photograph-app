const express = require('express');
require('dotenv').config()
require("./data/db")
const path = require('path')
const cors = require('cors')
const router = require('./router')
const userRouter = require("./router/user")
const app = express()


app.use(cors())
app.use(express.json())
app.use(process.env.PHOTOGRAPHER_ENDPOINT, router)
app.use(process.env.AUTH_ENDPOINT, userRouter)

app.use(process.env.IMAGE_ENDPOINT, express.static(path.join(__dirname, "public")))

const server = app.listen(process.env.PORT, function () {
    const port = server.address().port;
    console.log(process.env.SERVER_LISTEN_MESSAGE + port);
})