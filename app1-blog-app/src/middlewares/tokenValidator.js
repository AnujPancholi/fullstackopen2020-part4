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


// middleware to take and decode token, store the result in req.user
const tokenValidator = (req,res,next) => {
  
  req.user = null;

  if(EXEMPT_PATHS.indexOf(req.originalUrl)===-1 && req.headers.authorization){
    const [method,token] = req.headers.authorization.split(' ');
    if(ACCEPTED_AUTH_METHODS.indexOf(method)>-1 && token){
      const decodedUserData = getDecodedToken(token);
      req.user = decodedUserData;
    }
  }

  if(!req.user){
    return res.status(401).send({
      message: "FORBIDDEN"
    })
  }

  next();

  
}


module.exports = tokenValidator;