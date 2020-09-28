"use strict";

//env and db connection as early as possible
require("dotenv").config();
const CONFIG = require('./utils/config.js');
const Mongoose = require('mongoose');

//logger
const logger = require('./utils/logger.js');

//db connection
Mongoose.connect(CONFIG.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).catch(error => {
  logger.error(`FATAL: DB CONNECTION ERROR: ${error}`);
  process.exit(1);
})


//express and related dependencies
const express = require('express');
const app = express();
const cors = require('cors');

//controllers (routes)
const blogRouter = require('./controllers/blogs.js');
const userRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");

//middlewares

app.use(cors());
app.use(express.json());



app.use("/api/login",loginRouter);
app.use("/api/users",userRouter);
app.use('/api/blogs',blogRouter);

module.exports = app;