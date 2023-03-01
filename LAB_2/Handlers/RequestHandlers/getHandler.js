const fs = require('fs');

module.exports = function (request, response) 
{
    let path = "./static/index.html";
    if(request.url !== "/")
    {
        path = './static/' + request.url.substr(1);
    }
    fs.readFile(path,function(error,data)
    {
        if(error)
        {
            response.statusCode = 404;
            response.end("Resourse not found");
        }
        else
        {
            response.end(data);
        }
    });
};