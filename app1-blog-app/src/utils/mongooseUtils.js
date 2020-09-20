"use strict";


const Mongoose = require("mongoose");

const mongooseUtils = {
  getObjectId: (id) => {
    try{
      return Mongoose.Types.ObjectId(id);
    }catch(e){
      return null;
    }
  }
}


module.exports = mongooseUtils;