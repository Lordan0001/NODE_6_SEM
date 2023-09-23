import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';

const options = {
	explorer: true,
};

const app = express();

app.use(bodyParser.json());

function commit(data) {
	fs.writeFile('./data.json', JSON.stringify(data, null, '  '), (err) => {
		if (err) {
			throw err;
		}
	});
}

// Функция для чтения файла JSON
function readDataFile() {
	try {
		const jsonData = fs.readFileSync('./data.json', 'utf8');
		return JSON.parse(jsonData);
	} catch (err) {
		console.error('Error reading data file:', err);
		return [];
	}
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get('/TS', (req, res) => {
	const refreshedData = readDataFile();
	res.send(refreshedData);
});

app.post('/TS', (req, res) => {
	const data = readDataFile();
	const lastId = data.length > 0 ? data[data.length - 1].id : 0;
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
	const data = readDataFile();
	const { name, number } = req.body;

	if (name && number) {
		const obj = data.find((el) => el.name === name);

		if (obj) {
			obj.number = number;
			commit(data);
			res.send(obj);
		} else {
			res.send('Error: Object not found');
		}
	} else {
		res.send('Error: Missing name or number');
	}
});

app.delete('/TS', (req, res) => {
	const data = readDataFile();
	const { name } = req.body;

	if (name) {
		const obj = data.find((el) => el.name === name);

		if (obj) {
			const newData = data.filter((el) => el.id !== obj.id);
			commit(newData);
			res.send(obj);
		} else {
			res.send('Error: Object not found');
		}
	} else {
		res.send('Error: Missing name');
	}
});

app.listen(3000, () => {
	console.log('Server on 3000');
});