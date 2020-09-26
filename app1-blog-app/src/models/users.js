"use strict";

const Mongoose = require("mongoose");


const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  user_type: {
    type: String,
    enum: ["ADMIN","STD"],
    default: "STD"
  },
  auth: {
    hash: {
      type: String,
      required: true
    }
  }
})



const UserModel = new Mongoose.model('User',userSchema);

module.exports = UserModel;