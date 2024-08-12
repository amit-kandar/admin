const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

class APIError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], data = null) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = data;

        const directoryPath = "public/temp/";

        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                logger.error('Error reading directory:', { error: err });
                return;
            }

            files.forEach(function (file) {
                if (path.extname(file) === ".png") {
                    const filePath = path.join(directoryPath, file);
                    fs.unlink(filePath, function (error) {
                        if (error) {
                            logger.error('Error deleting file ' + filePath + ':', { error: error });
                        }
                    });
                }
            });
        });
    }
}

module.exports = APIError;