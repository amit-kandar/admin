const { Login } = require('../database/index');
const APIError = require('../utils/APIError');
const APIResponse = require('../utils/APIResponse');
const { schema } = require('../schema/auth');

const register = async (req, res, next) => {
    try {
        // get the data
        const { username, password } = req.body;

        // validate data
        const { error } = schema.validate({
            username,
            password
        })
        if (error) {
            throw new APIError(400, "Invalid input" + error)
        }

        // check already exists or not by using userName
        const user = await Login.findOne({ where: { f_userName: username } })
        if (user) {
            throw new APIError(409, "Admin already exists");
        }

        // store the data
        const response = await Login.create({ f_userName: username, f_pwd: password });
        if (!response) {
            throw new APIError(400, "Failed to add new admin")
        }

        // send the response
        res.status(201).json(new APIResponse(201, "Admin created successfully"))
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        // get the data
        const { username, password } = req.body;

        // validate data
        const { error } = schema.validate({
            username,
            password
        })
        if (error) {
            throw new APIError(400, "Invalid input: " + error)
        }

        // check already exists or not by using userName
        const user = await Login.findOne({ where: { f_userName: username } })
        if (!user) {
            throw new APIError(401, "Unauthorized: Admin does not exists.");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new APIError(401, "Unauthorized: Incorrect password.")
        }

        const { f_pwd, ...userWithOutPassword } = user.toJSON();

        res.status(200).json(new APIResponse(200, "Logged in successfully", userWithOutPassword));

    } catch (error) {
        next(error);
    }
}

module.exports = { register, login };