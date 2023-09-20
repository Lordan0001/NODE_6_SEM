const crypto = require('crypto');


function ServerDH(len_a, g) {
    const dh = crypto.createDiffieHellman(len_a, g);
    const p = dh.getPrime();
    const gb = dh.getGenerator();
    const k = dh.generateKeys();
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: gb.toString('hex'),
            key_hex: k.toString('hex'),
        };
    };
    this.getSecret = clientContext => {
        const k = Buffer.from(clientContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}



function ClientDH(serverContext) {
    const ctx = {
        p_hex: serverContext.p_hex ? serverContext.p_hex : '1111',
        g_hex: serverContext.g_hex ? serverContext.g_hex : '1',
    };
    const p = Buffer.from(ctx.p_hex, 'hex');
    const g = Buffer.from(ctx.g_hex, 'hex');
    const dh = crypto.createDiffieHellman(p, g);
    const k = dh.generateKeys();
    this.getContext = () => {
        return {
            p_hex: p.toString('hex'),
            g_hex: g.toString('hex'),
            key_hex: k.toString('hex'),
        };
    };
    this.getSecret = clientContext => {
        const k = Buffer.from(clientContext.key_hex, 'hex');
        return dh.computeSecret(k);
    };
}


function cipherFile(readStream, writeStream, key) {
    const alg = 'aes-256-cbc';
    const piv = Buffer.alloc(16, 0);
    const ch = crypto.createCipheriv(alg, key, piv);
    readStream.pipe(ch).pipe(writeStream);
}


function decipherFile(readStream, writeStream, key, iv) {
    const alg = 'aes-256-cbc';
    const piv = iv ? iv : Buffer.alloc(16, 0);
    const dch = crypto.createDecipheriv(alg, key, piv);
    readStream.pipe(dch).pipe(writeStream);
}


module.exports.ServerDH = ServerDH;
module.exports.ClientDH = ClientDH;
module.exports.cipherFile = cipherFile;
module.exports.decipherFile = decipherFile;