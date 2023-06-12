const express = require("express");
const customerController = require("../controllers/customerController.js");
const customerRouter = express.Router();

customerRouter.get("/", customerController.GetAllCustomers);
customerRouter.get("/:customerId", customerController.GetCustomerById);
customerRouter.delete("/:customerId", customerController.DeleteCustomerById);
customerRouter.post("/",customerController.InsertCustomer);
customerRouter.put("/",customerController.UpdateCustomer);
// {
//     console.log(req.body);
//     await customerController.GetCustomerById(req,res)
// });

module.exports = customerRouter;