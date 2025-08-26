const {
  DataService: { ProductService },
} = require("../../../service");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  create = async (req, res) => {};
}

module.exports = ProductController;
