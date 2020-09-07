const listHelpers = require("../utils/list_helper.js");


describe("Tests for dummy helper function",() => {

  test("Dummy helper function should return 1",() => {
    expect(listHelpers.dummy([])).toBe(1);
  })
})


describe("Tests for getTotalLikes helper function",() => {

  const TEST_CASES = [{
    description: "getTotalLikes should return 0",
    params: [
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
                
      ]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(0);
    }
  },{
    description: "getTotalLikes should return 1",
    params: [
      [{
        "title": "Mock Blog Title",
        "author": "Random Author",
        "url": "https://www.mockblog.com/123456",
        "likes": 1,
        "id": "5f54c79917c0c7d1c608fca1"
      }]
    ],
    assert: function(targetFunction){
      expect(targetFunction(...this.params)).toBe(1);
    }
  }]
    
  TEST_CASES.forEach((testCase) => {
    test(testCase.description,() => {
      testCase.assert(listHelpers.getTotalLikes);
    })
  })
})