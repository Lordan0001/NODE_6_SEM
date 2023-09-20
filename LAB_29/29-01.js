const JsonRPCServer = require('jsonrpc-server-http-nats');

const server = new JsonRPCServer();

let bin_validator = (params) => {
    console.log(params);
    if (Array.isArray(params)) {
        if (params.length <= 1)
            throw new Error('Массив должен иметь больше одного элемента');
        params.forEach((item) => {
            if (!Number.isInteger(item))
                throw new Error('Ожидается число');
        })
        return params;
    } else if (typeof params === 'object') {
        if (!params.x || !params.y) {
            throw new Error('Ожидаются поля x и y');
        }
        if (!Number.isInteger(params.x) || !Number.isInteger(params.y)) {
            throw new Error('X и Y должны быть числа');
        }
        return params
    }
    throw new Error('Ожидается массив чисел или объект с свойствами x и y');
}

server.on('sum', bin_validator, (params, channel, response) => {
    if (Array.isArray(params)) {
        response(null, params.reduce((a, b) => a + b));
        return
    }
    response(null, params.x + params.y);
});

server.on('mul', bin_validator, (params, channel, response) => {
    if (Array.isArray(params)) {
        response(null, params.reduce((a, b) => a * b));
        return
    }
    response(null, params.x * params.y)
});

server.on('div', bin_validator, (params, channel, response) => {
    if (Array.isArray(params)) {
        response(null, params[0] / params[1]);
        return
    }
    response(null, params.x / params.y);
});

server.on('proc', bin_validator, (params, channel, response) => {
    if (Array.isArray(params)) {
        response(null, params[0] * 100 / params[1]);
        return
    }
    response(null, params.x * 100 / params.y);
});

server.listenHttp({ host: 'localhost', port: 3000 }, () => {
    console.log(`Listening to http://localhost:3000/`)
});
