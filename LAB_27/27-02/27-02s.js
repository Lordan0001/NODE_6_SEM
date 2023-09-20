const {ServerSign,ClientVerify} = require('./module');
const fs = require('fs');
let rs2 = fs.createReadStream('./in.txt');
const app = require('express')();

app.get('/resource',(req,res,next)=>
{
	res.statusCode=200;
	rs2.pipe(res);
	rs2.on('close',()=>{console.log(rs2.bytesRead); res.end();});
});

app.get('/',(req,res,next)=>
{
	let ss= new ServerSign();
	let rs=fs.createReadStream('./in.txt');
    ss.getSignContext(rs,(signcontext)=>
    {
        res.writeHead(200,{'Content-Type': 'application/json'});
	    res.end(JSON.stringify(signcontext));
    });
});

app.listen(5000)