
// Checks to see if a user exists by searching for the provided email, takes in the email from the form and the users object to search
const getUserByEmail = function(email, users) {
  let foundUser = undefined;
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }
  
  return foundUser;
};

// Creates a random string of numbers and letters 6 characters long
const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};

//Checks the urlDatabase object for which urls have the ID matching the one passed in the arguements
const urlsForUser = function(id, urlDatabase) {
  let returnURLS = {

  };
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      returnURLS[url] = urlDatabase[url];
    }
  }
  console.log(returnURLS);
  return returnURLS;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser};