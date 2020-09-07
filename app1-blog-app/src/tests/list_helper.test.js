const listHelpers = require("../utils/list_helper.js");


describe("Tests for dummy helper function",() => {

  test("Dummy helper function should return 1",() => {
    expect(listHelpers.dummy([])).toBe(1);
  })
})