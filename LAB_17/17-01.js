const redis = require('redis');
const client = redis.createClient();

client.on('error', () => console.log('Redis internal error.'));
client.on('ready', () => console.log('Client ready to work.'));
client.on('end', () => console.log('Client disconnected.\n'));
client.on('connect', () => {
    console.log('\nClient connected to Redis.')
    setTimeout(() => {
    client.quit();
}, 3000);});


client.connect();