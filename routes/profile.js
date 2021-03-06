const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const router = express.Router();

//load profile model
const Profile = require("../models/Profile");

//load user model
const User = require("../models/User");

//load profile validation
const validateProfileInput = require("../validation/profile");

//load experience validation
const validateExperienceInput = require("../validation/experience");

//load experience validation
const validateEducationInput = require("../validation/education");

//@route        GET  /profile
//@description  gets current user profile
//@access       private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.json(err));
  }
);

//@route        POST  /profile/all
//@description  get all profiles
//@access       public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ msg: "There are no profiles" }));
});

//@route        POST  api/profile/handle/:handle
//@description  get profile by handle
//@access       public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile available for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: "No profile available" }));
});

//@route        POST  api/profile/user/:user_id
//@description  get profile by user id
//@access       public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile available for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route        POST  api/profile
//@description  create user profile
//@access       private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.body.profileData);
    const profileInput = JSON.parse(req.body.profileData);
    //console.log(profileInput);
    const { errors, isValid } = validateProfileInput(profileInput);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //get fields
    const profileFields = {};
    //setting profile pic
    if (req.files) {
      let uploadFile = req.files.file;
      const fileName = req.files.file.name;
      let fileNameSplit = fileName.split(".");
      let finalFileName =
        fileNameSplit[0] + "-" + Date.now() + "." + fileNameSplit[1];
      const fileDir = path.join(__dirname, "../");
      uploadFile.mv(`${fileDir}/public/uploads/${finalFileName}`, function(
        err
      ) {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        profileFields.imgPath = `/uploads/${finalFileName}`;
      });
    }
    //setting profile fields
    profileFields.user = req.user.id;

    if (profileInput.handle) profileFields.handle = profileInput.handle;
    if (profileInput.company) profileFields.company = profileInput.company;
    if (profileInput.website) profileFields.website = profileInput.website;
    if (profileInput.location) profileFields.location = profileInput.location;
    if (profileInput.bio) profileFields.bio = profileInput.bio;
    if (profileInput.status) profileFields.status = profileInput.status;
    if (profileInput.githubusername)
      profileFields.githubusername = profileInput.githubusername;
    //skills
    if (typeof profileInput.skills != "undefined") {
      profileFields.skills = profileInput.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (profileInput.youtube)
      profileFields.social.youtube = profileInput.youtube;
    if (profileInput.twitter)
      profileFields.social.twitter = profileInput.twitter;
    if (profileInput.facebook)
      profileFields.social.facebook = profileInput.facebook;
    if (profileInput.linkedin)
      profileFields.social.linkedin = profileInput.linkedin;
    if (profileInput.instagram)
      profileFields.social.instagram = profileInput.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findByIdAndUpdate(
          profile.id,
          { $set: profileFields },
          { new: true }
        )
          .then(profile => res.json(profile))
          .catch(err => res.json(err));
      } else {
        //create
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exists";
            res.status(400).json(errors);
          }
          //create and save profile
          new Profile(profileFields)
            .save()
            .then(profile => res.json(profile))
            .catch(err => res.json(err));
        });
      }
    });
  }
);

//@route        GET  api/profile/experience
//@description  add experience to profile
//@access       private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array
      profile.experience.unshift(newExp);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err));
    });
  }
);

//@route        GET  api/profile/education
//@description  add education to profile
//@access       private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        location: req.body.location,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route        DELETE  api/profile/experience/:exp_id
//@description  delete experience from profile
//@access       private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //splice out of array
        profile.experience.splice(removeIndex, 1);
        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

//@route        DELETE  api/profile/education/:edu_id
//@description  delete education from profile
//@access       private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //splice out of array
        profile.education.splice(removeIndex, 1);
        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

//@route        DELETE  api/profile
//@description  delete user and profile
//@access       private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
