let express=require("express");
let auth=require("./middleware/auth");
let authController=require("./controller/auth");
let taskController=require("./controller/taskController");
let router=express.Router();

router.get("/",(req,res)=>{
    return res.send("welocome to todo ptoject");
})



router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/forgetPassword",authController.forgetPassword);
router.put("/resetPassword",authController.resetPasseord);
router.put("/logout",auth,authController.logout);
router.put("/changePassword",auth,authController.changePassword);

// crud routes
router.post("/Task",auth,taskController.createTask);
router.put("/task/assignTo",auth,taskController.assignTo);
router.put("/Task/:taskId",auth,taskController.update);
router.get("/Task/:id",auth,taskController.detail);
router.get("/Task",auth,taskController.list);
router.delete("/Task/:id",auth,taskController.deleteTask);
router.put("/task/id",auth,taskController.restoreTask);
router.put("/task/status/id",auth,taskController.update_taskStatus);




module.exports=router
