"use strict";

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((__totalLikes,__blog) => __totalLikes+=__blog.likes,0);

const favoriteBlog = (blogs) => blogs.reduce((__favBlog,__blog) => !__favBlog || __blog.likes>__favBlog.likes ? __blog : __favBlog, null);

const mostBlogs = (blogs) => {
  const blogCountMap = new Map();
  return blogs.reduce((mostBlogsObj,blog) => {
    const authorCount = 1+(blogCountMap.get(blog.author) || 0);
    blogCountMap.set(blog.author,authorCount);
    if(authorCount>mostBlogsObj.count){
      mostBlogsObj.author = blog.author,
      mostBlogsObj.count = authorCount;
    }
    return mostBlogsObj;
  },{
    author: "",
    count: 0
  });
}

const mostLikes = (blogs) => {
  const likesCountMap = new Map();
  return blogs.reduce((mostLikesObj,blog) => {
    const authorLikes = blog.likes+(likesCountMap.get(blog.author) || 0);
    likesCountMap.set(blog.author,authorLikes);
    if(authorLikes>mostLikesObj.likes){
      mostLikesObj.author = blog.author;
      mostLikesObj.likes = authorLikes;
    }
    return mostLikesObj;
  },{
    author: "",
    likes: -1
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}