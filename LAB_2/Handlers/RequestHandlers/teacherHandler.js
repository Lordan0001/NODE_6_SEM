const dbConnection = require('../../DB');
const errorHandler = require('./errorHandler');
const {Teacher} = require('../../Models/model').ORM(dbConnection);

function addTeacher(request,response,body) {
 Teacher.create({
     teacher: body.teacher,
     teacher_name: body.teacher,
     pulpit: body.pulpit
 }).then(result =>{
     response.end(JSON.stringify(result));
 })
     .catch(error => errorHandler(response, 500, error.message));
}

function updateTeacher(request, response, body)
{
    Teacher.update({teacher: body.teacher_name}, {where: {teacher: body.teacher}})
        .then(result =>
        {
            if (result == 0)
            {
                throw new Error('Teacher not found')
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
            Teacher.findAll()
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
                addTeacher(request, response, JSON.parse(body));
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
                updateTeacher(request, response, JSON.parse(body));
            });

            break;
        }
        case "DELETE":
        {

            Teacher.findByPk(request.url.split('/')[3])
                .then(result =>
                {
                    Teacher.destroy({where: {teacher: request.url.split('/')[3]}})//todo check this
                        .then(resultD =>
                        {
                            if (resultD == 0)
                            {
                                throw new Error('Teacher not found')
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
