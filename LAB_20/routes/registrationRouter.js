const express = require("express");
const registrationController = require("../controllers/registrationController.js");
const registrationRouter = express.Router();

registrationRouter.get("/", registrationController.GetAllRegistrations);
registrationRouter.get("/:customerId", registrationController.GetRegistrationsByCustomerId);
registrationRouter.delete("/:customerId/:productCode", registrationController.DeleteRegistrationByCustomerIdAndProductCode);
registrationRouter.post("/",registrationController.InsertRegistration);
// {
//     console.log(req.body);
//     await customerController.GetCustomerById(req,res)
// });

module.exports = registrationRouter;