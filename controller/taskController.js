let auth=require("../model/taskAuth");

async function createTask(req,res) {
    let data= await auth.createTask(req.body,req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error=(data && data.error) ? data.error:'internal server error';
        let status=(data && data.status) ? data.status:500;    

    return res.status(status).send({error})    

    }
    return res.send({data:data.data});
}


async function update(req,res){
    let data=await auth.update(req.params.taskId,req.body,req.userData).catch((error)=>{
        return {error}
    })
    if(!data || (data && data.error)){
        let error= (data && data.error) ? data.error:"Internal Server Error"
        let status= (data && data.status) ? data.status:500;
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}                              

async function list(req,res){
    let data=await auth.list(req.params.taskId,req.userData).catch((error)=>{
        return {error}
    })
    console.log("data of list",data);
    if(!data || (data && data.error)){
        let error= (data && data.error) ? data.error:"Internal Server Error"
        let status= (data && data.status) ? data.status:500;
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}                              

async function detail(req, res) {
    let data = await auth.detail(req.params.taskId, req.body, req.userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function assignTo(req,res) {
    let data = await auth.assignTo(req.body,req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) { 
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}

async function deleteTask(req,res) {
    let data = await auth.deleteTask(req.body,req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) { 
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}

async function restoreTask(req,res) {
    let data = await auth.restoreTask(req.body,req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) { 
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}

async function update_taskStatus(req,res) {
    let data = await auth.update_taskStatus(req.body,req.userData).catch((error)=>{return{error}})
    if (!data || (data && data.error)) { 
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}

module.exports={createTask,update,list,detail,assignTo,deleteTask,restoreTask,update_taskStatus}