const express = require("express");
const technicianController = require("../controllers/technicianController.js");
const technicianRouter = express.Router();

technicianRouter.get("/", technicianController.GetAllTecnicians);
technicianRouter.get("/:technicianId", technicianController.GetTechnicianById);
technicianRouter.delete("/:technicianId", technicianController.DeleteTechnicianById);
technicianRouter.post("/",technicianController.InsertTechnician);
technicianRouter.put("/",technicianController.UpdateTechnician);
// {
//     console.log(req.body);
//     await customerController.GetCustomerById(req,res)
// });

module.exports = technicianRouter;