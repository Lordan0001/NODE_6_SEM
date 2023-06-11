const redis = require('redis');

const client = redis.createClient();

client.on('error', () => console.log('Redis internal error.'));
client.on('connect', () => console.log('\nClient connected to Redis.'));
client.on('end', () => console.log('Client disconnected.\n'));




(async () => {
    const clientClone = client.duplicate();
    await clientClone.connect();
    console.log();

    await clientClone.subscribe('Power metal', (msg, channel) => {
        console.log(`${channel} sent: ${msg}`);
    }, true);

    await clientClone.subscribe('Heavy metal', (msg, channel) => {
        console.log(`${channel} sent: ${msg}`);
    }, true);



    setTimeout(async () => {
        await clientClone.pUnsubscribe();
        await clientClone.quit();
    }, 6000);
})()

