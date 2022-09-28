const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const moment = require("moment");
const User = require('../models/User')

function addOSIcon(post) {
  if (post.allData.imagingOS == 'Windows' || post.allData.os == 'Windows') return "<i class='fa-brands fa-windows'></i>"
  if (post.allData.imagingOS == 'Mac' || post.allData.os == 'Mac') return "<i class='fa-brands fa-apple'></i>"
}

function updateView(post) {
  if (post.taskType == 'Validation') {
    if (post.allData) {
      post.caption += addOSIcon(post)
      //start with the icon, find all the failures
      let failures = Object.keys(post.allData).filter(key => key.includes("Fail"))
      if (failures.length > 0) {
        //replace 'Fail' in each
        failures = failures.map(x => x.replace('Fail','')  )
        post.caption += `\n<b class='text-danger'>Failed:</b> `
        failures.forEach(fail => {
          post.caption += `${fail} `
          post[`${fail}`] = true
        })
      }
      else {
        let verified = Object.keys(post.allData).filter(key => key.includes('val'))
        verified = verified.map(x => x.replace('val', ''))
        post.caption += `\n<b class='text-success'>Verified:</b> `
        verified.forEach(val => {
          post.caption +=`${val} `
          post.success = true
        })
      }
    }
  }
  else if (post.taskType == 'Imaging') {
    if (post.allData) {
      post.caption += addOSIcon(post)
      post.caption += " " + post.allData.imagingLocation + " " + post.allData.imagingType
    }
  }
  else if (post.taskType == 'Deploy') {
    if (post.allData) {
      console.log(post.allData.location)
      post.caption += "\n" + post.allData.location + " " + post.allData.action
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
      
      let daysBack = moment().subtract(7,'d')
      if (req.query.timespan) {
        console.log('days back: ' + req.query.timespan)
        daysBack = moment().subtract(req.query.timespan,'d')
        if (req.query.timespan == 0) { // All Time
          daysBack = moment('1987-10-28')
        }
        posts = posts.filter(post => moment(post.createdAt).isSameOrAfter(daysBack))
        console.log(posts.length)
      }

      if (req.query.tech) {
        if (req.query.tech != 0) posts = posts.filter(post => post.user == req.query.tech )
      }

      //stats logic
      let validationSummary = {total: 0, successful: 0}
      let imagingSummary = {mac: 0, windows: 0, onsite: 0, remote: 0}
      let deploySummary = {}
      posts.forEach(post => { 
        updateView(post)
        let failures = Object.keys(post.allData).filter(key => key.includes("Fail"))
        for (fail of failures) {
          console.log(fail)
          if (!validationSummary[`${fail}`]) validationSummary[`${fail}`] = 1
          else {validationSummary[`${fail}`] += 1}
          validationSummary.total++
        }

        if (post.success) {
          validationSummary.successful += 1
          validationSummary.total++
        }
              // validations - number of win/mac/failures by type/success
        if (post.allData.imagingLocation == 'Onsite') {
          imagingSummary.onsite += 1
        }
        else if (post.allData.imagingLocation == 'Remote') {
          imagingSummary.remote += 1
        }
              // imaging - number of win/mac/onsite/remote
        if (post.allData.imagingOS == 'Windows') {
          imagingSummary.windows += 1
        }
        else if (post.allData.imagingOS == 'Mac') {
          imagingSummary.mac += 1
        }
              // deploy - number of deploys/recoveries - building heatmap?
         
      })
      //get tech userName
      let techName = ''
      if (req.query.tech && req.query.tech != 0) {
        console.log(req.query.tech)
        const techData = await User.findById(req.query.tech).lean()
        techName = techData.userName || 'All Techs'
      }
      res.render("feed.ejs", { posts: posts, tech: techName, user: req.user, users: users, validations: validationSummary, images: imagingSummary, startDate: daysBack.format('MMMM DD yy'), endDate: moment().format('MMMM DD yy') });
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
        createdAt: moment(req.body.date),
        minutes: req.body.minutes,
        taskType: req.body.btnradio,
        image: imageUrl,
        allData: req.body,
        location: req.body.location,
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
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
