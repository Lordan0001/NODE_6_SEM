const customerRepo = require("../repositories/customerRepository.js")

//views
exports.Update = async function (request, response) {
    try{
        const customerId = request.params.customerId
        const message = await customerRepo.getById(customerId)
        console.log(message)
        if(message==null){
            throw new Error('Такого покупателя нет')
        }
        const {CustomerID,Name,Address,City,Phone,Email} = message
        console.log(message)
        response.render('customers/editCustomer',{CustomerID:CustomerID,Name:Name,Address:Address,City:City,Phone:Phone,Email:Email});
    }
    catch(e) {
        response.send(e.message);
    }
};
exports.Add = async function (request, response) {
    try{
        response.render('customers/addCustomer');
        }
        catch {
            response.send(JSON.stringify({Error:'error'}));
        }
};
exports.Index = async function (request, response) {
    try{
        response.render('customers/customers');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
//api
exports.GetAllCustomers = async function (request, response) {
    try{
        const customers =await customerRepo.getAll()
        response.send(customers);
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.GetCustomerById = async function (request, response) {
    try {
        const customerId = request.params.customerId
        const message = await customerRepo.getById(customerId)
        if(message==null){
            throw new Error("Такого пользователя не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.InsertCustomer = async function (request, response) {
    try{
        const message = await customerRepo.insert(request.body)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
};
exports.UpdateCustomer = async function(request,response){
    try{
        const message = await customerRepo.update(request.body)
        if(message==null){
            throw new Error("Такого пользователя не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
}
exports.DeleteCustomerById = async function(request,response){
    try {
        const customerId = request.params.customerId
        const message = await customerRepo.deleteById(customerId)
        if(message==null){
            throw new Error("Такого пользователя не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
}