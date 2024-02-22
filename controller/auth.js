let auth=require("../model/auth");

async function register(req,res) {
    let data= await auth.register(req.body).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error=(data && data.error) ? data.error:'internal server error';
        let status=(data && data.status) ? data.status:500;    

    return res.status(status).send({error})    

    }
    return res.send({data:data.data});
}

async function login(req,res){
    let data=await auth.login(req.body).catch((error)=>{
        return {error}
    })
    if(!data || (data && data.error)){
        let error= (data && data.error) ? data.error:"Internal Server Error"
        let status= (data && data.status) ? data.status:500;
        return res.status(status).send({error})
    }
    return res.header("token",data.token).send({status:" User Login Successfully"})

}

async function forgetPassword(req,res) {
    let data= await auth.forgetPassword(req.body).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error=(data && data.error) ? data.error:'internal server error';
        let status=(data && data.status) ? data.status:500;    

        return res.status(status).send({error})    

    }
    return res.send("success");
}

async function resetPasseord(req,res) {
    let data= await auth.resetPasseord(req.body).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error=(data && data.error) ? data.error:'internal server error';
        let status=(data && data.status) ? data.status:500;    

        return res.status(status).send({error})    

    }
    return res.send("update password success");
}

async function logout(req,res) {
    let data= await auth.logout(req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error=(data && data.error) ? data.error:'internal server error';
        let status=(data && data.status) ? data.status:500;    

        return res.status(status).send({error})    

    }
    return res.send("user log out successfully");
    
}

async function changePassword(req,res){
    let data=await auth.changePassword(req.body,req.userData).catch((error)=>{
        return {error}
    })
    if(!data || (data && data.error)){
        let error= (data && data.error) ? data.error:"Internal Server Error"
        let status= (data && data.status) ? data.status:500;
        return res.status(status).send({error})
    }
    return res.send({status:"Password Has Been Changed Successfully"})
}                                                                                                            
module.exports={register,login,forgetPassword,resetPasseord,logout,changePassword}