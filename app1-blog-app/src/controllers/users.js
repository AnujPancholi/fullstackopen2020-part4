"use strict";

const userRouter = require("express").Router();
const UserModel = require("../models/users.js");
const logger = require('../utils/logger.js');
// const mongooseUtils = require("../utils/mongooseUtils.js");
const bcrypt = require('bcrypt');


const validateUserCreation = (req,res,next) => {
  const USER_CREATION_PARAMS = {
    MIN_PASS_LENGTH: 3,
    PASS_SALTING_ROUNDS: 10,
    MIN_USERNAME_LENGTHL: 3,
  }

  req.USER_CREATION_PARAMS = USER_CREATION_PARAMS;
  next();
}


userRouter.post('/',validateUserCreation,(req,res,next) => {

  (async() => {
    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    try {
      const userObj = {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        user_type: req.body.user_type || "STD"
      }

      if(!userObj.username || userObj.username.length<req.USER_CREATION_PARAMS.MIN_USERNAME_LENGTH){
        resultObj.success = false;
        resultObj.data = null;
        resultObj.resCode = 400;
        resultObj.error = {
          "message": "INVALID USERNAME"
        }
      }

      if(!userObj.name || userObj.name.length<req.USER_CREATION_PARAMS.MIN_USERNAME_LENGTH){
        resultObj.success = false;
        resultObj.data = null;
        resultObj.resCode = 400;
        resultObj.error = {
          "message": "INVALID NAME"
        }
      }


      if(!userObj.password || userObj.password.length<req.USER_CREATION_PARAMS.MIN_PASS_LENGTH){
        resultObj.success = false;
        resultObj.data = null;
        resultObj.resCode = 400;
        resultObj.error = {
          "message": "INVALID PASSWORD"
        }
      }

      const hashedPass = await bcrypt.hash(userObj.password,req.PASS_SALTING_ROUNDS);

      userObj.auth = {
        hash: hashedPass
      }
      delete userObj.password;

      const userEntry = new UserModel(userObj);

      const userEntryResult = userEntry.save();

      resultObj.success = true;
      resultObj.data = {
        message: "USER CREATED",
        id: userEntryResult._id.toString()
      }
      resultObj.error = null;
      resultObj.resCode = 200;


    } catch(e) {
      resultObj.success = false;
      resultObj.data = null;
      resultObj.error = {
        message: e.message || "INTERNAL SERVER ERROR"
      }
      resultObj.resCode = 500;
    }

    next(resultObj);

  })();

})

const requestProcessingResultHandler = (resultObj,req,res,next) => {
  if(resultObj.success){
    res.status(resultObj.resCode).send(resultObj.data);
  } else {
    logger.error(`user|ERROR|${resultObj.error}`);
    res.status(resultObj.resCode).send(resultObj.error);
  }
}

userRouter.use(requestProcessingResultHandler);

module.exports = (userRouter);