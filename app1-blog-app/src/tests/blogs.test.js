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


const TEST_UPDATE_BLOGS = [{
  "title": "Mock Insert 1",
  "author": "Mock Author",
  "url": "https://www.mockblog.com/123456700000",
  "likes": 0
},{
  "title": "Mock Insert 2",
  "author": "Mock Author 2",
  "url": "https://www.mockblog.com/12345670000"
}]


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

  test("blogs POST should successfully update document",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const blogUpdateDoc = TEST_UPDATE_BLOGS[0];
        const res = await API.post("/api/blogs").send(blogUpdateDoc);
        expect(typeof(res.body.id)).toBe('string');

        const blogsRes = await API.get("/api/blogs");
        expect(Array.isArray(blogsRes.body)).toBe(true);
        expect(blogsRes.body.length).toBe(TEST_BLOG_DATA.length+1);
        const freshBlog = blogsRes.body.find(blog => blog.id===res.body.id);
        expect(freshBlog).toBeDefined();
        expect(freshBlog.id).toBeDefined();
        expect(freshBlog.id===res.body.id);
        resolve(true);
      })()
    });
  })

  test("blogs POST should set default value for likes to 0 if not given likes",() => {
    return new Promise((resolve,reject) => {
      (async() => {

        const blogToAdd = TEST_UPDATE_BLOGS[1];
        const blogAddResult = await API.post("/api/blogs").send(blogToAdd);
        expect(typeof(blogAddResult.body.id)).toBe("string");
        
        const blogsFetchResult = await API.get('/api/blogs');
        expect(Array.isArray(blogsFetchResult.body)).toBe(true);

        const freshBlog = blogsFetchResult.body.find(blog => blog.id===blogAddResult.body.id);
        expect(freshBlog).toBeDefined();
        expect(freshBlog.likes).toBeDefined();
        expect(freshBlog.likes).toBe(0);

        resolve(true);

      })();
    })
  })

})


afterAll(() => {
  Mongoose.connection.close();
})