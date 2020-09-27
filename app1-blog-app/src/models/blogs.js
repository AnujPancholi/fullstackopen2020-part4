"use strict";

const Mongoose = require('mongoose');


const blogSchema = new Mongoose.Schema({
  title: {
    type: String
  },
  author: {
    type: String
  },
  userId: {
    type: Mongoose.Types.ObjectId
  },
  url: {
    type: String
  },
  likes: {
    type: Number
  }
});

blogSchema.set('toJSON',{
  transform: (doc,obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  }
})


const BlogModel = Mongoose.model('Blog',blogSchema);
  
module.exports = BlogModel;