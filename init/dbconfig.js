let {Sequelize,Model,DataTypes,Op,QueryTypes}=require('sequelize')
let config=require('config')
let mysql=config.get("mysql")

let sequelizeCon=new Sequelize(mysql)
sequelizeCon.authenticate().then(()=>{console.log('connected to db');}).catch((error)=>{console.log('db error');})

module.exports={sequelizeCon,Model,DataTypes,Op,QueryTypes,rawQuery:sequelizeCon.query};