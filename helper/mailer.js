    let {transport}=require("../init/mailsConfig")
async function sendMail(params) {
    if (typeof(params.to) != "string" || typeof(params.from) != "string") {
        return {error:"please provide to and from"}
    }
    let send =await transport.sendMail(params).catch((error)=>{return{error}})
    console.log("send",send);
     if(!send || (send && send.error)){
        return {error:"internal server error"}
    }
    return {data:send}
}
module.exports={sendMail}