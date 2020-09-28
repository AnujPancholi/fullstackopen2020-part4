"user strict";

const {
  getDecodedToken
} = require("../utils/auth_helpers.js");
const logger = require("../utils/logger.js");

const EXEMPT_PATHS = [
  "/api/login"
];

const ACCEPTED_AUTH_METHODS = [
  "Bearer"
]

const tokenValidator = (req,res,next) => {
  
  req.user = null;

  if(EXEMPT_PATHS.indexOf(req.originalUrl)===-1 && req.headers.authorization){
    const [method,token] = req.headers.authorization.split(' ');
    if(ACCEPTED_AUTH_METHODS.indexOf(method)>-1 && token){
      const decodedUserData = getDecodedToken(token);
      req.user = decodedUserData;
    }
  }

  next();
}


module.exports = tokenValidator;