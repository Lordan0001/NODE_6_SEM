const dbConnection = require('../../DB');
const errorHandler = require('./errorHandler');
const {Subject} = require('../../Models/model').ORM(dbConnection);

function addSubject(request, response, body) 
{
    Subject.create({
        subject: body.subject,
        subject_name: body.subject_name,
        pulpit: body.pulpit
    })
    .then(result => 
    {
        response.end(JSON.stringify(result));
    })
    .catch(error => errorHandler(response, 500, error.message));
}

function updateSubject(request, response, body) 
{
    Subject.update({subject_name: body.subject_name}, {where: {subject: body.subject}})
    .then(result => 
    {
        if (result == 0) 
        {
            throw new Error('Subject not found')
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
            Subject.findAll()
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

            request.on("data", data => 
            {
                body += data.toString();
            });

            request.on("end", () => 
            {
                addSubject(request, response, JSON.parse(body));
            });

            break;
        }

        case "PUT": 
        {
            let body = "";

            request.on("data", data => 
            {
                body += data.toString();
            });

            request.on("end", () => 
            {
                updateSubject(request, response, JSON.parse(body));
            });

            break;
        }
        case "DELETE": 
        {

            Subject.findByPk(request.url.split('/')[3])
                .then(result => 
                {
                    Subject.destroy({where: {subject: request.url.split('/')[3]}})
                    .then(resultD => 
                    {
                        if (resultD == 0) 
                        {
                            throw new Error('Subject not found')
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
            errorHandler(response, 405, 'Method Not Allowed');
            break;
        }
    }
};


