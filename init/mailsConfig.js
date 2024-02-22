let mailer= require('nodemailer');
let config=require("config");
let mailCredentil = config.get("mailCredentil")

let transport= mailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    security:true,
    auth:mailCredentil
})


module.exports={transport}