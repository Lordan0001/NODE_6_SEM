const express = require("express");
const registrationController = require("../controllers/registrationController.js");
const registrationPageRouter = express.Router();

registrationPageRouter.get("/index", registrationController.Index);
registrationPageRouter.get("/add",registrationController.Add);

module.exports = registrationPageRouter;