const {
  db: { Product },
} = require("../db/models");
const {
  CommonUtil: { fetchRecords },
} = require("../util");

class ProductRepository {
  findById = async (id) => {
    return await Product.findByPk(id);
  };

  findOne = async (option) => {
    return await Product.findOne(option);
  };

  findAll = async (options, unscoped = false) => {
    return await fetchRecords(Product, options, options?.is_paginate, unscoped);
  };

  update = async (requestData, options, unscoped = false) => {
    const queryData = (await Product.unscoped) ? Product.unscoped() : Product();
    return await queryData.update(requestData, options, unscoped);
  };

  create = async (requestPayload, transaction = null) => {
    return transaction
      ? await Product.create(requestPayload, { transaction })
      : await Product.create(requestPayload);
  };

  bulkCreate = async (requestPayload, transaction = null) => {
    return transaction
      ? await Product.bulkCreate(requestPayload, { transaction })
      : await Product.bulkCreate(requestPayload);
  };

  destroy = async (options) => {
    return await Product.destroy(options);
  };

  restore = async (options) => {
    return await Product.restore(options);
  };
}

module.exports = new ProductRepository();
