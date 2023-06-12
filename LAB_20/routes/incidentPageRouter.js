const express = require("express");
const incidentController = require("../controllers/incidentController.js");
const incidentPageRouter = express.Router();

incidentPageRouter.get("/index", incidentController.Index);
incidentPageRouter.get("/add",incidentController.Add);
incidentPageRouter.get("/:incidentId", incidentController.Update);

module.exports = incidentPageRouter;