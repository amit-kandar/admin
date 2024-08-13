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

app.use(express.json({ limit: DATA_LIMIT }));

app.use(express.urlencoded({ extended: true, limit: DATA_LIMIT }));

app.use(express.static("public"));

app.use(cookieParser());

// import all routes here
const authRoute = require('./routes/auth.route');
const employeeRoute = require('./routes/employee.route');

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/employee', employeeRoute);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).send("Hello World!")
})

module.exports = app;