const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId,
      db = require('../db/db.js');

var linkSchema = new Schema({
  id: ObjectId,
  github_id: {
    type: Number,
    required: true,
    trim: true
  },
  github_name: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    trim: true
  },
  views: {
    type: Number,
    trim: true
  }
});

const Link = db.model('Link', linkSchema);

module.exports = Link;
