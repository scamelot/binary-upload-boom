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
  allData: {
    type: Object,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  location: {
    type: String,
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
  state: {
    type: String,
    default: "Complete"
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
