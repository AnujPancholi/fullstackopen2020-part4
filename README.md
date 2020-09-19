# Part 4

**Note:** For each part, I do not know beforehand how many different apps/projects I will have to make, and since there was no explicit warning telling me that I may have to deploy the code using this repository, I have decided to keep each distinct npm app in its own directory.


## Exercise 4.1

Copied the code as given in the exercise, structured it, installed the necessary packages, dev dependencies, etc. and got it working. Tested the one POST and one GET endpoint with Postman. It is connected to the same Atlas cluster as used in the last part but to a different database.

**NOTE:** When the exercise said "Turn the application into a functioning npm project", I assumed that I would have to structure it along the lines of what was shown in the course. Only later did I realize that structuring it was part of the second exercise. So I have inadvertenly completed 4.2 already.

## Exercise 4.2

I had inadvertently completed this in exercise 4.1, however, I have made some pretty significant changes to the request handlers of both the endpoints which I think requires some explaination.

Firstly, I switched it to async await. also, I learnt in Part 3 of the course that you could shift the error handling directly to a middleware. This got me thinking - any request would either do what it is supposed to successfully, or it would encounter some error, and in either case, it must respond. So, why not shift the entire responsibility of processing the result and responding accordingly to a middleware, be it some success result or an error result?

So, I initialized a `resultObj` at the beginning of each request handler, with 4 properties:

 - `success`: a flag denoting success or failure of as per the intended behaviour of the request
 - `error`: an object containing the error response, `null` if no error
 - `data`: an object containing the data to be sent in response (response body), `null` in case of error
 - `resCode`: the http status code to be used in the response

Other than this, the code itself should explain how it works. I know there can be holes and pitfalls with this approach, but I came up with it on the fly for the purpose of this exercise.

Apart from this, I have separated the `models` and `controllers` as per the MVC approach that this course is taking, set up a `dev` script which I ran to test this with Postman, and added a `lint` script as well using eslint.

**NOTE:** The course mentions "baby steps", each of which should be commits. If you wish to see these, there are about 10 or so commits before the actual submission commit, not all of them stable, which capture these. Will try to keep each commit stable from now on.

## Exercise 4.3

Added jest as a dev dependency, configured in `package.json` and `.eslintrc.js`, then added a directory `tests` in src. Then added the file `list_helper.js` in `utils`, added a function `dummy`, imported the same in the file `list_helpers.test.js` in the `tests` directory. Wrote a test in a `describe` block, and ran the same, via an npm test script, and it passed:

![TEST_1.png](supporting_screenshots/TEST_1.png)

**NOTE:** The code isn't exactly the same as that in the course but it behaves in the same manner.

## Exercise 4.4

Wrote a simple totalLikes function that calculates the total likes with a simple reduce. Then made some mock arrays of json to test said function, hardcoded into the test.

My approach for writing the actual test, instead of explicitly writing the test case for each array of json, I thought of somehow putting all the test cases in an array and then calling the `test` (which it seems is essentially a function) block for each of the test cases (DRY principle). So, I came up with a way of defining a test case such that all the things needed to run the test case, excluding the function to be tested itself, are contained in the test case.

I defined the test cases as an array of objects, where each object would represent a test case, and would have the following properties:

 - `description`: The description or test name that is associated with the test.
 - `params`: An array of the exact parameters that have to pe passed to the function. The params can be defined as an array becasue the array can just be spread using the spread operator and can be passed to any function we please.
 - `assert`: A function that takes the function to be tested as a parameter, and performs the assertion on it with the same `params` mentioned in the test case object.

 With the test cases designed in this format, I could just iterate over the test cases and devfine a `test` block for each.

 Few of the advantages of this approach that I can think of:

  - Each `test` block need not be defined individually.
  - Since the `assert` function takes the function to be tested ("target" function) as a parameter, we can change out the function if whenever we want without changing the test cases. In fact, we can have two competing functions that do the same thing and test them both with the same test cases. This makes for better reusablilty.
  - A test for anything has two essential parts - *how* something is tested and *what* it is tested with. Each test case represents *what* it's tested with, which changes from test case to test case, and the test block itself represents *how* it's tested, which remains constant for all test cases. This can make for better testing because we are testing a function with several different test cases in the *same manner*, without writing the test block repeatedly. **Note:** Of course how each `assert` function is implemented represents the *how* as well, and I did this becasue some test cases need to be asserted differently (`toBeClose`, `not.toBe`, etc), but is still makes for better separation of the *what* and the *how*.
   

## Exercise 4.5

Wrote another one-liner reduce to get the entire object with the most likes, and wrote a `describe` block to test it.

There are a few changes that I've made, those being that I wanted to run the tests on the same lists of blogposts which formed the test cases of the `totalLikes` function, and I wanted to do this in a way that I could define the mock test lists once and use them in both the `describe` blocks (again, DRY principle).

To achieve this, I separated the lists as a global array of arrays and used the same by explicitly specifying which array of blogs I want to use for a certain test, for both the describe blocks. This might help me in the exercises to come. 


## Exercise 4.6

I could've used lodash but decided not to, did it myself using a `Map` and a reduce function. For the tests, I had to change the names of the mock authors, so, made those changes (had to make the changes in the previous test as well due to this, but only in the data). All tests pass.


## Exercise 4.7

Used an almost identical function as the last one to calculate most likes, with some subtle differences, of course. Wrote tests for the same, and in the last few exercises is where I think the reusability of the tests really shines.


## Exercise 4.8

First, I realized I hadn't structured my code properly for the API to be testable, so I structured it in a way that the express app itself was imported by the main `index.js` file. Then I wrote the test and wrote a [custom assertion](https://github.com/visionmedia/supertest#expectfunctionres-). I explicitly returned a promise in the callback of the `test` block because I read in the [Jest docs](https://jestjs.io/docs/en/api#testname-fn-timeout) that if a promise is returned then the `test` block will wait for the execution to complete. I know that `async` functions implicitly wrap a promise so I could've just delclared the callback `async`, but I like to keep things a bit explicit when confusing matters of asynchronous programming in JS are concerned.


## Exercise 4.9

I had already added the transform function in the model that changed the identifier to `id` from `_id`, so I just used the `toBeDefined()` assertion in jest as suggested by the course to check if `id` is defined and that `_id` is *not* defined.


## Exercise 4.10

Added the test, in which the following assertions were added:

 - There should be an `id` in the response of the POST endpoint and it should be a string.
 - After fetching the blogs via the GET endpoint, the response of the GET endpoint should be an array.
 - There should be an object in this array which has an `id` that matches the `id` of the new doc (which is the newly entered doc fetched from the DB).
 - This object should have an `id` field.
 - That `id` field should match the `id` returned by the POST request, ensuring that it is the same document that was updated.
 


---