const { URL_LOCAL: url } = process.env;
const { Op } = require("sequelize");
const slugify = require("slugify");

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

  generateSlug: (value) => {
    return slugify(value, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      trim: true,
    });
  },

  fetchRecords: async (
    model,
    options = {},
    paginate = false,
    unscoped = false
  ) => {
    let currentPage = 1,
      pageSize = 10;
    const queryMethod = unscoped ? model.unscoped() : model;

    let rows = [];
    if (paginate == true) {
      currentPage = parseInt(options.currentPage) || 1;
      pageSize = parseInt(options.pageSize) || 10;

      const offset = (currentPage - 1) * pageSize;
      options.limit = pageSize;
      options.offset = offset;
      delete options.currentPage;
      delete options.pageSize;
      delete options.is_paginate;
      rows = await queryMethod.findAll(options);
    } else {
      return await queryMethod.findAll(options);
    }

    const count = await queryMethod.count(options);
    const totalPages = Math.ceil(count / options.limit);

    return {
      totalItems: count,
      totalPages,
      currentPage,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
      previous: currentPage > 1 ? currentPage - 1 : null,
      next: currentPage < totalPages ? currentPage + 1 : null,
      rows,
    };
  },

  getFilterClause: (filterData) => {
    const { fields, search } = filterData;
    const [firstName, lastName] = search.trim().split(" ");
    return fields.includes("userName") && firstName && lastName
      ? {
          [Op.and]: [
            { first_name: { [Op.iLike]: `%${firstName}%` } },
            { last_name: { [Op.iLike]: `%${lastName}%` } },
          ],
        }
      : {
          [Op.or]: fields
            .map((field) => {
              if (field === "userName") {
                return [
                  { first_name: { [Op.iLike]: `%${firstName || search}%` } },
                  { last_name: { [Op.iLike]: `%${lastName || search}%` } },
                ];
              }
              return {
                [field]: { [Op.iLike]: `%${search.replace(/%/g, "\\%")}%` },
              };
            })
            .flat(),
        };
  },
};
