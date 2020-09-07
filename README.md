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


---