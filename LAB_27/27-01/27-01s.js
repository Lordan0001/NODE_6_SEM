const {ServerDH,ClientDH} = require('./DH');
const fs=require('fs');

const app = require('express')();
const bodyParser = require("body-parser");
const cipher = require('./files').cipher;

var serverDH;
var serverSecret;

app.use(bodyParser.urlencoded({ extended: false })); //одержать только строки или массивы, а не сложные объекты

app.get('/',(req,res,next)=>
{
	serverDH = new ServerDH(1024,3);
	res.writeHead(200,{'Content-Type': 'application/json'});
	res.end(JSON.stringify(serverDH.getContext()));
});

app.post('/setKey',(req,res,next)=>
{
	let body='';
			req.on('data',chunk=>{body+=chunk.toString();});
			req.on('end',()=>{
	const clientContext=JSON.parse(body);
	if(clientContext.key_hex!=undefined)
	{
		serverSecret=serverDH.getSecret(clientContext);	//
		console.log('serverSecret:', serverSecret);
		res.writeHead(200,{'Content-Type': 'text/plain'});
		var key=Buffer.alloc(32);
		serverSecret.copy(key,0,0,32);

		const rs = fs.createReadStream('./in.txt');
		const ws = fs.createWriteStream('./cipher.txt');
		cipher(rs,ws,key);
		res.end('Success');
	}
	else
	{
		res.statusCode=409;
		res.end('Failure');
	}
	});
});


app.get('/resource',(req,res,next)=>
{
	if(serverSecret!=undefined)
	{
		res.statusCode=200;
		let rs2=fs.createReadStream('./cipher.txt');
		rs2.pipe(res);
		rs2.on('close',()=> {console.log(rs2.bytesRead); res.end();});
		
	}
	else
	{
		res.statusCode=409;
		res.end('Send request for /setKey');
	}
});
app.listen(3000)