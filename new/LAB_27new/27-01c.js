const http = require('http');
const { ClientDH, decipherFile } = require('./DH');
const fs = require('fs');
let params;
let clientDH;

let options = {
    host: '127.0.0.1',
    path: '/',
    port: 3000,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
};
let optionsKey = {
    host: '127.0.0.1',
    path: '/key',
    port: 3000,
    method: 'POST',
};
let optionsResource = {
    host: '127.0.0.1',
    path: '/resource',
    port: 3000,
    method: 'GET',
};



setTimeout(() => {
    const req = http.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk.toString());

        res.on('end', () => {
            let serverContext = JSON.parse(data);
            clientDH = new ClientDH(serverContext);
            params = JSON.stringify(clientDH.getContext());

            const req2 = http.request(optionsKey, res => {
                if (res.statusCode !== 409) {
                    const req3 = http.request(optionsResource, res => {
                        if (res.statusCode !== 409) {
                            const file = fs.createWriteStream('./decrypted.txt');
                            const key = Buffer.alloc(32);
                            let clientSecret = clientDH.getSecret(serverContext);
                            clientSecret.copy(key, 0, 0, 32);
                            decipherFile(res, file, key);
                        }
                    });
                    req3.on('error', err => console.log('http.request: error:', err.message + '\n'));
                    req3.end();
                }
            });

            req2.on('error', err => console.log('http.request: error:', err.message + '\n'));
            console.log(JSON.parse(params, null, 4), '\n');
            req2.write(params);
            req2.end();
        });
    });
    req.on('error', err => console.log('http.request: error:', err.message));
    req.end();
}, 500);