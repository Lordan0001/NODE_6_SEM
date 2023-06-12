const incidentRepo = require("../repositories/incidentRepository.js")

//views
exports.Update = async function (request, response) {
    try{
        const incidentId = request.params.incidentId
        const message = await incidentRepo.getById(incidentId)
        console.log(message)
        if(message==null){
            throw new Error('Такого инцидента нет')
        }
        const {IncidentID,CustomerID,ProductCode,TechID,DateOpened,DateClosed,Title,Description} = message
        console.log(message)
        response.render('incidents/editIncident',{
            IncidentID:IncidentID,CustomerID:CustomerID,ProductCode:ProductCode,TechID:TechID,
            DateOpened:DateOpened,DateClosed:DateClosed,Title:Title,Description:Description});
    }
    catch(e) {
        response.send(e.message);
    }
};
exports.Add = async function (request, response) {
    try{
        response.render('incidents/addIncident');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.Index = async function (request, response) {
    try{
        response.render('incidents/incidents');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
//api
exports.GetAllIncidents = async function (request, response) {
    try{
        const incidents =await incidentRepo.getAll()
        response.send(incidents);
    }
    catch {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.GetIncidentById = async function (request, response) {
    try {
        const incidentId = request.params.incidentId
        const message = await incidentRepo.getById(incidentId)
        if(message==null){
            throw new Error("Такого инцидента не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.InsertIncident = async function (request, response) {
    try{
        const message = await incidentRepo.insert(request.body)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
};
exports.UpdateIncident = async function(request,response){
    try{
        const message = await incidentRepo.update(request.body)
        if(message==null){
            throw new Error("Такого инцидента не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
}
exports.DeleteIncidentById = async function(request,response){
    try {
        const incidentId = request.params.incidentId
        const message = await incidentRepo.deleteById(incidentId)
        if(message==null){
            throw new Error("Такого инцидента не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
}