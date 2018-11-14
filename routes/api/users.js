const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

//loading user model
const User = require("../../models/Users");

//loading keys
const keys = require("../../config/keys");

//@route        GET api/users/register
//@description  tests users routes
//@access       public
router.post("/register", (req, res) => {
  User.findOne(
    { email: req.body.email }.then(user => {
      if (user) {
        return res.status(400).json({ msg: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: 200,
          r: "pg",
          d: "mm"
        });
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        };
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
  );
});

//@route        GET api/users/login
//@description  login users
//@access       public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //create jwt payload
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: "true", token: "Bearer" + token });
          }
        );
      } else {
        return res.status(400).json({ msg: "Password is incorrect" });
      }
    });
  });
});

//@route        GET  api/users/current
//@description  Return current user
//@access       Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
