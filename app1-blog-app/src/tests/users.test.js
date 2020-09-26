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

describe("TESTS FOR users GET routes",() => {
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


afterAll(() => {
  Mongoose.connection.close();
})