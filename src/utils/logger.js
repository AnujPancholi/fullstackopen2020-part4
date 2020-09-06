"use strict";

const loggerUtil = {
  "info": (_message) => {
    console.log(_message)
  },
  "error": (_message) => {
    console.error(_message);
  }
}

module.exports = loggerUtil;