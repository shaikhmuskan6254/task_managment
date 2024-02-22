let {sequelizeCon,Model,DataTypes,Op,QueryTypes,rawQuery}=require('../init/dbconfig')

class Task extends Model{ }

Task.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(155),
        allowNull: false
    },
    description:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    endDate:{
        type:DataTypes.STRING(300),
        timestamps: true
    },
    startDate:{
        type:DataTypes.STRING(300),
        timestamps: true
    },
    expectedEndDate:{
        type:DataTypes.STRING(300),
        timestamps: true
    },
    expectedStartDate:{
        type:DataTypes.STRING(300),
        timestamps: true
    },
    assignTo:{
        type:DataTypes.INTEGER,
        allowNull:true
   },
    status:{
        type:DataTypes.TINYINT,
        allowNull:true
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true,

    }
},{tableName:"task",modelName:"Task",sequelize:sequelizeCon});
// Task.sync();

module.exports={Task,QueryTypes,rawQuery,sequelizeCon}