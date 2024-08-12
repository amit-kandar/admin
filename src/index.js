require("dotenv").config();
const app = require('./app');
const cloudinary = require('cloudinary').v2;
const logger = require('./config/logger');
const { connectToDatabase, synchronizeDatabase } = require('./database/index');

const PORT = process.env.PORT || 8000;

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

async function startServer() {
    try {
        // connect to database
        await connectToDatabase();

        // sync models with database
        await synchronizeDatabase();

        app.on("error", err => {
            logger.error("Error: ", err);
        })

        app.listen(PORT, () => {
            logger.info(`http://localhost:${PORT}`)
        })
    } catch (error) {
        logger.error('Error starting the server:', error);
    }
}

startServer()