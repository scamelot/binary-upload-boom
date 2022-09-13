const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const moment = require("moment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).sort({createdAt: "desc"});
      let totalTime = 0
      posts.forEach(post => {
        totalTime += post.minutes
      })
      res.render("profile.ejs", { posts: posts, user: req.user, totalTime: totalTime });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      let posts = await Post.find().sort({ createdAt: "desc" }).lean();
      if (req.params.task) {
        const taskType = req.params.task.charAt(0).toUpperCase() + req.params.task.slice(1)
        posts = await Post.find({taskType: taskType}).sort({ createdAt: "desc" }).lean();
      }
      res.render("feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      let imageUrl = ''
      let imageId = ''

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url
        imageId = result.public_id  
      }

      if (req.body.os) {

      }

      await Post.create({
        title: req.body.title,
        date: moment(),
        minutes: req.body.minutes,
        taskType: req.body.btnradio,
        image: imageUrl,
        allData: req.body,
        cloudinaryId: imageId,
        caption: req.body.caption,
        likes: 0,
        state: req.body.state,
        user: req.user.id,
      });

      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`); 
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (post.cloudinaryId) {
        await cloudinary.uploader.destroy(post.cloudinaryId);
      }
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
