const {
  DataService: { ProductService },
  IntegrationService: { FileService },
} = require("../../../service");
const {
  ApiResponse: { successResponse, serverError, failConflict, notFound },
} = require("../../../responses");
const {
  CommonUtil: { generateSlug, isEmpty, getFilterClause },
} = require("../../../util");
const { where } = require("sequelize");

class ProductController {
  constructor() {
    this.productService = new ProductService();
    this.fileService = new FileService();
  }

  create = async (req, res) => {
    try {
      const { devicename } = req.headers;
      const { name, category, price, rating } = req.body;
      const file = req.file;

      const getProduct = await this.productService.findOne({
        where: {
          name: name,
        },
      });
      if (!isEmpty(getProduct)) {
        return failConflict(0, "Product already exist", null);
      }

      const upload = await this.fileService.uploadFile(
        file,
        "products",
        "disk"
      );

      const productPayload = {
        logo: upload.fileName,
        name,
        slug: generateSlug(name),
        category,
        price,
        rating,
      };

      const product = await this.productService.create(productPayload);

      return successResponse(
        1,
        "Product created successfully",
        devicename,
        product
      );
    } catch (error) {
      const errorMsg = typeof error == "string" ? error : error.message;
      return serverError(0, "Something went wrong", errorMsg);
    }
  };

  list = async (req, res) => {
    try {
      const { devicename } = req.headers;
      const { currentPage, pageSize, isPaginate = true, search } = req.query;
      let options = {};

      if (!isEmpty(search)) {
        options.where = {
          ...options.where,
          ...getFilterClause({
            fields: ["name"],
            search,
          }),
        };
      }

      if (isPaginate) {
        options.currentPage = currentPage;
        options.pageSize = pageSize;
        options.is_paginate = isPaginate;
      }

      const product = await this.productService.findAllWithoutScope(options);

      return successResponse(
        1,
        "Retrieve product list successfully",
        devicename,
        product
      );
    } catch (error) {
      const errorMsg = typeof error == "string" ? error : error.message;
      return serverError(0, "Something went wrong", errorMsg);
    }
  };

  update = async (req, res) => {
    try {
      const { devicename } = req.headers;
      const { productId } = req.params;
      const { name, category, price, rating } = req.body;
      const file = req.file;
      let imageFile;

      const getProduct = await this.productService.findById(productId);
      if (isEmpty(getProduct)) {
        return notFound(0, "Product not found", null);
      }

      if (!isEmpty(file)) {
        const upload = await this.fileService.uploadFile(
          file,
          "products",
          "disk"
        );
        imageFile = upload.fileName;
      }

      const productRequestPayload = {
        ...(imageFile && { logo: imageFile }),
        ...(name && { name: name }),
        ...(name && { slug: generateSlug(name) }),
        ...(category && { category: category }),
        ...(price && { price: price }),
        ...(rating && { rating: rating }),
      };

      const product = await this.productService.update(productRequestPayload, {
        where: {
          id: productId,
        },
      });

      return successResponse(
        1,
        "Product updated successfully",
        devicename,
        product
      );
    } catch (error) {
      const errorMsg = typeof error == "string" ? error : error.message;
      return serverError(0, "Something went wrong", errorMsg);
    }
  };

  delete = async (req, res) => {
    try {
      const { devicename } = req.headers;
      const { productId } = req.params;

      const product = await this.productService.deleteById(productId);

      return successResponse(
        1,
        "Product deleted successfully",
        devicename,
        null
      );
    } catch (error) {
      const errorMsg = typeof error == "string" ? error : error.message;
      return serverError(0, "Something went wrong", errorMsg);
    }
  };

  activeDeactivate = async (req, res) => {
    try {
      const { devicename } = req.headers;
      const { productId, type } = req.params;

      const product = await this.productService.update(
        { is_active: type == "activate" ? true : false },
        {
          where: {
            id: productId,
          },
        },
        true
      );

      return successResponse(
        1,
        `Product ${type} successfully`,
        devicename,
        product
      );
    } catch (error) {
      const errorMsg = typeof error == "string" ? error : error.message;
      return serverError(0, "Something went wrong", errorMsg);
    }
  };
}

module.exports = ProductController;
