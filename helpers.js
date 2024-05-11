const getUserByEmail = function (email, users) {
    let foundUser = undefined;
    for (const userId in users) {
      const user = users[userId];
      if (user.email === email) {
        foundUser = user;
      }
    }
  
    return foundUser
  }

const generateRandomString = function() {
    return Math.random().toString(36).slice(2, 8);
};


  module.exports = { getUserByEmail, generateRandomString};