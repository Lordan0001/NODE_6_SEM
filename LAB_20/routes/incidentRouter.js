const express = require("express");
const incidentController = require("../controllers/incidentController.js");
const incidentRouter = express.Router();

incidentRouter.get("/", incidentController.GetAllIncidents);
incidentRouter.get("/:incidentId", incidentController.GetIncidentById);
incidentRouter.delete("/:incidentId", incidentController.DeleteIncidentById);
incidentRouter.post("/",incidentController.InsertIncident);
incidentRouter.put("/",incidentController.UpdateIncident);
// {
//     console.log(req.body);
//     await customerController.GetCustomerById(req,res)
// });

module.exports = incidentRouter;