const {AppErr}= require("../utils/appErr");
const getTokenFromHeader= require('../utils/getTokenFromHeader');
const verifyToken = require('../utils/verifyToken');
const isLogin=(req,res,next)=>{
    //get token from req handler
    const token= getTokenFromHeader(req)
    //verify
    const decodedUser= verifyToken(token);
    //save the user into req obj
    req.user=decodedUser.id;
    if(!decodedUser){
        return next(new AppErr('Invalid/expired token, Please Login again',401))
    }
    next();
};
module.exports=isLogin;
