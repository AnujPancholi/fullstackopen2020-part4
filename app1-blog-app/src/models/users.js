"use strict";

const Mongoose = require("mongoose");


const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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

userSchema.set('toJSON',{
  transform: (doc,obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  }
})



const UserModel = new Mongoose.model('User',userSchema);

module.exports = UserModel;