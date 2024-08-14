const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const randomTwelveDigits = Math.floor(100000000000 + Math.random() * 900000000000);
        const ext = path.extname(file.originalname).toLowerCase();
        const fileName = `${randomTwelveDigits}${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .jpg and .png files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = { upload };