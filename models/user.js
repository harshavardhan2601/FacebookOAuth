const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  facebook:Number,
  name:String,
  email: String,
  password:String,
  file_attach1:String,
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('User', UserSchema);