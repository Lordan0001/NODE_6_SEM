import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import data from './data.json' assert { type: 'json' };
import swaggerDocument from './swagger.js';

const options = {
	explorer: true,
};

const app = express();

app.use(bodyParser.json());

function commit(data) {
	fs.writeFile('./data.json', JSON.stringify(data, null, '  '), err => {
		if (err) {
			throw err;
		}
	});
}

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, options)
);

app.get('/TS', (req, res) => {
	res.send(data);
});
app.post('/TS', (req, res) => {
	const lastId = data[data.length - 1].id;
	const { name, number } = req.body;
	if (name && number) {
		const obj = {
			id: lastId + 1,
			name: name,
			number: number,
		};
		data.push(obj);
		commit(data);
		res.send(obj);
	} else {
		res.send('Error');
	}
});
app.put('/TS', (req, res) => {
	const { name, number } = req.body;
	if (name && number) {
		const obj = data.find(el => el.name === name);
		obj.number = number;
		commit(data);
		res.send(obj);
	} else {
		res.send('Error');
	}
});
app.delete('/TS', (req, res) => {
	const { name, number } = req.body;
	if (name && number) {
		const obj = data.find(el => el.name === name);
		const newData = data.filter(el => el.id != obj.id);
		commit(newData);
		res.send(obj);
	} else {
		res.send('Error');
	}
});

app.listen(3000);
