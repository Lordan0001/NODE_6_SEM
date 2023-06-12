const express = require("express");
const technicianController = require("../controllers/technicianController.js");
const technicianPageRouter = express.Router();

technicianPageRouter.get("/index", technicianController.Index);
technicianPageRouter.get("/add",technicianController.Add);
technicianPageRouter.get("/:TechID", technicianController.Update);

module.exports = technicianPageRouter;