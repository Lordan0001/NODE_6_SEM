const productRepo = require("../repositories/productRepository.js")
const customerRepo = require("../repositories/customerRepository");

//views
exports.Update = async function (request, response) {
    try{
        const productCode = request.params.productCode
        const message = await productRepo.getById(productCode)
        if(message==null){
            throw new Error('Такого покупателя нет')
        }
        const {ProductCode,Name,Version,ReleaseDate} = message
        console.log(message)
        response.render('products/editProduct',{ProductCode:ProductCode,Name:Name,Version:Version,ReleaseDate:ReleaseDate});
    }
    catch(e) {
        response.send(e.message);
    }
};
exports.Add = async function (request, response) {
    try{
        response.render('products/addProduct');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.Index = async function (request, response) {
    try{
        response.render('products/products');
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
//api
exports.GetAllProducts = async function (request, response) {
    try{
        const customers =await productRepo.getAll()
        response.send(customers);
    }
    catch {
        response.send(JSON.stringify({Error:'error'}));
    }
};
exports.GetProductById = async function (request, response) {
    try {
        const productId = request.params.productCode
        const message = await productRepo.getById(productId)
        if(message==null){
            throw new Error("Такого продукта не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
};
exports.InsertProduct = async function (request, response) {
    try{
        const message = await productRepo.insert(request.body)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
};
exports.UpdateProduct = async function(request,response){
    try{
        const message = await productRepo.update(request.body)
        if(message==null){
            throw new Error("Такого продукта не существует")
        }
        console.log(message)
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.toString()}));
    }
}
exports.DeleteProductById = async function(request,response){
    try {
        const productId = request.params.productCode
        const message = await productRepo.deleteById(productId)
        if(message==null){
            throw new Error("Такого пользователя не существует")
        }
        response.send((message));
    }
    catch(e) {
        response.send(JSON.stringify({Error:e.message}));
    }
}