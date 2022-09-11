const moment = require("moment");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: moment()
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    default: ""
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  minutes: {
    type: Number,
  },
  taskType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
