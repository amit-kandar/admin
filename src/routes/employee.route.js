const express = require('express');
const { upload } = require('../middlewares/multer.middleware');
const { createEmployee, editEmployee, deleteEmployee, getAllEmployee } = require('../controllers/employee.controller');
const router = express.Router();

router.post('/', upload.single('f_image'), createEmployee);
router.get('/', getAllEmployee)
router.put('/:f_id', upload.single('f_image'), editEmployee);
router.delete('/:f_id', deleteEmployee);

module.exports = router;