"use strict";

//env and db connection as early as possible
require("dotenv").config();
const CONFIG = require('./utils/config.js');
const Mongoose = require('mongoose');

//db connection
Mongoose.connect(CONFIG.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

//logger
const logger = require('./utils/logger.js');

//express and related dependencies
const express = require('express');
const app = express();
const cors = require('cors');

//models
const BlogModel = require('./models/blogs.js');

//middlewares
app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
    BlogModel
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new BlogModel(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})


app.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${PORT}`)
})