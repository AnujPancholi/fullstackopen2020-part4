"use strict";


const supertest = require("supertest");
const app = require("../app.js");
const Mongoose = require("mongoose");
const BlogModel = require("../models/blogs.js");


const API = supertest(app);


const TEST_BLOG_DATA = [
                
  {
    "title": "Mock Blog Title",
    "author": "Author 1",
    "url": "https://www.mockblog.com/123456",
    "likes": 23
  },
  {
    "title": "Mock Blog Title 2",
    "author": "Author 2",
    "url": "https://www.mockblog.com/1234567",
    "likes": 544
  },
  {
    "title": "Mock Blog Title 3",
    "author": "Author 1",
    "url": "https://www.mockblog.com/1234567",
    "likes": 8698
  },
  {
    "title": "Mock Blog Title 4",
    "author": "Author 1",
    "url": "https://www.mockblog.com/1234567",
    "likes": 0
  },
  {
    "title": "Mock Blog Title 5",
    "author": "Author 2",
    "url": "https://www.mockblog.com/1234567",
    "likes": 2
  }
            
];


beforeEach(() => {
  return new Promise((resolve,reject) => {

    (async() => {
      try{
        await BlogModel.deleteMany({});
        await Promise.all(TEST_BLOG_DATA.map(testBlogObj => {
          return (new BlogModel(testBlogObj)).save();
        }));
        resolve("TEST DB SET UP");
      }catch(e){
        reject(e);
      }
    })();
        
  })
},10000)


describe("TESTS FOR blogs ROUTE",() => {
  test("blogs GET should return array of blogs",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        await API.get("/api/blogs").expect((res) => {
          if(res.status!==200){
            throw new Error("INCORRECT STATUS CODE");
          }
          if(!Array.isArray(res.body) || res.body.length!==TEST_BLOG_DATA.length){
            throw new Error("INCORRECT NUMBER OF DOCUMENTS RECEIVED");
          }
        });
        resolve(true);
      })()

    })
  })

  test("blogs Identifier should be id",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const res = await API.get("/api/blogs");
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach(doc => {
          expect(doc.id).toBeDefined();
          expect(doc._id).not.toBeDefined();
        })
        resolve(true);
      })();
    })
  })


})


afterAll(() => {
  Mongoose.connection.close();
})