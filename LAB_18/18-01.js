const http = require("http");
const httpHandler = require('./Handlers/httpHandler');
const dbConnection = require('./DB');

http.createServer(function (request, response) 
{
    dbConnection.authenticate()
        .then(() => 
            {
                console.log("Connection");
                httpHandler(request, response);
                console.log('http://localhost:3000');
            }
        )
        .catch(err => 
            {
            console.error(err);
        })
}).listen(3000);
