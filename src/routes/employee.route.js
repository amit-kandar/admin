const express = require('express');
const { upload } = require('../middlewares/multer.middleware');
const { createEmployee } = require('../controllers/employee.controller');
const router = express.Router();

router.post('/', upload.single('f_image'), createEmployee);

module.exports = router;