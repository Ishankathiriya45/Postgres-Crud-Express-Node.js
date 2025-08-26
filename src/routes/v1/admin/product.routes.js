const router = require("express").Router();
const {
  AdminModule: { ProductController },
} = require("../../../controller/v1");

const productCtrl = new ProductController();

router.post("/create", async (req, res) => {
  const result = await productCtrl.create(req, res);
  return res.status(result.status).send(result);
});

module.exports = router;
