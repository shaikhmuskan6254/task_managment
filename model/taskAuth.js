let {Task,QueryTypes,rawQuery,sequelizeCon}=require("../schema/task");
let joi = require('joi');
let config=require("config");
let {validate}=require("../helper/validation");
let mailCredentil= config.get("mailCredentil");
let {sendMail}=require("../helper/mailer")




async function createTask(params,userData) {
    // user data validation
    let schema=joi.object({
    taskName:joi.string().min(3).max(155).required(),
    taskDescription:joi.string().min(10).max(255).required(),
    expectedStartDate:joi.string()
})
    let check = await validate(schema,params).catch((error) => { return { error } })
        if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
}
    // data fromat
    let data = {
        name: params.taskName,
        description: params.taskDescription,
        expectedStartDate:params.expectedStartDate,
        createdBy:userData.id
    }
    // insert data into db
    let insert = await Task.create(data).catch((error) => { return { error } })
    if (!insert || (insert && insert.error)) {
        return { error: 'internal server error', statu: 500 }

    }
    // return response
    return { data: insert }
}

async function update(taskID,params,userData) {
    // user data vaalidation
    let schema=joi.object({
    id:joi.number().required(),
    taskName:joi.string().min(5).max(155),
    expectedStartDate:joi.string(),
    expectedEndDate:joi.string()
    })
    let joiParams={...params};
    joiParams["id"]=taskID
    let check = await validate(schema,joiParams).catch((error) => { return { error } })

    if (!check || (check && check.error)) {
    return { error: check.error, statu: 400 }
}

    // check if task exist
    let task=await Task.findOne({where:{id:taskID,isDeleted:false}}).catch((error)=>{return{error}})
    console.log("task accesss denied ",task);
    if (!task || (task && task.error)) {
        return { error: 'task not found', statu: 500 }

    }
    // check if task is created by the login user
    if(userData.id != task.createdBy){
        return{error:"access denied",statu:403}
        
    }
    // format data
    let data={}
    if(params.taskName){data ["name"]=params.taskName}
    // update data into db
    let update= await Task.update(data,{where:{id:taskID}}).catch((error)=>{return{error}})
    if (!update || (update && update.error)) {
        return { error: 'Task not updated', statu: 500 }

    }        

    // retuurn response  
    return{data:update}
}

async function list(params,userData){
    let selectQuery =`select task.name, user.name as createdBy
    from task
    left join user on task.createdBy=: userID or task.assingTo = userID
    `

    let task = await sequelizeCon.query(selectQuery,{
        replacements : {userID:userData.id},
        type: QueryTypes.SELECT,
    }).catch((error)=>{return{error}});
    console.log("task error",task);
    if (!task || (task && task.error)) {
        return{error:"task not found",statu:404}
    }

    return{data:task}
}

async function detail(taskId, params, userData) {
    // UserData Validation
    let schema = joi.object({
        id: joi.number().required()
    })
    let joiParams = { ...params }
    joiParams["id"] = taskId;
    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Create the Sql Query
    let query = `SELECT task.name AS taskName,task.description AS taskdescription, u1.name AS createdBy,u2.name AS updatedBy,u3.name AS assignTo
    FROM task
    LEFT JOIN user AS u1 ON task.createdBy = u1.id
    LEFT JOIN user AS u2 ON task.updatedBy = u2.id
    LEFT JOIN user AS u3 ON task.assignTo = u3.id
    Where task.id= :taskID and (task.createdBy= :userID or task.assignTo= :userID)`
    // Fetch Data From DataBase
    let detail = await sequelizeCon.query(query, {
        type: QueryTypes.SELECT,
        replacements: { taskID: taskId, userID: userData.id }
    }).catch((error) => {
        return { error }
    })
    if (!detail || (detail && detail.error)) {
        return { error: "Task Detail Cannot Found", status: 404 }
    }
    // Return Response
    return { data: detail }

}

async function assignTo(params, userData) {
    // Userdata Validation
    let schema = joi.object({
        taskId: joi.number().required(),
        userId: joi.number().required()
    })
    let check = await validate(schema, params).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 };
    }
    // Check if task exist
    let task = await Task.findOne({ where: { id: params.taskId, isDeleted: false,isActive:1 } }).catch((error) => { return { error } });
    
    if (!task || (task && task.error)) {
        return { error: "Task Not Found", error: 404 }
    }
    // Check if task belongs to Login User 
    if (userData.id != task.createdBy) {
        return { error: 'You are not authorized for this action', status: 401 }
    }
    // Check if User exist 
    let user = await User.findOne({ where: { id: params.userId } }).catch((error) => { return { error } });
    if (!user || (user && user.error)) {
        return { error: 'User Not Found', status: 404 }
    }
    // Data Format
    let data = {
        status: 2,
        assignTo: params.userId,
        updatedBy: userData.id,
    }
    // Update Task in Database
    let update = await Task.update(data, { where:{ id: params.taskId }}).catch ((error) => { return { error } });
    if (!update || (update && update.error)) {
        return{error:'data Not Updated',status:402}
    }
    // Mail Format
    let mailOPtion={
        to:assignUser.emailID,
        from:mailCredentil.user,
        subject:"task assigned",
        text:`a new task is assign ${task.name} to you by ${userData.name}`
    }
    // Send Mail
    let mail=await sendMail(mailOPtion).catch((error)=>{return{error}})

    if(!mail || (mail && mail.error)){
        return {error:"not able to send otp",status:500}
    // Return Response 
    return { data:update };
}
}

async function deleteTask(taskID,params,userData){
    // user data validation
    let schema=joi.object({
        id:joi.number().required(),
        taskName:joi.string().min(5).max(155),
        expectedStartDate:joi.string(),
        expectedEndDate:joi.string()
        })
        let joiParams={...params};
        joiParams["id"]=taskID
        let check = await validate(schema,joiParams).catch((error) => { return { error } })
    
        if (!check || (check && check.error)) {
        return { error: check.error, statu: 400 }
    }
    
    // check if task exist
    let task=await Task.findOne({where:{id:taskID,isDeleted:false}}).catch((error)=>{return{error}})
    if (!task || (task && task.error)) {
        return { error: 'task not found', statu: 500 }

    }
    // check if task is created by the login user 
    if(userData.id != task.createdBy){
        return{error:"access denied",statu:403}
        
    }
    // check if task is not deleted
    let find=await Task.findOne({where:{isDeleted:true}}).catch((error)=>{return{error}})
    if (!find || (find && find.error)) {
        return{error:"task is already deleted....!"}
    }
    // data format 
    let data = {
        assignTo: params.userId,
        updatedBy: userData.id,
    }
    // update data into db
    let update = await Task.update(data, { where:{ id: params.taskId }}).catch ((error) => { return { error } });
    if (!update || (update && update.error)) {
        return{error:'data Not Updated',status:402}
    }
    // return response
    return{data:update}
}

async function restoreTask(taskID,params,userData){
    // user data validation
    let schema=joi.object({
        id:joi.number().required(),
        taskName:joi.string().min(5).max(155),
        expectedStartDate:joi.string(),
        expectedEndDate:joi.string()
        })
        let joiParams={...params};
        joiParams["id"]=taskID
        let check = await validate(schema,joiParams).catch((error) => { return { error } })
    
        if (!check || (check && check.error)) {
        return { error: check.error, statu: 400 }
    }
    
    // check if task exist
    let task=await Task.findOne({where:{id:taskID,isDeleted:true}}).catch((error)=>{return{error}})
    if (!task || (task && task.error)) {
        return { error: 'task not found', statu: 500 }

    }
    // check if task is created by the login user 
    if(userData.id != task.createdBy){
        return{error:"access denied",statu:403}
        
    }
    // check if task is deleted
    let find=await Task.findOne({where:{isDeleted:false}}).catch((error)=>{return{error}})
    if (!find || (find && find.error)) {
        return{error:"Task restored successfully.....!"}
    }
    // data format 
    let data = {
        assignTo: params.userId,
        updatedBy: userData.id,
    }
    // update data into db
    let update = await Task.update(data, { where:{ id: params.taskId }}).catch ((error) => { return { error } });
    if (!update || (update && update.error)) {
        return{error:'data Not Updated into database',status:402}
    }
    // return response
    return{data:update}
}

async function update_taskStatus(taskID,params,userData){
    // user data validation
    
    // check if task exist
    // check if task is assignTo login user 
    // check if task is not deleted
    // check if status code is valide
    // data format 
    // update data into db
    // return response
}


    module.exports={createTask,update,list,detail,assignTo,deleteTask,restoreTask,update_taskStatus}