const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const db = new Sequelize('google', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
});


module.exports=db;