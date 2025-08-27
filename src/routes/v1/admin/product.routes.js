const router = require("express").Router();
const {
  AdminModule: { ProductController },
} = require("../../../controller/v1");
const {
  MulterUtil: { fileUpload },
} = require("../../../util");
const {
  ValidationMiddleware: { typeCheck },
} = require("../../../middleware");

const productCtrl = new ProductController();

router.post("/create", fileUpload().single("logo"), async (req, res) => {
  const result = await productCtrl.create(req, res);
  return res.status(result.status).send(result);
});

router.get("/list", async (req, res) => {
  const result = await productCtrl.list(req, res);
  return res.status(result.status).send(result);
});

router.put(
  "/:productId/update",
  fileUpload().single("logo"),
  async (req, res) => {
    const result = await productCtrl.update(req, res);
    return res.status(result.status).send(result);
  }
);

router.delete("/:productId/delete", async (req, res) => {
  const result = await productCtrl.delete(req, res);
  return res.status(result.status).send(result);
});

router.put(
  "/:productId/:type",
  typeCheck(["activate", "deactivate"]),
  async (req, res) => {
    const result = await productCtrl.activeDeactivate(req, res);
    return res.status(result.status).send(result);
  }
);

module.exports = router;
