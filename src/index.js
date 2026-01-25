const express = require("express");
const { connectDB } = require("./config/dbConnection");
require("dotenv").config();
const { authRouter } = require("./routes/auth");

const app = express();
app.use(express.json());

app.use("/", authRouter);

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
