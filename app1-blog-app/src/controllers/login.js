"use strict";


const loginRouter = require("express").Router();
const UserModel = require("../models/users.js");
const bcrypt = require("bcrypt");
const logger = require('../utils/logger.js');
const {
  getSignedToken
} = require("../utils/auth_helpers.js");

const decodeBase64String = (str) => {
  return Buffer.from(str,"base64").toString('utf8');
}

const getLoginDetailsFromRequest = (req) => {
  const loginDetailsObj = {
    username: null,
    password: null,
    error: null
  }
  
  if(req.headers.authorization) {
    const [authMethod, headervalue] = req.headers.authorization.split(' ');
    if(!authMethod || authMethod!=='Basic'){
      loginDetailsObj.error = "INVALID AUTH METHOD";
      return loginDetailsObj;
    } 
    const [username, password] = decodeBase64String(headervalue).split(":");
    if(!username || !password){
      loginDetailsObj.error = "MALFORMED AUTH HEADER";
      return loginDetailsObj;
    }

    loginDetailsObj.username = username;
    loginDetailsObj.password = password;
    return loginDetailsObj;
        
  } else {
    loginDetailsObj.error = "AUTH HEADER NOT FOUND";
    return loginDetailsObj;
  }
}

loginRouter.post('/',(req,res,next) => {
  (async() => {
    const resultObj = {
      success: false,
      resCode: 500,
      error: null,
      data: null
    }
    try{
      const loginDetails = getLoginDetailsFromRequest(req);
      if(loginDetails.error){
        resultObj.success = false;
        resultObj.resCode = 401;
        resultObj.error = {
          message: loginDetails.error
        }
        resultObj.data = null;
        throw new Error(loginDetails.error);
      }

      const userObj = await UserModel.findOne({
        username: loginDetails.username
      })

      if(!userObj){
        resultObj.success = false;
        resultObj.resCode = 404;
        resultObj.error = {
          message: "USER NOT FOUND"
        }
        resultObj.data = null;
        throw new Error("USER NOT FOUND");
      }

      if(await bcrypt.compare(loginDetails.password,userObj.auth.hash)){
        const token = getSignedToken({
          username: userObj.username,
          name: userObj.name,
          id: userObj.id.toString()
        });
        resultObj.success = true;
        resultObj.resCode = 200;
        resultObj.error = null;
        resultObj.data = {
          message: "LOGIN SUCCESSFUL",
          token: token
            
        }
      } else {
        resultObj.success = false;
        resultObj.resCode = 401;
        resultObj.error = {
          message: "INCORRECT PASSWORD"
        }
        resultObj.data = null;
      }

    }catch(e){
      if(!resultObj.error){
        resultObj.success = false;
        resultObj.data = null;
        resultObj.resCode = 500;
        resultObj.error = {
          message: "INTERNAL SERVER ERROR"
        }
      }
    }
    
    next(resultObj);

  })();
})


const requestProcessingResultHandler = (resultObj,req,res,next) => {
  if(resultObj.success){
    res.status(resultObj.resCode).send(resultObj.data);
  } else {
    logger.error(`login|ERROR|${resultObj.error}`);
    res.status(resultObj.resCode).send(resultObj.error);
  }
}

loginRouter.use(requestProcessingResultHandler);


module.exports = loginRouter;