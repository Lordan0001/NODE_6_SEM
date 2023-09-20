const crypto =require('crypto');


module.exports.cipher = (rs,ws,key)=>
{
    const alg ='aes-256-cbc';
    const piv = Buffer.alloc(16,0);//создает новый объект буфера указанного размера.
    const pk = key? key:crypto.randomBytes(32);//спользуется для генерации криптографически хорошо построенных искусственных случайных данных и количества байтов
    const ch = crypto.createCipheriv(alg,pk,piv);//используется для создания объекта Cipher с указанным алгоритмом, ключом и вектором инициализации (iv)
    rs.pipe(ch).pipe(ws);
}

module.exports.decipher = (rs,ws,key,iv,cb)=>
{
    const alg ='aes-256-cbc';
    const piv = iv?iv:Buffer.alloc(16,0);
    const dch = crypto.createDecipheriv(alg,key,piv);//спользуется для создания объекта Decipher с указанным алгоритмом , ключом и вектором инициализации
    rs.pipe(dch).pipe(ws);
}