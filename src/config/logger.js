const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const custom_format = printf(function (info) {
    const level = info.level;
    const message = info.message;
    const time = info.timestamp;
    return '[' + time + '] [' + level + '] ' + message;
});

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue'
    }
};

const developmentLogger = function () {
    return winston.createLogger({
        levels: customLevels.levels,
        format: combine(
            colorize({ all: true, colors: customLevels.colors }),
            timestamp({ format: "YY-MM-DD HH:MM:SS" }),
            custom_format,
        ),
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/warn.log', level: 'warning' }),
            new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
            new winston.transports.Console(),
        ],
    });
}

const productionLogger = function () {
    return winston.createLogger({
        levels: customLevels.levels,
        format: combine(
            colorize({ all: true, colors: customLevels.colors }),
            timestamp(),
            custom_format,
        ),
        transports: [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/warn.log', level: 'warning' }),
            new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
            new winston.transports.Console(),
        ],
    });
}

let logger = developmentLogger();

if (process.env.NODE_ENV === 'production') {
    logger = productionLogger();
}

module.exports = logger;