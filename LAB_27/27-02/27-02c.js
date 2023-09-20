const http =require('http');
const fs=require('fs');
const {ServerSign,ClientVerify} = require('./module');

let options_file= {
    host: 'localhost',
    path: '/resource',
    port: 5000,
    method:'GET'
}
let options_signature = {
    host: 'localhost',
    path: '/',
    port: 5000,
    method:'GET',
    headers: {'content-type':'application/json'}
}

// GET /resource
const req3 = http.request(options_file,(res)=> {

    const file = fs.createWriteStream('./out.txt');
    res.pipe(file);

    // GET /
    const req = http.request(options_signature,(res)=> {
        let data = '';
        res.on('data',(chunk) => {data+=chunk.toString('utf-8');});
        res.on('end',()=>
        {
            let signcontext = JSON.parse(data);
            var x = new ClientVerify(signcontext);
            const rs=fs.createReadStream('./out.txt');
            x.verify(rs,(result)=>
            {
                console.log('result:',result);
            })
        });
    });
    req.on('error', (e)=> {console.log('http.request: error:', e.message);});
    req.end();
});
req3.on('error', (e)=> {console.log('http.request: error:', e.message);});
req3.end();