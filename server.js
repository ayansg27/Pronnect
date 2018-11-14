const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//creating app
const app = express();

//db config
const db = require("./config/keys").mongoURI;

//connecting to mongo db
mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log("DB connection error"));

//declaring port
const port = process.env.PORT || 3000;

//running server
app.listen(port, () => console.log(`server is running at port ${port}`));
