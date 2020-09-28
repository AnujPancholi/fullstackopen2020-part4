"use strict";

const { JWT_SECRET } = require('../utils/config.js');
const jwt = require("jsonwebtoken");



const getSignedToken = (data) => {
  return jwt.sign(data, JWT_SECRET);
}

const getDecodedToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  getSignedToken,
  getDecodedToken
}