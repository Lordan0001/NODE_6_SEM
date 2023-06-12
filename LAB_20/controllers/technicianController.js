const technicianRepo = require("../repositories/technicianRepository.js")

//views
exports.Update = async function (request, response) {
    try{
        const TechnicianID = request.params.TechID
        const message = await technicianRepo.getById(TechnicianID)
        console.log(message)
        if(message==null){
            throw new Error('Такого покупателя нет')
        }
        const {TechID,Name,Email,Phone} = message
        console.log(message)
        response.render('technicians/editTechnician',{TechID:TechID,Name:Name,Email:Email,Phone:Phone});
    }
    catch(e) {
        response.send(e.message);
    }
};
exports.Add = async function (request, response) {
    try{
        response.render('technicians/addTechnician');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.Index = async function (request, response) {
    try{
        response.render('technicians/technicians');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
//api
exports.GetAllTecnicians = async function (request, response) {
    try{
        const technicians =await technicianRepo.getAll()
        response.send(technicians);
    }
    catch {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.GetTechnicianById = async function (request, response) {
    try {
        const technicianId = request.params.technicianId
        const message = await technicianRepo.getById(technicianId)
        if(message==null){
            throw new Error("Работника с заданным id не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.InsertTechnician = async function (request, response) {
    try{
        const message = await technicianRepo.insert(request.body)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
};
exports.UpdateTechnician = async function(request,response){
    try{
        const message = await technicianRepo.update(request.body)
        if(message==null){
            throw new Error("Работника с заданным id не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
}
exports.DeleteTechnicianById = async function(request,response){
    try {
        const technicianId = request.params.technicianId
        const message = await technicianRepo.deleteById(technicianId)
        if(message==null){
            throw new Error("Работника с заданным id не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
}