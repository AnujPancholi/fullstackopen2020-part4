"use strict";

const blogRouter = require('express').Router();
const BlogModel = require('../models/blogs.js');


blogRouter.get('/', (request, response) => {
  BlogModel
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
  const blog = new BlogModel(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})


module.exports = BlogModel;
