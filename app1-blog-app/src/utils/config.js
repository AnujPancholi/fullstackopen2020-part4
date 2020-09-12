"use strict";

const config = {
  PORT: process.env.PORT || 3002,
  DB_URI: process.env[`${process.env.NODE_ENV}_DB_URI`] || null
}

module.exports = config;