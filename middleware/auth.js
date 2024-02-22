let security=require("../helper/security")
let {User}=require("../schema/user");

async function auth(req,res,next) {
    
    // check if token exist in header 
    let token = req.header("token")
    if((typeof(token))!="string"){
        return res.status(400).send({error:"token is required"})
    }
    //decrypt token
    let decryptedToken= await security.verifyAsync(token).catch((error)=>{return{error}})
    if(!decryptedToken || (decryptedToken && decryptedToken.error)){
        return res.status(403).send({error:"token not valid"})
    }
    
    // check if user id and token ise present in db
    let user = await User.findOne({where:{token:token,id:decryptedToken.id}}).catch((error)=>{return{error}});
    if(!user || (user && user.error)){
        return res.status(403).send({error:"Access denied"});
    }

    // check if user is not deleted
    if(user.isDeleted){
        return res.send({error:"user is deleted"});
    }
    req["userData"]={
        id:user.id,email:user.emailID,name:user.name,isActive:user.isActive
    }
    // pas req to next function 
    next();
}

module.exports=auth;