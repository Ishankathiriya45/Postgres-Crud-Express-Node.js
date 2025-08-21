"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const clc = require("cli-color");
const basename = path.basename(__filename);
const envMode = process.env.RUN_MODE;
const db = {};

const username = process.env[`DB_USERNAME_${envMode}`];
const password = process.env[`DB_PASSWORD_${envMode}`];
const database = process.env[`DB_NAME_${envMode}`];
const host = process.env[`DB_HOSTNAME_${envMode}`];

let sequelize;
sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: "mysql",
  pool: {
    min: parseInt(process.env.DB_POOL_MIN),
    max: parseInt(process.env.DB_POOL_MAX),
    acquire: process.env.DB_POOL_ACQUIRE,
    idle: parseInt(process.env.DB_POOL_IDLE),
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      clc.magenta.underline(`Database connection successfully`),
      clc.cyan.underline(`DB:${database}`)
    );
  })
  .catch((error) => {
    console.log(clc.red(`Database connection failed`, error.message));
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = { db, sequelize };
