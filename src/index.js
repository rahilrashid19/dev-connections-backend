const express = require("express");
const { connectDB } = require("./config/dbConnection");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

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
