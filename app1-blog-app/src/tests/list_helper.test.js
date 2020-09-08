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
      "author": "Author 1",
      "url": "https://www.mockblog.com/123456",
      "likes": 0,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Author 2",
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
      "author": "Author 1",
      "url": "https://www.mockblog.com/123456",
      "likes": 23,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Author 2",
      "url": "https://www.mockblog.com/1234567",
      "likes": 544,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Author 1",
      "url": "https://www.mockblog.com/1234567",
      "likes": 8698,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 4",
      "author": "Author 1",
      "url": "https://www.mockblog.com/1234567",
      "likes": 0,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 5",
      "author": "Author 2",
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
              
  ],
  [
              
    {
      "title": "Mock Blog Title",
      "author": "Author 1",
      "url": "https://www.mockblog.com/123456",
      "likes": 23,
      "id": "5f54c79917c0c7d1c608fca1"
    },
    {
      "title": "Mock Blog Title 2",
      "author": "Author 2",
      "url": "https://www.mockblog.com/1234567",
      "likes": 42,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Author 3",
      "url": "https://www.mockblog.com/1234567",
      "likes": 8698,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 3",
      "author": "Author 3",
      "url": "https://www.mockblog.com/1234567",
      "likes": 0,
      "id": "5f54c9ed55a4c0d3ba73b10a"
    },
    {
      "title": "Mock Blog Title 5",
      "author": "Author 1",
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


describe("Tests for favoriteBlog helper function",() => {

  const TEST_CASES = [{
    description: "favoriteBlog should return 5f54c79917c0c7d1c608fca1",
    params: [
      TEST_BLOG_LISTS[0]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "title": "Mock Blog Title",
        "author": "Author 1",
        "url": "https://www.mockblog.com/123456",
        "likes": 0,
        "id": "5f54c79917c0c7d1c608fca1"
      });
    }
  },{
    description: "favoriteBlog should return 5f54c79917c0c7d1c608fca1 2",
    params: [
      TEST_BLOG_LISTS[1]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "title": "Mock Blog Title",
        "author": "Random Author",
        "url": "https://www.mockblog.com/123456",
        "likes": 1,
        "id": "5f54c79917c0c7d1c608fca1"
      });
    }
  },{
    description: "favoriteBlog should return 5f54c9ed55a4c0d3ba73b10a",
    params: [
      TEST_BLOG_LISTS[2]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "title": "Mock Blog Title 3",
        "author": "Author 1",
        "url": "https://www.mockblog.com/1234567",
        "likes": 8698,
        "id": "5f54c9ed55a4c0d3ba73b10a"
      });
    }
  },
  {
    description: "favoriteBlog should return 5f54c9ed55a4c0d3ba73b10a 2",
    params: [
      TEST_BLOG_LISTS[3]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "title": "Mock Blog Title 3",
        "author": "Random Author",
        "url": "https://www.mockblog.com/1234567",
        "likes": 8698,
        "id": "5f54c9ed55a4c0d3ba73b10a"
      });
    }
  }
  ]
    
  TEST_CASES.forEach((testCase) => {
    test(testCase.description,() => {
      testCase.assert(listHelpers.favoriteBlog);
    })
  })
})




describe("Tests for mostBlogs helper function",() => {

  const TEST_CASES = [{
    description: "mostBlogs should return Author 1 with count 1 because Author 2 will not replace it",
    params: [
      TEST_BLOG_LISTS[0]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 1",
        "count": 1
      });
    }
  },{
    description: "mostBlogs should return the only author",
    params: [
      TEST_BLOG_LISTS[1]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Random Author",
        "count": 1
      });
    }
  },{
    description: "mostBlogs should return the clear winner Author 1",
    params: [
      TEST_BLOG_LISTS[2]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 1",
        "count": 3
      });
    }
  },
  {
    description: "mostBlogs should return Author 3 because Author 1 will not replace it",
    params: [
      TEST_BLOG_LISTS[4]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 3",
        "count": 2
      });
    }
  }
  ]
    
  TEST_CASES.forEach((testCase) => {
    test(testCase.description,() => {
      testCase.assert(listHelpers.mostBlogs);
    })
  })
})



describe("Tests for mostLikes helper function",() => {

  const TEST_CASES = [{
    description: "mostLikes should return Author 1 with likes 0 because Author 2 will not replace it",
    params: [
      TEST_BLOG_LISTS[0]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 1",
        "likes": 0
      });
    }
  },{
    description: "mostLikes should return the only author",
    params: [
      TEST_BLOG_LISTS[1]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Random Author",
        "likes": 1
      });
    }
  },{
    description: "mostLikes should return the clear winner Author 1",
    params: [
      TEST_BLOG_LISTS[2]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 1",
        "likes": 8721
      });
    }
  },
  {
    description: "mostLikes should return Author 3",
    params: [
      TEST_BLOG_LISTS[4]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toEqual({
        "author": "Author 3",
        "likes": 8698
      });
    }
  }
  ]
    
  TEST_CASES.forEach((testCase) => {
    test(testCase.description,() => {
      testCase.assert(listHelpers.mostLikes);
    })
  })
})