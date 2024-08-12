const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Login = sequelize.define('Login', {
        f_sno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        f_userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        f_pwd: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: "t_login",
        timestamps: true
    });
    return Login;
};