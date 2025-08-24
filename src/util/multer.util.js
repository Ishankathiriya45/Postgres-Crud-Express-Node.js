const path = require("path");
const multer = require("multer");

module.exports = {
  fileUpload: () => {
    const allowedExtension = [
      "png",
      "jpg",
      "jpeg",
      "svg",
      "pdf",
      "docx",
      "glb",
    ];

    const fileFilter = (req, file, cb) => {
      const extension = path
        .extname(file.originalname)
        .toLowerCase()
        .substring(1);

      if (!allowedExtension.includes(extension)) {
        const error = new Error(
          `Invalid file type: ${extension}. Allow types ${allowedExtension.join(
            ","
          )}`
        );
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      } else {
        cb(null, true);
      }
    };

    return multer({ fileFilter });
  },
};
