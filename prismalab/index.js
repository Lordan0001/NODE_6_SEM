const http = require('http')
const url = require('url')
const fs = require("fs");
const { PrismaClient } = require('@prisma/client')

    const prisma = new PrismaClient({
        log: ['query']
    });

prisma.$on('query', e => {
    console.log('Query ' + e.query)
    console.log('Params ' + e.params)
})

prisma.$transaction(async (prisma) => {
    await prisma.AUDITORIUM.updateMany({

        data: {
            AUDITORIUM_CAPACITY: {
                increment: 100
            }
        }
    })
    throw new Error(`Some error`);
}).catch(e => {
    console.log(e)
})

let server = http.createServer(async (req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        if (url.parse(req.url).pathname === "/") {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let page = fs.readFileSync('./index.html');
            res.end(page)
        } else if (url.parse(req.url).pathname.includes("/api/faculties")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            console.log(decodeURI(facultyCode[3]))
            if (facultyCode[3]) {
                const FACULTY = await prisma.FACULTY.findUnique({
                    where: {
                        FACULTY: decodeURI(facultyCode[3])
                    },
                    select: {
                        FACULTY:true,
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
                })
                res.end(JSON.stringify(FACULTY))
            } else {
                const faculties = await prisma.FACULTY.findMany()
                console.log('faculties')
                res.end(JSON.stringify(faculties))
            }
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            const subjects = await prisma.SUBJECT.findMany()
            res.end(JSON.stringify(subjects))
        }
        else if (url.parse(req.url).pathname === "/api/pulpits") {
            const pulpits = await prisma.PULPIT.findMany()
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname.includes("/api/pulpits/ten")) {
            let skip = url.parse(req.url).pathname.split("/");
            console.log(skip[4])

            const pulpits = await prisma.PULPIT.findMany({ skip: +skip[4], take: 10, include: { _count: { select: { TEACHER_TEACHER_PULPITToPULPIT: true } } } })
            res.end(JSON.stringify(pulpits))
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            const teachers = await prisma.TEACHER.findMany()
            res.end(JSON.stringify(teachers))
        }
        else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
            let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
            console.log(decodeURI(auditoriumstypesCode[3]))
            if (auditoriumstypesCode[3]) {
                let auditoriums = await prisma.AUDITORIUM_TYPE.findUnique({
                    where: {
                        AUDITORIUM_TYPE: decodeURI(auditoriumstypesCode[3])
                    },
                    select: {
                        AUDITORIUM_TYPE: true,
                        AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: { select: { AUDITORIUM: true }}
                    }
                })
                res.end(JSON.stringify(auditoriums))
            } else {
                const auditoriumstypes = await prisma.AUDITORIUM_TYPE.findMany()
                res.end(JSON.stringify(auditoriumstypes))
            }
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            const auditoriums = await prisma.AUDITORIUM.findMany()
            res.end(JSON.stringify(auditoriums))
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumsWithComp1") {
            const auditoriums = await prisma.AUDITORIUM.findMany({
                where: {
                    AUDITORIUM_TYPE: 'ЛБ-К',
                    AUDITORIUM: {
                        contains: '-1'
                    }
                }
            })
            res.end(JSON.stringify(auditoriums))
        } else if (url.parse(req.url).pathname === "/api/pulpitsWithVladimir") {
            const pulpits = await prisma.PULPIT.findMany({
                where: {
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        some: {
                            TEACHER_NAME: {
                                contains: 'Владимир'
                            }
                        }
                    }
                }
            })
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname === "/api/puplitsWithoutTeachers") {
            const pulpits = await prisma.PULPIT.findMany({
                where: {
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        none: {}
                    }
                }
            })
            res.end(JSON.stringify(pulpits))
        } else if (url.parse(req.url).pathname === "/api/auditoriumsSameCount") {
            const auditoriums = await prisma.AUDITORIUM.groupBy({
                by: ['AUDITORIUM_CAPACITY', 'AUDITORIUM_TYPE'],
                _count: {
                    'AUDITORIUM': true
                }
            });
            res.end(JSON.stringify(auditoriums))
        } else if (url.parse(req.url).pathname.includes("/api/fluent")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            const faculties = await prisma.FACULTY.findUnique({
                where: {
                    FACULTY: decodeURI(facultyCode[3])
                }
            }).PULPIT_PULPIT_FACULTYToFACULTY();
            res.end(JSON.stringify(faculties))
        }

    }
    //------------------------------------POST
    else if (req.method === "POST") {//TODO add postman
        if (url.parse(req.url).pathname === "/api/faculties") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                let FACULTY;
                try {
                console.log(data.PULPIT)
                    if (data.PULPIT) {
                        // const pulpits = data.PULPIT.map(pulpitData => ({
                        //     PULPIT: pulpitData.PULPIT,
                        //     PULPIT_NAME: pulpitData.PULPIT_NAME
                        // }));
                        FACULTY = await prisma.FACULTY.create({
                            data: {
                                FACULTY: data.FACULTY,
                                FACULTY_NAME: data.FACULTY_NAME,
                                PULPIT_PULPIT_FACULTYToFACULTY: {
                                    // createMany: {
                                    //     data: pulpits
                                    // }
                                    create: {
                                        PULPIT: `${data.PULPIT}`,
                                        PULPIT_NAME: `${data.PULPIT_NAME}`
                                    }
                                }
                            },
                            include: {PULPIT_PULPIT_FACULTYToFACULTY: true}
                        });

                    } else {
                        FACULTY = await prisma.FACULTY.create({
                            data: {

                                FACULTY: data.FACULTY,
                                FACULTY_NAME: data.FACULTY_NAME
                            },
                        })
                    }
                    res.end(JSON.stringify(FACULTY))
                }
                catch{
                    res.end(JSON.stringify('adding error'))
                }
            })
        }

        else if (url.parse(req.url).pathname === "/api/pulpits") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                let PULPIT;
                // try {
                    PULPIT = await prisma.PULPIT.create({
                        data: {
                            PULPIT: data.PULPIT,
                            PULPIT_NAME: data.PULPIT_NAME,
                            FACULTY_PULPIT_FACULTYToFACULTY: {
                                connectOrCreate: {
                                    where: {
                                        FACULTY: data.FACULTY
                                    },
                                    create: {
                                        FACULTY: data.FACULTY,
                                        FACULTY_NAME: data.FACULTY_NAME
                                    }
                                }
                            }
                        }
                    })
                    res.end(JSON.stringify(PULPIT))
                // }
                // catch{
                //     res.end(JSON.stringify('adding error'))
                // }
            })
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.SUBJECT.create({
                        data: {
                            SUBJECT: data.SUBJECT,
                            SUBJECT_NAME: data.SUBJECT_NAME,
                            PULPIT: data.PULPIT
                        }
                    })
                        .then(subjects => res.end(JSON.stringify(subjects)))
                }
                catch{
                    res.end(JSON.stringify('adding error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.TEACHER.create({
                        data: {
                            TEACHER: data.TEACHER,
                            TEACHER_NAME: data.TEACHER_NAME,
                            PULPIT: data.PULPIT
                        }
                    })
                        .then(TEACHER => res.end(JSON.stringify(TEACHER)))
                }
                catch{
                    res.end(JSON.stringify('adding error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.AUDITORIUM_TYPE.create({
                        data: {
                            AUDITORIUM_TYPE: data.AUDITORIUM_TYPE,
                            AUDITORIUM_TYPENAME: data.AUDITORIUM_TYPENAME
                        }

                    })
                        .then(auditoriumstype => res.end(JSON.stringify(auditoriumstype)))
                }
                catch{
                    res.end(JSON.stringify('adding error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.AUDITORIUM.create({
                        data: {
                            AUDITORIUM: data.AUDITORIUM,
                            AUDITORIUM_NAME: data.AUDITORIUM_NAME,
                            AUDITORIUM_CAPACITY: data.AUDITORIUM_CAPACITY,
                            AUDITORIUM_TYPE: data.AUDITORIUM_TYPE
                        }
                    })
                        .then(AUDITORIUM => res.end(JSON.stringify(AUDITORIUM)))
                }
                catch{
                    res.end(JSON.stringify('adding error'))
                }
            })
        }
        //----------------------------PUT
    } else if (req.method === "PUT") {
        if (url.parse(req.url).pathname === "/api/faculties") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.FACULTY.update({
                        where: {FACULTY: data.FACULTY},
                        data: {
                            FACULTY_NAME: data.FACULTY_NAME
                        }
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }
            })
        } else if (url.parse(req.url).pathname === "/api/pulpits") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.PULPIT.update({
                        where: {PULPIT: data.PULPIT},
                        data: {
                            PULPIT_NAME: data.PULPIT_NAME,
                            FACULTY: data.FACULTY
                        },
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/subjects") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.SUBJECT.update({
                        where: {SUBJECT: data.SUBJECT},
                        data: {
                            SUBJECT_NAME: data.SUBJECT_NAME,
                            PULPIT: data.PULPIT
                        },
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/teachers") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.TEACHER.update({
                        where: {TEACHER: data.TEACHER,},
                        data: {
                            TEACHER_NAME: data.TEACHER_NAME,
                            PULPIT: data.PULPIT
                        },
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }

            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriumstypes") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.AUDITORIUM_TYPE.update({
                        where: {AUDITORIUM_TYPE: data.AUDITORIUM_TYPE},
                        data: {
                            AUDITORIUM_TYPENAME: data.AUDITORIUM_TYPENAME//auditorium_typename
                        },
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }
            })
        }
        else if (url.parse(req.url).pathname === "/api/auditoriums") {
            let data = "";
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', async () => {
                data = JSON.parse(data);
                try {
                    await prisma.AUDITORIUM.update({
                        where: {AUDITORIUM: data.AUDITORIUM},
                        data: {
                            AUDITORIUM_NAME: data.AUDITORIUM_NAME,
                            AUDITORIUM_CAPACITY: data.AUDITORIUM_CAPACITY,
                            AUDITORIUM_TYPE: data.AUDITORIUM_TYPE
                        },
                    })
                    res.end("Updated")
                }
                catch{
                    res.end(JSON.stringify('updating error'))
                }
            })
        }
    }
    //-------------------------DELETE
    else if (req.method === "DELETE") {
        if (url.parse(req.url).pathname.includes("/api/faculties")) {
            let facultyCode = url.parse(req.url).pathname.split("/");
            try {
                await prisma.FACULTY.delete({where: {FACULTY: decodeURI(facultyCode[3])}})
                res.end("Deleted")
            }
            catch{
                res.end(JSON.stringify('deleting error'))
            }
        }
        else if (url.parse(req.url).pathname.includes("/api/pulpits")) {
            let pulpitCode = url.parse(req.url).pathname.split("/");
            try {
                await prisma.PULPIT.delete({where: {PULPIT: decodeURI(pulpitCode[3])}})
                res.end("Deleted")
            }
            catch{
                    res.end(JSON.stringify('deleting error'))
                }
        }
        else if (url.parse(req.url).pathname.includes("/api/subjects")) {
            let subjectCode = url.parse(req.url).pathname.split("/");
            try {
                await prisma.SUBJECT.delete({where: {SUBJECT: decodeURI(subjectCode[3])}})
                res.end("Deleted")
            }
            catch{
                res.end(JSON.stringify('deleting error'))
            }
        }
        else if (url.parse(req.url).pathname.includes("/api/teachers")) {
            let teachertCode = url.parse(req.url).pathname.split("/");
            try {
                await prisma.TEACHER.delete({where: {TEACHER: decodeURI(teachertCode[3])}})
                res.end("Deleted")
            }
            catch{
                res.end(JSON.stringify('deleting error'))
            }
        }
        else if (url.parse(req.url).pathname.includes("/api/auditoriumstypes")) {
            let auditoriumstypesCode = url.parse(req.url).pathname.split("/");
            console.log('==========================' + auditoriumstypesCode[3])
            try {
                await prisma.AUDITORIUM_TYPE.delete({where: {AUDITORIUM_TYPE: decodeURI(auditoriumstypesCode[3])}})
                res.end("Deleted")
            }
            catch{
                res.end(JSON.stringify('deleting error'))
            }
        }
        else if (url.parse(req.url).pathname.includes("/api/auditoriums")) {
            let auditoriumCode = url.parse(req.url).pathname.split("/");
            try {
                await prisma.AUDITORIUM.delete({where: {AUDITORIUM: decodeURI(auditoriumCode[3])}})
                res.end("Deleted")
            }
            catch{
                res.end(JSON.stringify('deleting error'))
            }
        }


    }
})


server.listen(3000)
console.log('Server started')