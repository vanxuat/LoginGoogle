const Sequelize=require("sequelize");
const db=require("./../config/db");

const User=db.define('user',{
    googleid:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING
    }
})

module.exports=User;














