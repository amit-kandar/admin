const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define("Employee", {
        f_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        f_image_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        f_image_id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        f_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4, 50]
            }
        },
        f_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            }
        },
        f_mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 15],
            }
        },
        f_designation: {
            type: DataTypes.ENUM('HR', 'Manager', 'Sales'),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        f_gender: {
            type: DataTypes.ENUM('M', 'F'),
            allowNull: false,
        },
        f_course: {
            type: DataTypes.ENUM('MCA', 'BCA', 'BSC'),
            allowNull: true,
            validate: {
                len: [0, 100],
            }
        },
    }, {
        tableName: "t_employee",
        timestamps: true,
    });
    return Employee;
}