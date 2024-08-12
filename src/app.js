const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error.middleware');
const { DATA_LIMIT } = require('./config/constant')

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" })); // need to know what is for

app.use(express.urlencoded({ extended: true, limit: DATA_LIMIT })); // this is also need to know what's for

app.use(express.static("public"));

app.use(cookieParser());

// import all routes here

app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).send("Hello World!")
})

module.exports = app;