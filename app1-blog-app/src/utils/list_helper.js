"use strict";

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((__totalLikes,__blog) => __totalLikes+=__blog.likes,0);

const favoriteBlog = (blogs) => blogs.reduce((__favBlog,__blog) => __favBlog && __blog.likes>__favBlog.likes ? __blog : __favBlog, null);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}