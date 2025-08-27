require("dotenv").config();
const clc = require("cli-color");
const express = require("express");
const { db } = require("./db/models");
const path = require("path");
const app = express();

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/api", require("./routes"));

const port = process.env["PORT_" + process.env.RUN_MODE];
app.listen(port, () => {
  console.log(`Server is running on port ${clc.magenta.underline(port)}`);
});
