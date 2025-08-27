const crypto = require("node:crypto");
const { Buffer } = require("node:buffer");
const {
  ENCRYPTION_SECRET_KEY_LOCAL: password,
  ENCRYPTION_ALGORITHM_LOCAL: algorithm,
} = process.env;
const key = crypto.scryptSync(password, "salt", 32);

module.exports = {
  encryptData: (data) => {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encryptedData = cipher.update(data, "utf8", "hex");
      encryptedData += cipher.final("hex");
      return iv.toString("hex") + ":" + encryptedData;
    } catch (error) {
      return error;
    }
  },
};
