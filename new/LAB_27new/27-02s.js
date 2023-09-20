const { ServerSign } = require('./ECP');
const fs = require('fs');
const app = require('express')();
const PORT = 3000;


app.get('/resource', (req, res) => {
    let readStream = fs.createReadStream('./file.txt');
    readStream.pipe(res);
    readStream.on('close', () => res.status(200).end());
});


app.get('/', (req, res) => {
    const serverSign = new ServerSign();
    const readStream = fs.createReadStream('./file.txt');
    serverSign.getSignContext(readStream, cb => {
        // console.log(cb);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(cb));
    });
});


app.listen(PORT, () => console.log(`[OK] Server running at localhost:${PORT}/\n`));