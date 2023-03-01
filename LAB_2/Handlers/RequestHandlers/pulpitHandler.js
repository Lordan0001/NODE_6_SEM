const dbConnection = require('../../DB');
const errorHandler = require('../../Handlers/RequestHandlers/errorHandler');
const {Pulpit} = require('../../Models/model').ORM(dbConnection);

function addPulpit(request, response, body) 
{
    Pulpit.create({
        pulpit: body.pulpit,
        pulpit_name: body.pulpit_name,
        faculty: body.faculty
    })
    .then(result => 
    {
        response.end(JSON.stringify(result));
    })
    .catch(error => errorHandler(response, 500, error.message));
}

function updatePulpit(request, response, body) 
{
    Pulpit.update({pulpit_name: body.pulpit_name}, {where: {pulpit: body.pulpit}})
    .then(result => 
    {
        if (result == 0) 
        {
            throw new Error('Pulpit not found')
        } 
        else 
        {
            response.end(JSON.stringify(body))
        }
    })
    .catch(error => errorHandler(response, 500, error.message));
}


module.exports = function (request, response) 
{
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    switch (request.method) 
    {
        case "GET": 
        {
            Pulpit.findAll()
            .then(result => 
            {
                response.end(JSON.stringify(result));
            })
            .catch(error => errorHandler(response, 500, error.message));

            break;
        }

        case "POST": 
        {
            let body = "";

            request.on("data", chunk => 
            {
                body += chunk.toString();
            });

            request.on("end", () => 
            {
                addPulpit(request, response, JSON.parse(body));
            });

            break;
        }

        case "PUT": 
        {
            let body = "";

            request.on("data", chunk => 
            {
                body += chunk.toString();
            });

            request.on("end", () => {
                updatePulpit(request, response, JSON.parse(body));
            });

            break;
        }

        case "DELETE": 
        {
            Pulpit.findByPk(request.url.split('/')[3])
            .then(result => 
            {
                Pulpit.destroy({where: {pulpit: request.url.split('/')[3]}})
                .then(resultD => 
                    {
                    if (resultD == 0) 
                    {
                        throw new Error('Pulpit not found')
                    } 
                    else 
                    {
                        response.end(JSON.stringify(result))
                    }
                })
                .catch(error => errorHandler(response, 500, error.message));

            })
            .catch(error => errorHandler(response, 500, error.message));
            
            break;
        }
        default:           
        {
            errorHandler(response, 405, 'Method Not Allowed ');
            break;
        }
    }
};

