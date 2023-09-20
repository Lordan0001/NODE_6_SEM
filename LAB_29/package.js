const express = require('express');
const jsonRouter = require('express-json-rpc-router');
const bodyParser = require('body-parser');

const app = express();

const controller = {
    sum(params, raw) {
        const summary = params.reduce(function (sum, current) {
            return sum + current;
        }, 0);
        return summary;
    },
    mul(params, raw) {
        const multy = params.reduce(function (mul, current) {
            return mul * current;
        }, 1);
        return multy;
    },
    div(params, raw) {
        return params.x / params.y;
    },
    proc(params, raw) {
        return (params.x / params.y) * 100;
    },
};

const sumMulValidator = function (params, _, raw) {
    if (!Array.isArray(params)) throw new Error('Enter mas');
    params.forEach(el => {
        if (!isFinite(el)) throw new Error('Params is not a number');
    });
    if (params[1] == 0) throw new Error('Zero');
    return params;
};

const namedParamsValidator = function (params, _, raw) {
    if (typeof params !== 'object' || params === null) throw new Error('Params must be an object');
    if (!isFinite(params.x) || !isFinite(params.y)) throw new Error('Params is not a number');
    if (params.y === 0) throw new Error('Zero');
    return params;
};

const before = {
    sum: (params, _, raw) => sumMulValidator(params, _, raw),
    mul: (params, _, raw) => sumMulValidator(params, _, raw),
    div: (params, _, raw) => namedParamsValidator(params, _, raw),
    proc: (params, _, raw) => namedParamsValidator(params, _, raw),
};

app.use(express.json());
app.use(bodyParser());
app.use(
    jsonRouter({
        methods: controller,
        beforeMethods: before,
        onError(err) {
            console.log(err);
        },
    })
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
