const listHelpers = require("../utils/list_helper.js");


describe("Tests for dummy helper function",() => {

  test("Dummy helper function should return 1",() => {
    expect(listHelpers.dummy([])).toBe(1);
  })
})


const TEST_BLOG_LISTS = [
  [
                
    {
      "title": "Mock Blog Title",
      "author": "Random Author",
      "url": "https://www.mockblog.com/123456",
      "likes": 0,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 0,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    }
          
  ],
  [
    {
      "title": "Mock Blog Title",
      "author": "Random Author",
      "url": "https://www.mockblog.com/123456",
      "likes": 1,
      "id": "5f54c79917c0c7d1c608fca1"
    }
  ],
  [
                
    {
      "title": "Mock Blog Title",
      "author": "Random Author",
      "url": "https://www.mockblog.com/123456",
      "likes": 23,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 544,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 8698,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 4",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 0,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 5",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 2,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    }
            
  ],
  [
              
    {
      "title": "Mock Blog Title",
      "author": "Random Author",
      "url": "https://www.mockblog.com/123456",
      "likes": 23,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",

      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 8698,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 0,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 5",
      "author": "Random Author",
      "url": "https://www.mockblog.com/1234567",
      "likes": 2,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    }
              
  ]
  

] 

describe("Tests for totalLikes helper function",() => {

  const TEST_CASES = [{
    description: "totalLikes should return 0",
    params: [
      TEST_BLOG_LISTS[0]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(0);
    }
  },{
    description: "totalLikes should return 1",
    params: [
      TEST_BLOG_LISTS[1]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(1);
    }
  },{
    description: "totalLikes should return sum of several blogpost likes",
    params: [
      TEST_BLOG_LISTS[2]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(9267);
    }
  },{
    description: "totalLikes should return sum of several blogpost likes",
    params: [
      TEST_BLOG_LISTS[3]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(NaN);
    }
  }]
    
  TEST_CASES.forEach((testCase) => {
    test(testCase.description,() => {
      testCase.assert(listHelpers.totalLikes);
    })
  })
})