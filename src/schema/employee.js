const Joi = require('joi');

const create_schema = Joi.object({
    f_name: Joi.string().min(3).max(50).optional().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters'
    }),
    f_email: Joi.string().email().optional().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    f_mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.empty': 'Mobile number is required',
        'string.pattern.base': 'Mobile number must be a valid 10-digit number'
    }),
    f_designation: Joi.string().valid('HR', 'Manager', 'Sales').optional().messages({
        'string.empty': 'Designation is required'
    }),
    f_gender: Joi.string().valid('M', 'F').optional().messages({
        'any.only': 'Gender must be one of Male, Female, or Other',
        'string.empty': 'Gender is required'
    }),
    f_course: Joi.string().valid('MCA', 'BCA', 'BSC').optional().messages({
        'string.empty': 'Course is required'
    }),
});

const update_schema = Joi.object({
    f_name: Joi.string().min(3).max(50).allow(null, "").optional().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters'
    }),
    f_email: Joi.string().email().allow(null, "").optional().messages({
        'string.email': 'Email must be a valid email address'
    }),
    f_mobile: Joi.string().pattern(/^[0-9]{10}$/).allow(null, "").optional().messages({
        'string.pattern.base': 'Mobile number must be a valid 10-digit number'
    }),
    f_designation: Joi.string().valid('HR', 'Manager', 'Sales').allow(null, "").optional(),
    f_gender: Joi.string().valid('M', 'F').allow(null, "").optional().messages({
        'any.only': 'Gender must be one of Male, Female, or Other'
    }),
    f_course: Joi.string().valid('MCA', 'BCA', 'BSC').allow(null, "").optional(),
});

module.exports = { create_schema, update_schema };