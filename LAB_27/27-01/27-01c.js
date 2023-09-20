const crypto = require('crypto');
const http =require('http');
const query= require('querystring');
const {ServerDH,ClientDH} = require('./DH');
const fs=require('fs');
const decipher = require('./files').decipher;
let parms;
var clientDH;

let options_init= {
    host: 'localhost',
    path: '/',
    port: 3000,
	method:'GET',
	headers: {'content-type':'application/json'}
}
let options_setKey= {
	host: 'localhost',
	path: '/setKey',
	port: 3000,
	method:'POST'
}
let options_resource= {
	host: 'localhost',
	path: '/resource',
	port: 3000,
	method:'GET'
}

// (GET /)
const req = http.request(options_init,(res)=>
{
	let data = '';
    res.on('data',(chunk) => {data+=chunk.toString('utf-8');});
    res.on('end',()=>{ 
		let serverContext = JSON.parse(data);
		clientDH= new ClientDH(serverContext);
		parms=JSON.stringify(clientDH.getContext());


		//POST (/setKey)
		const req2 = http.request(options_setKey,(res)=>
		{
			if(res.statusCode!=409)
			{
				//GET (/resource)
				const req3 = http.request(options_resource,(res)=>
				{
					if(res.statusCode!=409)
					{
						const file=fs.createWriteStream('./decipher.txt');
						var key=Buffer.alloc(32);
						let clientSecret =clientDH.getSecret(serverContext);
						clientSecret.copy(key,0,0,32)
						decipher(res,file,key);
					}
				});
				req3.on('error', (e)=> {console.log('http.request: error:', e.message);});
				req3.end();
			}
		});
		req2.on('error', (e)=> {console.log('http.request: error:', e.message);});
		console.log(parms);
		req2.write(parms);
		req2.end();
    }); 
});
req.on('error', (e)=> {console.log('http.request: error:', e.message);});
req.end();