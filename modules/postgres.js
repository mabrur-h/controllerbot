const Sequelize = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(config.PGURL, {
  logging: false,
});


module.exports = sequelize;
