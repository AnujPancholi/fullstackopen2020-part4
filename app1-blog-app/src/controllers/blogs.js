"use strict";

const blogRouter = require('express').Router();
const BlogModel = require('../models/blogs.js');
const UserModel = require('../models/users.js');
const logger = require('../utils/logger.js');
const mongooseUtils = require("../utils/mongooseUtils.js");


const getUserIdForNewBlog = (userId = null) => {
  return new Promise((resolve,reject) => {
    (async() => {
      try{
        const userQuery = {};
        if(typeof userId === "string"){
          userQuery._id = mongooseUtils.getObjectId(userId);
        }
        const userEntry = await UserModel.findOne(userQuery,{
          _id: 1
        }).exec();
        
        resolve(userEntry && userEntry._id ? userEntry._id : null);
        
      }catch(e){
        reject(e);
      }
    })();
  })
} 


blogRouter.get('/', (request, response, next) => {
  (async() => {
    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    try{
      // const allBlogsResult = await BlogModel.find({});

      const allBlogsResult = await BlogModel.aggregate([{
        $match: {
        }
      },{
        $lookup: {
          "from": "users",
          "let": {
            "userId": "$userId"
          },
          "pipeline": [{
            $match: {
              $expr: {
                $eq: ["$_id","$$userId"]
              }
            }
          },{
            $project: {
              "username": "$username",
              "name": "$name"
            }
          }],
          "as": "user"
        }
      },{
        $unwind: {
          path: "$user"
        }
      }]);

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

      const userIdForBlog = await getUserIdForNewBlog(request.body.userId || null);
      if(!userIdForBlog){
        throw new Error("USER NOT FOUND FOR BLOG");
      }
      request.body.userId = userIdForBlog;

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


blogRouter.delete("/:id",(req,res,next) => {

  (async() => {

    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    try{
      const removalResult = await BlogModel.findOneAndRemove({
        _id: mongooseUtils.getObjectId(req.params.id)
      })

      // console.log(`DELETE RESULT:`,removalResult);

      if(removalResult===null){
        resultObj.resCode = 404;
        throw new Error("NO RECORD FOUND");
      }

      resultObj.success = true;
      resultObj.error = null;
      resultObj.data = {
        message: "SUCCESSFULLY DELETED",
        deleted_record: removalResult
      };
      resultObj.resCode = 200;
    }catch(e){
      resultObj.success = false;
      resultObj.error = {
        message: e.message || "INTERNAL SERVER ERROR"
      }
      resultObj.resCode = resultObj.resCode>399 ? resultObj.resCode : 500;
      resultObj.data = null;
    }

    next(resultObj);

  })();

})

blogRouter.put('/:id',(req,res,next) => {
  (async() => {

    const resultObj = {
      success: false,
      error: null,
      data: null,
      resCode: 500
    }

    try{
      const updateObject = req.body;
      const updatedDocument = await BlogModel.findOneAndUpdate({
        _id: mongooseUtils.getObjectId(req.params.id)
      },
      updateObject,
      {
        new: true
      });
      if(updatedDocument===null){
        resultObj.resCode = 404;
        throw new Error("NO RECORD FOUND");
      }
      resultObj.success = true;
      resultObj.error = null;
      resultObj.data = {
        message: "SUCCESSFULLY UPDATED",
        updated_record: updatedDocument
      }
      resultObj.resCode = 200;

    }catch(e){
      resultObj.success = false;
      resultObj.error = {
        message: e.message || "INTERNAL SERVER ERROR"
      }
      resultObj.resCode = resultObj.resCode>399 ? resultObj.resCode : 500;
      resultObj.data = null;
    }

    next(resultObj);
    
  })()
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
