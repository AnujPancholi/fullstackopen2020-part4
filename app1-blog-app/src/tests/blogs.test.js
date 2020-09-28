"use strict";


const supertest = require("supertest");
const app = require("../app.js");
const Mongoose = require("mongoose");
const mongooseUtils = require("../utils/mongooseUtils.js");
const BlogModel = require("../models/blogs.js");
const UserModel = require("../models/users.js");
const bcrypt = require("bcrypt");
const {
  getSignedToken
} = require("../utils/auth_helpers.js");
const { JWT_SECRET } = require("../utils/config.js");


const API = supertest(app);


const PASS_SALTING_ROUNDS = 10;

const addHashToTestUserObj = (userObj) => {
    
  return new Promise((resolve,reject) => {
    (async() => {
      const hash = await bcrypt.hash(userObj.auth.password,PASS_SALTING_ROUNDS);
      userObj.auth.hash = hash;
      delete userObj.password;
      resolve(true);
    })();
  })
    
}

const MOCK_USER_DATA = [{
  "username": "user 1",
  "name": "Author 1",
  "user_type": "ADMIN",
  "auth": {
    "password": "pass1"
  }
},{
  "username": "user 2",
  "name": "Author 2",
  "user_type": "STD",
  "auth": {
    "password": "pass2"    
  }
}]


const TEST_BLOG_DATA = [
                
  {
    "title": "Mock Blog Title",
    "author": "Author 1",
    "userIndex": 0,
    "url": "https://www.mockblog.com/123456",
    "likes": 23
  },
  {
    "title": "Mock Blog Title 2",
    "author": "Author 2",
    "userIndex": 1,
    "url": "https://www.mockblog.com/1234567",
    "likes": 544
  },
  {
    "title": "Mock Blog Title 3",
    "author": "Author 1",
    "userIndex": 0,
    "url": "https://www.mockblog.com/1234567",
    "likes": 8698
  },
  {
    "title": "Mock Blog Title 4",
    "author": "Author 1",
    "userIndex": 0,
    "url": "https://www.mockblog.com/1234567",
    "likes": 0
  },
  {
    "title": "Mock Blog Title 5",
    "author": "Author 2",
    "userIndex": 1,
    "url": "https://www.mockblog.com/1234567",
    "likes": 2
  }
            
];


const TEST_UPDATE_BLOGS = [{
  "userIndex": 0,
  "title": "Mock Insert 1",
  "author": "Mock Author",
  "url": "https://www.mockblog.com/123456700000",
  "likes": 0
},{
  "userIndex": 1,
  "title": "Mock Insert 2",
  "author": "Mock Author 2",
  "url": "https://www.mockblog.com/12345670000"
},{
  "userIndex": 0,
  "author": "Useless Author",
  "likes": 232
}]


const TEST_DELETE_BLOGS = [{
  "title": "Mock Blog Title 4",
  "userIndex": 0
}]


beforeEach(() => {
  return new Promise((resolve,reject) => {

    (async() => {
      try{
        await UserModel.deleteMany({});
        await Promise.all(MOCK_USER_DATA.map(userData => addHashToTestUserObj(userData)));
        const userSetupResult = await Promise.all(MOCK_USER_DATA.map(testUserObj => {
          return (new UserModel(testUserObj)).save();
        }));

        const userTokens = MOCK_USER_DATA.map((mockObj,index) => {
          return {
            token: getSignedToken({
              username: mockObj.username,
              name: mockObj.name,
              id: userSetupResult[index]._id.toString()
            })
          }
        })

        TEST_DELETE_BLOGS.forEach((mockBlog) => {
          mockBlog.token = userTokens[mockBlog.userIndex].token
        })

        TEST_UPDATE_BLOGS.forEach((mockBlog) => {
          mockBlog.token = userTokens[mockBlog.userIndex].token;
        })

        await BlogModel.deleteMany({});
        await Promise.all(TEST_BLOG_DATA.map((testBlogObj, index) => {
          testBlogObj.userId = mongooseUtils.getObjectId(userSetupResult[testBlogObj["userIndex"]]._id);
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
        const res = await API.post("/api/blogs").set("Authorization",`Bearer ${blogUpdateDoc.token}`).send(blogUpdateDoc);
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
        const blogAddResult = await API.post("/api/blogs").set("Authorization",`Bearer ${blogToAdd.token}`).send(blogToAdd);
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

  test("blogs POST should return error code 400 if some mandatory param missing",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const blogToAdd = TEST_UPDATE_BLOGS[2];

        const blogAddResult = await API.post("/api/blogs").set("Authorization",`Bearer ${blogToAdd.token}`).send(blogToAdd);
        expect(blogAddResult.status).toBe(400);

        resolve(true);

      })()
    })
  })

  test("blogs POST should return error code 401 if no token passed",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const blogToAdd = TEST_UPDATE_BLOGS[2];

        const blogAddResult = await API.post("/api/blogs").send(blogToAdd);
        expect(blogAddResult.status).toBe(401);

        resolve(true);

      })()
    })
  })

  test("blogs DELETE should delete a document",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const blogsResponse = await API.get('/api/blogs');
        expect(Array.isArray(blogsResponse.body)).toBe(true);
        // const [blogDocument] = blogsResponse.body;
        const blogDeleteDetails = TEST_DELETE_BLOGS[0];
        const blogDocument = blogsResponse.body.find(blogDoc => blogDoc.title===blogDeleteDetails.title);
        expect(blogDocument).toBeDefined();
        expect(blogDocument.id).toBeDefined();
        expect(blogDocument.title).toBeDefined();



        const deleteResult = await API.delete(`/api/blogs/${blogDocument.id}`).set("Authorization",`Bearer ${blogDeleteDetails.token}`);
        const {
          deleted_record: deletedDocFromDb
        } = deleteResult.body;
        expect(deletedDocFromDb).toBeDefined();
        expect(deletedDocFromDb.id).toBeDefined();
        expect(deletedDocFromDb.id.toString()).toBe(blogDocument.id);
        expect(deletedDocFromDb.title).toBe(blogDocument.title);

        resolve(true); 

      })()
    })    
  })

  test("blogs DELETE should return 404 for unknown id",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const dummyId = `asdfghhjkisjuenhfuysebuf`;
        const blogDeleteDetails = TEST_DELETE_BLOGS[0];
        const deleteResult = await API.delete(`/api/blogs/${dummyId}`).set("Authorization",`Bearer ${blogDeleteDetails.token}`);

        expect(deleteResult.status).toBe(404);

        resolve(true);
      })()
    })
  })

  test("blogs PUT should update likes in document",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const titleToUpdate = "updated title";
        const blogsFetchResult = await API.get('/api/blogs');
        expect(Array.isArray(blogsFetchResult.body)).toBe(true);
        const [blogToUpdate] = blogsFetchResult.body;
        expect(blogToUpdate).toBeDefined();
        expect(blogToUpdate.id).toBeDefined();
        const updateResult = await API.put(`/api/blogs/${blogToUpdate.id}`).send({
          title: titleToUpdate
        });
        
        expect(updateResult.status).toBe(200);
        const {
          updated_record: updatedDocument
        } = updateResult.body;

        expect(updatedDocument.id).toBe(blogToUpdate.id);
        expect(updatedDocument.title).toBe(titleToUpdate);

        resolve(true);

      })()
    })
  })

  test("blogs PUT should return 404 for unknown id",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const unknownId = "jfutnvunfuhfuhduifkjrudy";

        const updateResult = await API.put(`/api/blogs/${unknownId}`);
        expect(updateResult.status).toBe(404);

        resolve(true);

      })()
    })
  })


})


afterAll(() => {
  Mongoose.connection.close();
})