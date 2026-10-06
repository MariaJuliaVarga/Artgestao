import multer from 'multer';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {

        const nome =
            Date.now() + '-' + file.originalname;

        cb(null, nome);
    }

});

const upload = multer({
    storage: storage
});

export default upload;