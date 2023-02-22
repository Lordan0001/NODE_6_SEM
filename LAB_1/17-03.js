const redis = require('redis');

const client = redis.createClient();

client.on('error', () => console.log('Redis internal error.'));
client.on('connect', () => console.log('\nClient connected to Redis.'));
client.on('end', () => console.log('Client disconnected.\n'));


(async () => {
    await client.connect();

    await client.set('incrDecrValue', 0);


    console.time('INCR =>');
    for (let i = 1; i <= 10000; ++i) {
        await client.incr('incrDecrValue');
    }
    console.timeEnd('INCR =>');


    console.time('DECR =>');
    for (let i = 10000; i > 0; --i) {
        await client.decr('incrDecrValue');
    }
    console.timeEnd('DECR =>');

    
    await client.quit();
})();

