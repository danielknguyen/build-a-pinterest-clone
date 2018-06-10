const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId,
      db = require('../db/db.js');

var userSchema = new Schema({
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
  images: []
});

const User = db.model('User', userSchema);

module.exports = User;
