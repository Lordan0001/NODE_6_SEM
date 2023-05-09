import jwt from 'jsonwebtoken';

export default (req,res,next) =>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');

    if(token){
        try{
            const decode = jwt.verify(token,'secret123');
            req.userId = decode._id;
            next();
        }
        catch(err){
            return res.status(403).json({
                message:'Invalid token'
            });
        }

    }
    else{
      return  res.status(403).json({
            message:'You dont have permissions'
        });
    }

    //res.send(token);
}