const express = require("express");

const router = express.Router();
const ObjectId = require("mongoose");
const passport = require("passport");

//load post model
const Post = require("../../models/Post");

//load profile model
const Profile = require("../../models/Profile");

//load post validation
const validatePostInput = require("../../validation/post");

//@route        POST  api/posts
//@description  Create post
//@access       Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route        GET  api/posts
//@description  Get posts
//@access       public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound: "No posts found." }));
});

//@route        GET  api/post/:id
//@description  Get post by id
//@access       public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID." })
    );
});

//@route        DELETE  api/post/:id
//@description  Delete post
//@access       private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("hitting delete api with : " + req.params.id);
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notauthorized: "User not authorized" });
          }
          //delete post
          Post.deleteOne({ _id: req.params.id }).then(() =>
            res.json({ success: true })
          );
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route        POST  api/post/like/:id
//@description  like post
//@access       private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            console.log("Already like");
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }
          //add user id to likes
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
    });
  }
);

//@route        POST  api/post/unlike/:id
//@description  unlike post
//@access       private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have no liked this post" });
          }
          //get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //splice element out
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route        POST  api/post/comment/:id
//@description  Add comment to post
//@access       private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      const { errors, isValid } = validatePostInput(req.body);
      //check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const newComment = {
        text: req.body.text,
        name: req.bpdy.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route        DELETE  api/post/comment/:id/:comment:id
//@description  remove comment from post
//@access       private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comment.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
