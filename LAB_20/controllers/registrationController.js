const registrationRepo = require("../repositories/registrationRepository.js")

exports.Add = async function (request, response) {
    try{
        response.render('registrations/addRegistration');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.Index = async function (request, response) {
    try{
        response.render('registrations/registrations');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
//api
exports.GetAllRegistrations = async function (request, response) {
    try{
        const customers =await registrationRepo.getAll()
        response.send(customers);
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.GetRegistrationsByCustomerId = async function (request, response) {
    try {
        const customerId = request.params.customerId
        const message = await registrationRepo.getById(customerId)
        if(message==null){
            throw new Error("На данного пользователя не было регистраций продуктов")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.InsertRegistration = async function (request, response) {
    try{
        const message = await registrationRepo.insert(request.body)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
};
exports.DeleteRegistrationByCustomerIdAndProductCode = async function(request,response){
    try {
        const customerId = request.params.customerId
        const productCode = request.params.productCode
        const message = await registrationRepo.deleteById(customerId,productCode)
        if(message==null){
            throw new Error("Такой регистрации не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
}