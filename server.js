const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/users");
const profile = require("./routes/profile");
const posts = require("./routes/posts");

//creating app
const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db config
const db = require("./config/keys").mongoURI;

//connecting to mongo db
mongoose
  .connect(db)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log("DB connection error"));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//configuring routes
app.use("/users", users);
app.use("/profile", profile);
app.use("/posts", posts);

//declaring port
const port = process.env.PORT || 5000;

//running server
app.listen(port, () => console.log(`server is running at port ${port}`));
