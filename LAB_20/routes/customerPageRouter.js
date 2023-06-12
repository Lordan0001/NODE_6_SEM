const express = require("express");
const customerController = require("../controllers/customerController.js");
const customerPageRouter = express.Router();

customerPageRouter.get("/index", customerController.Index);
customerPageRouter.get("/add",customerController.Add);
customerPageRouter.get("/:customerId", customerController.Update);

module.exports = customerPageRouter;