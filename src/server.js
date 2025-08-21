require("dotenv").config();
const clc = require("cli-color");
const express = require("express");
const { db } = require("./models");
const app = express();

const port = process.env["PORT_" + process.env.RUN_MODE];
app.listen(port, () => {
  console.log(`Server is running on port ${clc.magenta.underline(port)}`);
});
