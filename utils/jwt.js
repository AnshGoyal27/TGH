const jwt = require('jsonwebtoken');
const privatekey = "SomeRandomAccessKey";

module.exports = {
    async assignToken(data,expires){
        return jwt.sign({
            data: data
          }, privatekey, { expiresIn: expires });
    },  
    async checkToken(req,res,next){
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = authHeader.split(' ')[1];
            jwt.verify(token,privatekey,(err,result)=>{
                if(err){
                    res.status(401).send({success:false,message:"Not Authenticated"});
                }
                else{
                    res.locals.authorization = result.data;
                    next();
                }
            })
        }
        else{
            res.status(403).send({success:false,message:"Token not sent"})
        }   
    }
    
}
