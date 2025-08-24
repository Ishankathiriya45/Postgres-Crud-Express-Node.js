const {
  CommonUtil: { isEmpty, generateFileName, getFileUrl },
} = require("../../util");
const path = require("path");
const fs = require("fs");

class FileService {
  uploadFile = async (file, foldername, storagetype) => {
    if (storagetype == "disk") {
      if (isEmpty(file)) {
        throw new Error("File not found");
      }
      const uploadDir = path.join(
        __dirname,
        "../../../public/uploads",
        foldername
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = generateFileName(file.originalname);
      const filePath = path.join(uploadDir, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      return { fileName, location: getFileUrl(foldername, fileName) };
    }
  };

  unlinkFile = (file, foldername, storagetype) => {
    if (storagetype == "disk") {
      if (isEmpty(file)) {
        throw new Error("File not found");
      }
      const uploadDir = path.join(
        __dirname,
        "../../../public/uploads",
        foldername
      );

      const filePath = path.join(uploadDir, file);
      const exist = fs.existsSync(filePath);

      if (exist) {
        fs.unlinkSync(filePath);
        return { success: true, message: "File deleted successfully" };
      } else {
        return { success: false, message: "File does not exist" };
      }
    }
  };
}

module.exports = FileService;
