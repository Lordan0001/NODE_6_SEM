 const http = require('http');
 const {PrismaClient} = require('@prisma/client');
 const prisma = new PrismaClient()
 const fs = require('fs');
 const url = require('url');

http.createServer(async (request, response) => {

    switch (request.method) {
        case 'GET':
            if (url.parse(request.url).pathname === '/') {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                const fileHtml = fs.readFileSync('index.html');
                response.end(fileHtml);
            }
            else if (url.parse(request.url).pathname === '/api/faculties') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allFaculties = await prisma.fACULTY.findMany();
                response.end(JSON.stringify(allFaculties));
            }
            else if (url.parse(request.url).pathname === '/api/pulpits') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allPulpits = await prisma.pULPIT.findMany();
                response.end(JSON.stringify(allPulpits));
            }
            else if (url.parse(request.url).pathname === '/api/subjects') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allSubjects = await prisma.sUBJECT.findMany();
                response.end(JSON.stringify(allSubjects));
            }
            else if (url.parse(request.url).pathname === '/api/teachers') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allTeachers = await prisma.tEACHER.findMany();
                response.end(JSON.stringify(allTeachers));
            }
            else if (url.parse(request.url).pathname === '/api/auditoriumtypes') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allAuditoriumTypes = await prisma.aUDITORIUM_TYPE.findMany();
                response.end(JSON.stringify(allAuditoriumTypes));
            }
            else if (url.parse(request.url).pathname === '/api/auditoriums') {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const allAuditoriums = await prisma.aUDITORIUM.findMany();
                response.end(JSON.stringify(allAuditoriums));
            }//todo add other table
                else if (url.parse(request.url).pathname.includes('/api/faculties')) {
                let facultyCode = url.parse(request.url).pathname.split("/");
                console.log(decodeURI(facultyCode[3]));
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const facultyPulpitsSubjects = await prisma.fACULTY.findUnique({
                    //include: {PULPIT_PULPIT_FACULTYToFACULTY: true},
                    where : {FACULTY: decodeURI(facultyCode[3])},
                    select: {
                        FACULTY: true,
                        PULPIT_PULPIT_FACULTYToFACULTY: {
                            select: {
                                PULPIT: true,
                                SUBJECT_SUBJECT_PULPITToPULPIT: {
                                    select: {
                                        SUBJECT_NAME: true
                                    }
                                }
                            }
                        }
                    }
                });
                response.end(JSON.stringify(facultyPulpitsSubjects));
            }
            else if (url.parse(request.url).pathname.includes('/api/auditoriumtypes')) {
                let AuditoriumCode = url.parse(request.url).pathname.split("/");
                console.log(decodeURI(AuditoriumCode[3]));
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const AuditoriumsWithAuditoriumtypes = await prisma.aUDITORIUM_TYPE.findMany({
                    include: {AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: true},
                    where : {AUDITORIUM_TYPE: decodeURI(AuditoriumCode[3])}
                });
                response.end(JSON.stringify(AuditoriumsWithAuditoriumtypes));
            }
            else if(url.parse(request.url).pathname === '/api/auditoriumsWithComp1'){
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const auditoriumsWithComp1 = await prisma.aUDITORIUM.findMany({
                    where: {
                        AUDITORIUM: {'contains': '-1'},
                        AUDITORIUM_TYPE: 'ЛБ-К'
                    }
                });
                response.end(JSON.stringify(auditoriumsWithComp1));
            }
            else if(url.parse(request.url).pathname === '/api/puplitsWithoutTeachers'){
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const puplitsWithoutTeachers = await prisma.pULPIT.findMany({
                    where: {
                        TEACHER_TEACHER_PULPITToPULPIT: {
                            none: {}
                        }
                    }
                });
                response.end(JSON.stringify(puplitsWithoutTeachers));
            }
            else if(url.parse(request.url).pathname === '/api/pulpitsWithVladimir'){
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const puplitsWithVladimir = await prisma.pULPIT.findMany({
                    where: {
                        TEACHER_TEACHER_PULPITToPULPIT: {
                            some: {
                                TEACHER_NAME: {'contains':'Владимир'}
                            }
                        }
                    }
                });
                response.end(JSON.stringify(puplitsWithVladimir));
            }
            else if(url.parse(request.url).pathname === '/api/auditoriumsSameCount'){
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                const auditoriumsSameCount = await prisma.aUDITORIUM.groupBy({
                    by: ['AUDITORIUM_CAPACITY','AUDITORIUM_TYPE'],
                    _count:{ 'AUDITORIUM': true}
                });
                response.end(JSON.stringify(auditoriumsSameCount));
            }
            else {
                response.end('Bad Get request');
            }
            break;
        case 'POST':
            response.end('POST');
            break;
        case 'PUT':
            response.end('PUT');
            break;
        case 'DELETE':
            response.end('DELETE');
            break;
        default:
            response.end('default');
            break;
    }


}).listen(3000);