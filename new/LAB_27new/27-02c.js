const http = require('http');
const fs = require('fs');
const { ClientVerify } = require('./ECP');

let resource_options = {
    host: '127.0.0.1',
    path: '/resource',
    port: 3000,
    method: 'GET'
};
let options = {
    host: '127.0.0.1',
    path: '/',
    port: 3000,
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    }
};


setTimeout(() => {
    const request = http.request(resource_options, (res) => {
        const file = fs.createWriteStream('./verified_data.txt');
        res.pipe(file);

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk.toString('utf-8'); });
            
            res.on('end', () => {
                let signcontext = JSON.parse(data);
                console.log(signcontext);
                const cleintVerify = new ClientVerify(signcontext);
                const rs = fs.createReadStream('./verified_data.txt');
                cleintVerify.verify(rs, (result) => {
                    console.log('verified:', result, '\n');
                });

            });
        });
        req.on('error', (e) => { console.log('http.request: error:', e.message); });
        req.end();
    });
    request.on('error', (e) => { console.log('http.request: error:', e.message); });
    request.end();
}, 500);
