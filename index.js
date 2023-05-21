const express = require('express');
const multer = require('multer');
const path = require('path');
const UPLOAD_FOLDER = './uploads/';

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename : (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                            .replace(fileExt, "")
                            .toLowerCase()
                            .split(" ")
                            .join("-") + "-" + Date.now();
        cb(null, fileName+fileExt);
    },
});


var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(new Error("only jpg, png or jpeg format allowed"));
        }
    },
});

const app = express();

app.post('/', upload.single("avatar"), (req, res) => {
    res.send('Successfully Uploaded..');
});

app.use((err, req, res, next) => {
    if(err) {
        res.status(500).send(err.message);
    } else {
        res.send("success");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});