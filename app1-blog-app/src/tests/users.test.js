"use strict";


const supertest = require("supertest");
const app = require("../app.js");
const Mongoose = require("mongoose");
const UserModel = require("../models/users.js");

const bcrypt = require("bcrypt");


const API = supertest(app);


const PASS_SALTING_ROUNDS = 10;

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

const MOCK_INVALID_USER_UPDATE_OBJECTS = [{

},{
  "username": "Bl",
  "name": "Author Unknown",
  "password": "blog123"
},{
  "username": "User 8",
  "name": "Author Unknown",
},{
  "username": "User 9",
  "name": "Author Unknown",
  "password": "bl"
},{
  "username": "user 2",
  "name": "Author Unknown",
  "password": "bloggy123"
}]

const MOCK_USER_UPDATE_OBJECTS = [{
  "username": "user 3",
  "name": "Author 3",
  "password": "blog123"
}]

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

beforeEach(() => {
  return new Promise((resolve,reject) => {
    (async() => {
      try{
        await UserModel.deleteMany({});
        await Promise.all(MOCK_USER_DATA.map(userData => addHashToTestUserObj(userData)));
        await Promise.all(MOCK_USER_DATA.map(testUserObj => {
          return (new UserModel(testUserObj)).save();
        }));
        resolve("TEST DB SET UP");
      }catch(e){
        reject(e);
      }
    })();  
  })
},10000)

describe("TESTS FOR users GET route",() => {
  test("users GET should return list of users",() => {

    return new Promise((resolve,reject) => {
      (async() => {
        const results = await API.get('/api/users');
        expect(results.status).toBe(200);
        expect(Array.isArray(results.body)).toBe(true);
        expect(results.body.length).toBe(MOCK_USER_DATA.length);

        resolve(true);
      })();
    })

  })
})

describe("TESTS FOR users POST route",() => {
  test("users POST should return 400 in case of no parameters",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post('/api/users').send(MOCK_INVALID_USER_UPDATE_OBJECTS[0]);
        expect(postResult.status).toBe(400);
        resolve(true);
      })();
    })
  })

  test("users POST should return 400 in case of short username",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post('/api/users').send(MOCK_INVALID_USER_UPDATE_OBJECTS[1]);
        expect(postResult.status).toBe(400);
        resolve(true);
      })();
    })
  })

  test("users POST should return 400 in case of no password",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post('/api/users').send(MOCK_INVALID_USER_UPDATE_OBJECTS[2]);
        expect(postResult.status).toBe(400);
        resolve(true);
      })();
    })
  })

  test("users POST should return 400 in case of short password",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post("/api/users").send(MOCK_INVALID_USER_UPDATE_OBJECTS[3]);
        expect(postResult.status).toBe(400);
        resolve(true);
      })();
    })
  })

  test("users POST should return duplicate key error in case of existing username",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post('/api/users').send(MOCK_INVALID_USER_UPDATE_OBJECTS[4]);
        expect(postResult.status).toBe(500);
        expect(typeof postResult.body.message).toBe("string");
        expect(postResult.body.message.indexOf("duplicate key error")>-1).toBe(true);
        resolve(true);
      })();
    })
  })

  test("users POST should return 200 with id in case of successful creation",() => {
    return new Promise((resolve,reject) => {
      (async() => {
        const postResult = await API.post("/api/users").send(MOCK_USER_UPDATE_OBJECTS[0]);
        expect(postResult.status).toBe(200);
        expect(typeof postResult.body.id).toBe("string");
        resolve(true);
      })();
    })
  })

})


afterAll(() => {
  Mongoose.connection.close();
})