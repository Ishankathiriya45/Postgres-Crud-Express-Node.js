require("dotenv").config();
const envMode = process.env.RUN_MODE;

const config = {
  [envMode.toLowerCase()]: {
    username: process.env[`DB_USERNAME_${envMode}`],
    password: process.env[`DB_PASSWORD_${envMode}`],
    database: process.env[`DB_NAME_${envMode}`],
    host: process.env[`DB_HOSTNAME_${envMode}`],
    dialect: "postgres",
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN),
    max: parseInt(process.env.DB_POOL_MAX),
    acquire: process.env.DB_POOL_ACQUIRE,
    idle: parseInt(process.env.DB_POOL_IDLE),
  },
  run_mode: envMode,
  port: process.env[`PORT_${envMode}`],
};

global.config = config;

module.exports = config;