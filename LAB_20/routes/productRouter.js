const express = require("express");
const productController = require("../controllers/productController.js");
const productRouter = express.Router();

productRouter.get("/", productController.GetAllProducts);
productRouter.get("/:productCode", productController.GetProductById);
productRouter.delete("/:productCode", productController.DeleteProductById);
productRouter.post("/",productController.InsertProduct);
productRouter.put("/",productController.UpdateProduct);
// {
//     console.log(req.body);
//     await customerController.GetCustomerById(req,res)
// });

module.exports = productRouter;