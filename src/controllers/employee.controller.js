const { Employee } = require('../database');
const { schema } = require('../schema/employee');
const APIError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');
const { uploadToCloudinary } = require('../utils/cloudinary');

// create employee
const createEmployee = async (req, res, next) => {
    try {
        // get data
        const { f_name, f_email, f_mobile, f_designation, f_gender, f_course } = req.body;
        // get image
        const f_image = req.file?.f_image || "public/assets/default.jpg";

        // validate data
        const { error } = schema.validate({ f_name, f_email, f_mobile, f_designation, f_gender, f_course });
        if (error) {
            throw new APIError(400, "Invalid input" + error)
        }
        // check email dupplicate
        const employee = await Employee.findOne({ where: { f_email } });

        if (employee) {
            throw new APIError(409, "Employee with this email already exists.");
        }

        // upload to cloudinary
        const f_image_upload = await uploadToCloudinary(f_image, "employee");

        // check successfull upload
        if (typeof f_image_upload !== 'object' || !f_image_upload.hasOwnProperty('url')) {
            throw new APIError(400, "Failed To Upload Cover Image");
        }

        const { url, public_id } = f_image_upload;

        const response = await Employee.create({
            f_name,
            f_email,
            f_designation,
            f_course,
            f_gender,
            f_image_url: url,
            f_image_id: public_id,
            f_mobile
        });

        if (!response) {
            throw new APIError(400, "Failed to create new employee");
        }

        res.status(201).json(new APIResponse(201, "Employee created successfully.", response));
    } catch (error) {
        next(error);
    }
}
// edit employee
// delete employee
// view employee
// get all employee with pagination and also sorting by name, email, id, date
// active employee
// deactive employee
// add search filter

module.exports = { createEmployee }