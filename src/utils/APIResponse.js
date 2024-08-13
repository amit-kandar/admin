const logger = require('../config/logger');

class APIResponse {
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.timestamp = new Date();

        // Log the API response creation
        logger.info(`API Response - Status: ${statusCode}, Message: ${message}`);
    }
}

module.exports = APIResponse;
