"use strict";

const app = require("./app.js");
const CONFIG = require('./utils/config.js');


//logger
const logger = require('./utils/logger.js');


app.listen(CONFIG.PORT, () => {
  logger.info(`Server running on port ${CONFIG.PORT}`);
})