const { assert } = require('chai');

const helpers = require('../helpers');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = helpers.getUsersByEmail("user@example.com", users)
    const expectedUserID = "userRandomID";
    assert(user.id === expectedUserID, "Users email corresponds to correct ID");
  });
  it('should return undefined with invalid email', function() {
    const user = helpers.getUsersByEmail("user123@example.com", users)
    const expectedUserID = "userRandomID";
    assert(user === undefined, "Returns undefined when passed invalid email");
  });
});