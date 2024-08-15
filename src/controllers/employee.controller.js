const { Employee } = require('../database');
const { create_schema, update_schema } = require('../schema/employee');
const APIError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');
const { uploadToCloudinary } = require('../utils/cloudinary');
const cloudinary = require('cloudinary').v2;
const { Op } = require('sequelize');

// create employee
const createEmployee = async (req, res, next) => {
    try {
        // get data
        const { f_name, f_email, f_mobile, f_designation, f_gender, f_course } = req.body;
        // get image
        const f_image = req.file?.path || "public/assets/default.jpg";

        // validate data
        const { error } = create_schema.validate({ f_name, f_email, f_mobile, f_designation, f_gender, f_course });
        if (error) {
            throw new APIError(400, error)
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
            throw new APIError(400, "Failed To Upload image");
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

        res.status(201).json(new APIResponse(201, "Employee created successfully."));
    } catch (error) {
        next(error);
    }
}

// edit employee
const editEmployee = async (req, res, next) => {
    try {
        // check data is exists or not
        const f_id = req.params.f_id;

        const employee = await Employee.findOne({ where: { f_id: f_id } });
        if (!employee) {
            throw new APIError(400, "Employee does not exists for update.")
        }

        // get data
        const { f_name, f_email, f_mobile, f_designation, f_gender, f_course } = req.body;

        // validate the data
        const { error } = update_schema.validate({ f_name, f_email, f_mobile, f_designation, f_gender, f_course });
        if (error) {
            throw new APIError(400, error.details[0].message)
        }

        const info = {
            f_name,
            f_email,
            f_mobile,
            f_designation,
            f_gender,
            f_course,
        }

        // Filter out any null or empty string values
        Object.keys(info).forEach(key => {
            if (info[key] === '' || info[key] === null) {
                delete info[key];
            }
        });

        // Upload image if present
        if (req.file && req.file.path) {
            const f_image = req.file.path;
            console.log(f_image);

            const f_image_upload = await uploadToCloudinary(f_image, "employee");

            // check successfull upload
            if (typeof f_image_upload !== 'object' || !f_image_upload.hasOwnProperty('url')) {
                throw new APIError(400, "Failed To Upload image");
            }

            const { url, public_id } = f_image_upload;
            info.f_image_url = url;
            info.f_image_id = public_id;

            const oldPublicId = employee.f_image_id;
            if (!oldPublicId) {
                throw new APIError(400, "Previous Public Id Not Found");
            }

            await cloudinary.uploader.destroy(oldPublicId);
        }

        // update the data
        const response = await Employee.update(info, {
            where: { f_id: f_id },
            validate: false
        });

        // check the update operation
        if (!response) {
            throw new APIError(400, "Failed to update employee");
        }

        // send the response
        res.status(200).json(new APIResponse(200, "Employee update successfully", response))
    } catch (error) {
        next(error);
    }
};

// delete employee
const deleteEmployee = async (req, res, next) => {
    try {
        // get id
        const f_id = req.params.f_id;

        // check employee exists or not
        const employee = await Employee.findOne({ where: { f_id: f_id } });
        if (!employee) {
            throw new APIError(400, "Employee does not exists for delete");
        }

        // delete from database
        const response = await Employee.destroy({ where: { f_id } });
        if (!response) {
            throw new APIError(400, "Failed delete the employee");
        }

        res.status(200).json(new APIResponse(200, "Employee deleted successfully."));
    } catch (error) {
        next(error);
    }
}
// get all employee with pagination
const getAllEmployee = async (req, res, next) => {
    try {
        // Get pagination parameters from the query string, with default values
        const { page = 1, limit = 10, search = '', sortField = 'f_id', sortDirection = 'asc' } = req.query;
        const offset = (page - 1) * limit;

        // Build the sort condition
        const order = [[sortField, sortDirection]];

        // Define the search condition (filtering by name or email in this case)
        const searchCondition = {
            [Op.or]: [
                { f_name: { [Op.like]: `%${search}%` } },
                { f_mobile: { [Op.like]: `%${search}%` } },
                { f_course: { [Op.like]: `%${search}%` } },
                { f_designation: { [Op.like]: `%${search}%` } },
                { f_email: { [Op.like]: `%${search}%` } }
            ]
        };

        // Get paginated employees with search and sort
        const { count, rows: employees } = await Employee.findAndCountAll({
            where: search ? searchCondition : {},
            offset: parseInt(offset),
            limit: parseInt(limit),
            order,  // Apply sorting
        });

        // Check if there is any failure
        if (!employees) {
            throw new APIError(400, "Failed to retrieve employees");
        }

        // Send the response to the user
        res.status(200).json(new APIResponse(200, "Successfully retrieved employees.", {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            employees,
        }));
    } catch (error) {
        next(error);
    }
};

// active employee
// deactive employee

module.exports = { createEmployee, editEmployee, deleteEmployee, getAllEmployee }