const Joi = require('joi');

const schema = Joi.object({
    f_name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters'
    }),
    f_email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    f_mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.empty': 'Mobile number is required',
        'string.pattern.base': 'Mobile number must be a valid 10-digit number'
    }),
    f_designation: Joi.string().valid('HR', 'Manager', 'Sales').required().messages({
        'string.empty': 'Designation is required'
    }),
    f_gender: Joi.string().valid('M', 'F').required().messages({
        'any.only': 'Gender must be one of Male, Female, or Other',
        'string.empty': 'Gender is required'
    }),
    f_course: Joi.string().valid('MCA', 'BCA', 'BSC').required().messages({
        'string.empty': 'Course is required'
    }),
});

module.exports = { schema };