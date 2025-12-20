import multer from "multer"

// Multer storage configuration: this defines how and where the uploaded files will be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads") // Save files in the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname) // Set the filename for uploaded  files
    }
})

// Create multer upload middleware
const upload = multer({ storage })

export default upload
