const { Sequelize } = require('sequelize');
const logger = require('../config/logger.js');

const info = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB
};

const sequelize = new Sequelize(info.DB, info.USER, info.PASSWORD, {
    host: info.HOST,
    dialect: 'mysql'
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Connected to the database!');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        process.exit(1); // Exit the process if unable to connect
    }
}

const LoginModel = require('../models/Login.model.js')(sequelize);

// Define associations
// models.Footer.hasMany(models.SocialMedia, { as: 'social_media' });
// models.Footer.hasMany(models.PagePath, { as: 'page_path' });
// models.Footer.hasMany(models.Course, { as: 'course' });
// models.Price.hasMany(models.PriceFeaturesList, { as: 'pricing_features' });

async function synchronizeDatabase() {
    try {
        await sequelize.sync({ force: false });
        logger.info('Database synchronized!');
    } catch (error) {
        logger.error('Error synchronizing database:', error);
        process.exit(1); // Exit the process if sync fails
    }
}

module.exports = { sequelize, connectToDatabase, synchronizeDatabase, LoginModel };