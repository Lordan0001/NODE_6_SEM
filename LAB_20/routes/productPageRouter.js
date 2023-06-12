const express = require("express");
const productController = require("../controllers/productController.js");
const productPageRouter = express.Router();

productPageRouter.get("/index", productController.Index);
productPageRouter.get("/add",productController.Add);
productPageRouter.get("/:productCode", productController.Update);

module.exports = productPageRouter;