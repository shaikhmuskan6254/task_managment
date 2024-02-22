let jwt =require("jsonwebtoken");


function signAsync(data,key="1234567890") {
    return new Promise((res, rej) => {
        jwt.sign(data,key,(error,data)=>{
            if(error){return rej(error)}
            return res(data)
        })
    })
}



function verifyAsync(data,key="1234567890") {
    return new Promise((res, rej) => {
        jwt.verify(data,key,(error,data)=>{
            if(error){return rej(error)}
            return res(data)
        })
    })
}


module.exports={signAsync,verifyAsync}