const { ServerDH, cipherFile } = require('./DH');
const fs = require('fs');
const app = require('express')();
const bodyParser = require('body-parser');
const PORT = 3000;

let serverDH;
let serverSecret;
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    serverDH = new ServerDH(1024, 3);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(serverDH.getContext(), null, 4));
});


app.get('/resource', (req, res) => {
    if (serverSecret !== undefined) {
        res.statusCode = 200;
        let readStream = fs.createReadStream('./encrypted.txt');
        readStream.pipe(res);
        readStream.on('close', () => {
            console.log('readBytes: ', readStream.bytesRead);
            res.end();
        });
    } else {
        res.status(409).end('[ERROR] 409: Conflict.');
    }
});


app.post('/key', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
        const clientContext = JSON.parse(body);
        if (clientContext.key_hex !== undefined) {
            serverSecret = serverDH.getSecret(clientContext);
            console.log('serverSecret:', serverSecret.toString('hex'));
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            const key = Buffer.alloc(32);
            serverSecret.copy(key, 0, 0, 32);

            const rs = fs.createReadStream('./file.txt');
            const ws = fs.createWriteStream('./encrypted.txt');
            cipherFile(rs, ws, key);
            res.end('[OK] Successfully encrypted.');
        } else {
            res.status(409).end('[ERROR] 409: Conflict.');
        }
    });
});


app.listen(PORT, () => console.log(`[OK] Server running at localhost:${PORT}/\n`));