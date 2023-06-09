const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, './uploads');
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        if (fileExt !== '.jpg' || fileExt !== '.png' || fileExt !== '.jpeg') {
            return cb(new Error('Only images with .jpg/.jpeg and .png formats are allowed'))
        }
        cb(null, true)
    },
    limits: {
        fileSize: 100000
    }
});

module.exports = { upload };