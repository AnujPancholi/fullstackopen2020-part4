"use strict";

const config = {
  PORT: process.env.PORT || 3002,
  DB_URI: process.env[`${process.env.NODE_ENV}_DB_URI`] || null,
  JWT_SECRET: process.env[`${process.env.NODE_ENV}_JWT_SECRET`] || null
}

module.exports = config;