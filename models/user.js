const mongoose = require("mongoose");
// import { Timestamp } from '../node_modules/bson/src/timestamp';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;