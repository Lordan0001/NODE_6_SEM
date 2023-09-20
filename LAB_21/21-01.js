const express = require('express');
const app = require('express')();
const hbs = require('express-handlebars').create({
    layoutsDir: "views/layouts",
    defaultLayout: "main",
    extname: '.hbs',
    helpers: {
        deny() {
            return `<button id="deleteButton" onClick="window.location.href='./'">Отказаться</button>`;
        }
    }
});
const fs = require('fs');
const bodyParser = require("body-parser");

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', 3000);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.get('/', (req, res, next) => {
    try {
        const data = fs.readFileSync('./Telephones.json');
        if (data.length == 0) {
            res.render('index');
        } else {
            const os = JSON.parse(data);
            res.render('index', { names: os });
        }
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('index');
    }
});

app.get('/Add', (req, res, next) => {
    try {
        const data = fs.readFileSync('./Telephones.json');
        if (data.length == 0) {
            res.render('Add', { logicif: true });
        } else {
            const os = JSON.parse(data);
            res.render('Add', { names: os, logicif: true });
        }
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('Add', { logicif: true });
    }
});

app.post('/Add', (req, res) => {
    const body = req.body.String;
    const result = body.split(" ").filter(el => el !== "");
    const names = result[0].split(',');
    const FIO = names[0] + ' ' + names[1][0] + '.' + names[2][0];
    const telephone = result[1].replace(/\s+/g, '');

    try {
        let os = [];
        const data = fs.readFileSync('./Telephones.json');
        if (data.length != 0) {
            os = JSON.parse(data);
        }
        os.push({ FIO, Telephone: telephone });

        const result2 = JSON.stringify(os);
        fs.writeFileSync('./Telephones.json', result2);
        console.log("Запись успешно завершена");

        res.render('index', { names: os });
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('index');
    }
});

app.get('/Update', (req, res, next) => {
    try {
        const data = fs.readFileSync('./Telephones.json');
        const os = JSON.parse(data);
        res.render('Update', { names: os, FIO: req.query.FIO, Telephone: req.query.Telephone, logicif: true });
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('index');
    }
});

app.post('/Update', (req, res) => {
    const body = req.body.String;
    const result = body.split(" ").filter(el => el !== "");
    const lastname = result[0];
    const names = result[1];
    const telephone = result[2].replace(/\s+/g, '');
    const FIO = lastname + ' ' + names;

    try {
        let os = [];
        const data = fs.readFileSync('./Telephones.json');
        if (data.length != 0) {
            os = JSON.parse(data);
        }

        os.forEach(element => {
            const result_json = element.FIO.split(" ").filter(el => el !== "");
            const lastname_json = result_json[0];
            if (lastname == lastname_json) {
                element.FIO = FIO;
                element.Telephone = telephone;
            }
        });

        const result2 = JSON.stringify(os);
        fs.writeFileSync('./Telephones.json', result2);
        console.log("Запись успешно завершена");

        res.render('index', { names: os });
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('index');
    }
});

app.post('/Delete', (req, res) => {
    const body = req.body.String;
    const result = body.split(" ").filter(el => el !== "");
    const lastname = result[0];
    const names = result[1];
    const telephone = result[2].replace(/\s+/g, '');
    const FIO = lastname + ' ' + names;

    try {
        let os = [];
        const data = fs.readFileSync('./Telephones.json');
        if (data.length != 0) {
            os = JSON.parse(data);
        }

        os = os.filter(element => {
            return FIO !== element.FIO || telephone !== element.Telephone;
        });

        const result2 = JSON.stringify(os);
        fs.writeFileSync('./Telephones.json', result2);
        console.log("Удаление успешно завершено");

        if (os.length != 0) {
            res.render('index', { names: os });
        } else {
            res.render('index');
        }
    } catch (error) {
        console.log('Ошибка: ', error);
        res.render('index');
    }
});

const server = app.listen(process.env.PORT || app.get('port'), () => {
    console.log('Server is running on port', server.address().port);
});
