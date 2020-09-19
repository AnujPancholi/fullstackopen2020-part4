"use strict";

const blogRouter = require('express').Router();
const BlogModel = require('../models/blogs.js');
const logger = require('../utils/logger.js');


blogRouter.get('/', (request, response, next) => {
  (async() => {
    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    try{
      const allBlogsResult = await BlogModel.find({});
      resultObj.success = true;
      resultObj.data = allBlogsResult;
      resultObj.error = null;
      resultObj.resCode = 200;

    }catch(e){
      resultObj.success = false;
      resultObj.error = {
        message: e.message || "INTERNAL SERVER ERROR"
      };
      resultObj.data = null;
      resultObj.resCode = 500;
    }

    next(resultObj);
    
  })();
})

blogRouter.post('/', (request, response, next) => {
  (async() => {
    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    const MANDATORY_PARAMS = ["title","author","url"];

    try{

      const missingParams = MANDATORY_PARAMS.filter(param => !Object.prototype.hasOwnProperty.call(request.body,param));
      if(missingParams.length){
        resultObj.resCode = 400;
        throw new Error(`MANDATORY PARAMS ${missingParams.join(', ')} MISSING`)
      }

      if(!Object.prototype.hasOwnProperty.call(request.body,"likes") || typeof(request.body.likes)!=="number"){
        request.body.likes = 0;
      }

      const blogEntry = new BlogModel(request.body);

      const blogSaveResult = await blogEntry.save();

      resultObj.success = true;
      resultObj.error = null;
      resultObj.data = {
        message: "BLOG SAVED",
        id: blogSaveResult._id.toString()
      }
      resultObj.resCode = 200;

    }catch(e){
      resultObj.success = false;
      resultObj.error = {
        message: e.message || "INTERNAL SERVER ERROR"
      }
      resultObj.resCode = resultObj.resCode<400 ? 500 : resultObj.resCode;
      resultObj.data = null;
    }

    next(resultObj);

  })();
})

const requestProcessingResultHandler = (resultObj,req,res,next) => {
  if(resultObj.success){
    res.status(resultObj.resCode).send(resultObj.data);
  } else {
    logger.error(`blog|ERROR|${resultObj.error}`);
    res.status(resultObj.resCode).send(resultObj.error);
  }
}

blogRouter.use(requestProcessingResultHandler);


module.exports = blogRouter;
