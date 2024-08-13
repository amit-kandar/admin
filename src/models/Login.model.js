const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [4, 50]
            }
        },
        f_pwd: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 100]
            }
        }
    }, {
        tableName: "t_login",
        timestamps: true,
        hooks: {
            beforeCreate: async (login) => {
                if (login.f_pwd) {
                    login.f_pwd = await bcrypt.hash(login.f_pwd, 10);
                }

            },
            beforeUpdate: async (login) => {
                if (login.changed('f_pwd')) {
                    login.f_pwd = await bcrypt.hash(login.f_pwd, 10);
                }
            }
        }
    });

    Login.prototype.comparePassword = async function (password) {
        return bcrypt.compare(password, this.f_pwd)
    }

    return Login;
};