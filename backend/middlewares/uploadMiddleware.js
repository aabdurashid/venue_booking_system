const multer = require('multer');
const path = require('path');

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Fayllar "uploads/" papkasiga saqlanadi
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname); // To'g'ri fayl nomi
    },
});

const upload = multer({ storage: photoStorage });

module.exports = upload;