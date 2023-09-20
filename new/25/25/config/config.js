module.exports = {
    port: 3000,
    jwt: {
        tokens: {
            access: {
                type: 'access',
                expiresIn: '10m',
                secret: 'access-secret'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '24h',
                secret: 'refresh-secret'
            }
        }
    }
};
