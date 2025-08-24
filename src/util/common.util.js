const { URL_LOCAL: url } = process.env;

const isEmpty = (value) => {
  if (typeof value == "undefined" || value == null) return true;

  if (typeof value == "string") {
    return ["", "null", "undefine"].includes(value.trim());
  }

  if (Array.isArray(value) || typeof value == "object") {
    return Object.keys(value).length == 0;
  }
};

module.exports = {
  isEmpty,

  generateFileName: (name) => {
    const filePart = name.split(".").pop();
    return `${Date.now()}.${filePart}`;
  },

  getFileUrl: (foldername, filename) => {
    return `${url}/public/uploads/${foldername}/${filename}`;
  },
};
