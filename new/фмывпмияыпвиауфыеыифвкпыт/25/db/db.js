const Sequelize = require('sequelize')
const redis = require('redis')

global.sequelize = new Sequelize('lab_25', 'main', 'toor', {
	host: 'localhost',
	dialect: 'mssql',
	port: 49816,
	pool: {
		min: 0,
		max: 5,
	},}) 

/*const redisClient = redis.createClient('//redis-10275.c124.us-central1-1.gce.cloud.redislabs.com:10275',
{password: 'RMjSK1pCVWjZARGPjtE9fOwjIbGTBQVz'})*/

const redisClient = redis.createClient({
	url:'redis://default:8bpqc3f5wt9n1P9wZ0MeXf4T4JDKMild@redis-13788.c17.us-east-1-4.ec2.cloud.redislabs.com:13788'
});

const {Users, Repos, Commits} = require('./models')

module.exports = {
    redisClient,
    models: {Users, Repos, Commits}
}