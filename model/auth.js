let { User } = require("../schema/user");
let joi = require('joi');
let {sendMail}=require("../helper/mailer")
let bcrypt = require('bcrypt');
let security=require("../helper/security");
let config=require("config");
let mailCredential= config.get("mailCredentil");
let {validate}=require("../helper/validation")


async function register(params){
    // user data validation
    let schema = joi.object({
        username: joi.string().min(2).max(155).required(),
        email: joi.string().email().max(255).required(),
        password: joi.string().min(8).max(16).required()
    })
    let check = await validate(schema,params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, statu: 400 }

    }
    // check if user exist
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => { return { error } })
    
    if (user) {
        return { error: 'user already exist', statu: 409 }
    }

    // hash password 

    let password = await bcrypt.hash(params.password, 10).catch((error) => { return { error } })
    
    if (!password || (password && password.error)) {
        return { error: 'internal server error', statu: 500 }

    }

    // data format

    let data = {
        name: params.username,
        emailID: params.email,
        password: password
    }

    // insert in a database 
    let insert = await User.create(data).catch((error) => { return { error } })
    if (!insert || (insert && insert.error)) {
        return { error: 'internal server error', statu: 500 }

    }

    // return in a response
    return { data: insert }

}

async function vlidateRegister(data) {
    let schema = joi.object({
        username: joi.string().min(2).max(155).required(),
        email: joi.string().email().max(255).required(),
        password: joi.string().min(8).max(16).required()
    })
    
}

async function login(params) {
    // user data validation
    let schema=joi.object({
        email:joi.string().email().max(255).required(),
        password: joi.string().min(8).max(16).required(),

    })
    let check= await validate(schema,params).catch((error)=>{
        return {error}});
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // check if user email exist in db
    let user=await User.findOne({where:{emailID:params.email}}).catch((error)=>{
        return {error}
    })
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:404}
    }
    // compare the password
    let compare= await bcrypt.compare(params.password,user.password).catch((error)=>{return {error}});
    if(!compare || (compare && compare.error)){
        return {error:"User email & Password Invalid",status:403}
    }
    // generate token
    let token=await security.signAsync({id:user.id}).catch((error)=>{return {error}});
    if(!token || (token && token.error)){
        return {error:"Internal Server Error",status:500}
    }
    // save token in db
    let update= await User.update({token},{where:{id:user.id}}).catch((error)=>{return {error}});
    if(!update || (update && update.error)){
        return {error:"User Not Login Yet...! Please Try Again",status:500}
    }
    // return token in response 
    return {token}

}


async function forgetPassword(params) {
    // user data validation
    let schema= joi.object({
        email: joi.string().email().max(255).required()
    })
    let check= await validate(schema,params).catch((error)=>{
        return {error}});
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // check if email exist
    let user=await User.findOne({where:{emailID:params.email}}).catch((error)=>{
        return {error}
    })
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:404}
    }
    // genarate otp
    let otp="123456"

    // hash otp
    let hash = await bcrypt.hash(otp,10).catch((error) => { return { error } })
    if (!hash || (hash && hash.error)) {
        return { error: 'internal server error', statu: 500 }

    }     
    // save in db
    let update= await User.update({otp:hash},{where:{id:user.id}}).catch((error)=>{return {error}});
    if(!update || (update && update.error)){
        return {error:"could not process",status:500}
    }
    // send email to user 
    let mailOption={
        to:params.email,
        from:mailCredential.user,
        subject:"forget password",
        text:`otp to reset password is ${otp}`
    }
    let mail=await sendMail(mailOption).catch((error)=>{return{error}})

    if(!mail || (mail && mail.error)){
        return {error:"not able to send otp",status:500}
    }
    // return responce
    return{data:"updated successfully"}
}

async function resetPasseord(params) {
    // user data validation
    let schema=joi.object({
        otp:joi.string().min(6).max(6).required(),
        email:joi.string().max(255).required(),
        password:joi.string().min(8).max(16).required()
    })
    let check= await validate(schema,params).catch((error)=>{
        return {error}});
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // check if email exist
    let user=await User.findOne({where:{emailID:params.email}}).catch((error)=>{
        return {error}
    })
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:404}
    }
    // compare otp
    let compare= await bcrypt.compare(params.otp,user.otp).catch((error)=>{return {error}});
    if(!compare || (compare && compare.error)){
        return {error:"otp is not valide",status:403}
    }
    // hash password
    let password = await bcrypt.hash(params.password, 10).catch((error) => { return { error } })
    
    if (!password || (password && password.error)) {
        return { error: 'internal server error', statu: 500 }

    }

    // updaate password in db
    let update=await User.update({password:password,otp:""},{where:{id:user.id}}).catch((error)=>{return{error}})
    if(!update || (update && update.error)){
        return {error:"password not update",status:500}
    }
    // return response
    return{data:"update password successfully"}
}

async function logout(userData) {
     let schema= joi.object ({
     id:joi.number().required()
     })
     let check= await validate(schema,{id:userData.id}).catch((error)=>{
        return {error}});
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    let update= await User.update({token:""},{where:{id:userData.id}}).catch((error)=>{return{error}})
    if(!update || (update && update.error)){
        return {error:"not logout",status:500}
    }
    return{data:" logout successfully"}
}
async function changePassword(params,userData){
    // User Data Validation
    let schema=joi.object({
        oldPassword:joi.string().min(8).max(16).required(),
        newPassword:joi.string().min(8).max(16).required()
    })

    let check=await validate(schema,params).catch((error)=>{
        return {error}
    })
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // fetch User Data From DB
    let user=await User.findOne({where:{id:userData.id}}).catch((error)=>{
        return {error}
    })
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:500}
    }

    // Compare Old Password
    let compare=await bcrypt.compare(params.oldPassword,user.password).catch((error)=>{
        return {error}
    })
    if(!compare || (compare && compare.error)){
        return {error:"Invalid Password",status:400}
    }
    // Hash New Password
    let hash=await bcrypt.hash(params.newPassword,10).catch((error)=>{
        return{error}
    })
    if(!hash || (hash && hash.error)){
        return {error:"Internal Server Error",status:500}
    }
    // Update Password in DB

    let update=await User.update({password:hash,token:""},{where:{id:user.id}}).catch((error)=>{
        return {error}
    })
    if(!update || (update && update.error)){
        return {error:"Password Could Not Change...!!!Please Try Again",status:500}
    }
    // Return Response
    return {data:"Success"}

}

module.exports = { register, login, logout,forgetPassword,resetPasseord,changePassword } 