const { ProductRepository } = require("../../repository");

class ProductService {
  findById = async (id, options) => {
    return await ProductRepository.findById(id, options);
  };

  findOne = async (options) => {
    return await ProductRepository.findOne(options);
  };

  findAll = async (options = {}) => {
    return await ProductRepository.findAll(options);
  };

  // get all record without  apply default scope
  findAllWithoutScope = async (option = {}) => {
    return await ProductRepository.findAll(option, true);
  };

  create = async (requestData, transaction) => {
    return await ProductRepository.create(requestData, transaction);
  };

  bulkCreate = async (requestData, transaction) => {
    return await ProductRepository.bulkCreate(requestData, transaction);
  };

  update = async (requestData, options, unscoped) => {
    return await ProductRepository.update(requestData, options, unscoped);
  };

  findAndUpdateById = async (requestData, id) => {
    let data = await ProductRepository.findById(id);
    if (data) {
      data = await data.update(requestData, {
        where: {
          id: id,
        },
      });
    }
    return data;
  };

  // soft delete record
  deleteById = async (id) => {
    return await ProductRepository.destroy({
      where: {
        id: id,
      },
    });
  };

  // hard delete record
  destroyById = async (id) => {
    return await ProductRepository.destroy({
      where: {
        id: id,
      },
      force: true,
    });
  };

  // restore data which is delete with soft delete
  restoreById = async (id) => {
    return await ProductRepository.restore({
      where: {
        id: id,
      },
    });
  };
}
module.exports = ProductService;
