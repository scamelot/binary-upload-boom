const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const moment = require("moment");
const User = require('../models/User')

function addOSIcon(post) {
  if (post.allData.os == 'Windows') return "<i class='fa-brands fa-windows'></i>"
  if (post.allData.os == 'Mac') return "<i class='fa-brands fa-apple'></i>"
}

function updateView(post) {
  if (post.taskType == 'Validation') {
    if (post.allData) {
      post.caption += addOSIcon(post)
      let failures = Object.keys(post.allData).filter(key => key.includes("Fail"))
      if (failures.length > 0) {
        failures = failures.map(x => x.replace('Fail','')  )
        post.caption += `\n<b class='text-danger'>Failed:</b> `
        failures.forEach(fail => {
          post.caption += `${fail} `
        })
      }
      else {
        let verified = Object.keys(post.allData).filter(key => key.includes('val'))
        verified = verified.map(x => x.replace('val', ''))
        post.caption += `\n<b class='text-success'>Verified:</b> `
        verified.forEach(val => {
          post.caption +=`${val} `
        })
      }
    }
  }
  else if (post.taskType == 'Imaging') {
    if (post.allData) {
      post.caption += addOSIcon(post)
      post.caption += " " + post.allData.imagingType
    }
  }
  else if (post.taskType == 'Deploy') {
    if (post.allData) {
      post.caption += "\n" + post.allData.location + " " + addOSIcon(post)
    }
  }
  return post
}



module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).sort({createdAt: "desc"}).lean();
      let totalTime = 0
      posts.forEach(post => {
        totalTime += post.minutes
        updateView(post)
      })
      res.render("profile.ejs", { posts: posts, user: req.user, totalTime: totalTime });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      let posts = await Post.find({}).sort({ createdAt: "desc" }).lean();
      let users = await User.find({}).lean();
      if (req.query.task) {
        const taskType = req.params.task.charAt(0).toUpperCase() + req.params.task.slice(1)
        posts = posts.filter(post => post.taskType == taskType)
      }
      if (req.query.timespan) {
        console.log('days back: ' + req.query.timespan)
        let daysBack = moment().subtract(req.query.timespan,'d')
        if (req.query.timespan == 0) { // All Time
          daysBack = moment('1987-10-28')
        }
        posts = posts.filter(post => moment(post.createdAt).isSameOrAfter(daysBack))
        console.log(posts.length)
      }
      posts.forEach(post => { 
        updateView(post) 
      })
      if (req.query.tech) {
        if (req.query.tech != 0) posts = posts.filter(post => post.user == req.query.tech )
      }
      res.render("feed.ejs", { posts: posts, user: req.user, users: users });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //TODO - Beautify the single post page...do we do that in the view???
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
