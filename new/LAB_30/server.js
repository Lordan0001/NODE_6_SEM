const express = require('express');
const app = express();
const fs = require('fs');

//2 задание
//localhost:3000/task2.html
app.use('/', express.static('./'));

//3 задание
let wasmCode = fs.readFileSync('p.wasm');
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get('/3', (req, res, next) => {
	res
		.type('html')
		.send(
			'<p>task3</p>'+
			`<p>sum(3,4) = ${wasmInstance.exports.sum(3, 4)}</p>` +
				`<p>mul(3,4) = ${wasmInstance.exports.mul(3, 4)}</p>` +
				`<p>sub(3,4) = ${wasmInstance.exports.sub(3, 4)}</p>`
		);
});

app.listen(3000, () => {
	console.log('The server started');
});
