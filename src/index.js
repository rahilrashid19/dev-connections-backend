const express = require("express");
const { connectDB } = require("./config/dbConnection");
require("dotenv").config();

const app = express();

connectDB()
  .then(() => {
    console.log("Database connection established successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Sever started on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Something went wrong => ${err}`);
  });
