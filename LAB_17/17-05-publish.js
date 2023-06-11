const redis = require('redis');

const client = redis.createClient();


client.on('error', () => console.log('Redis internal error.'));
client.on('connect', () => console.log('\nClient connected to Redis.'));
client.on('end', () => console.log('Client disconnected.\n'));



(async () => {
    await client.connect();

    setInterval(async () => {
        await client.publish('Power metal', 'Powerman5000');
    }, 1000)
        .unref();

    setInterval(async () => {
        await client.publish('Heavy metal', 'Black Sabbath');
    }, 1000)
        .unref();

    setTimeout(async () => {
        await client.quit();
    }, 9000);
})();