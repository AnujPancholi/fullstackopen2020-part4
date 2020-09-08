"use strict";

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((__totalLikes,__blog) => __totalLikes+=__blog.likes,0);

module.exports = {
  dummy,
  totalLikes
}