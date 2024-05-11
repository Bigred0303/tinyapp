const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const helpers = require("./helpers");
const app = express();
const PORT = 8080; // default port 8080


// VIEW ENGINE
app.set("view engine", "ejs");

//

// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: 'MMM Session Cookies',
  keys: ['This is a string'],
}));

//

const urlsForUser = function(id) {
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

//

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

let userId = null;
const users = {
  email: "user2@example.com", password: "dishwasher-funk"
};

// Brings you to new URL page, must be logged in

app.get("/urls/new", (req, res) => {
  if (!req.session["userId"]) {
    res.redirect("/login");
  }
  const userId = req.session["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_new", templateVars);
});

// Shows you the URLS Index page, must be logged in

app.get("/urls", (req, res) => {
  if (req.session.userId === undefined || req.session.userId === null) {
    return res.status(403).send("You cannot shorten URLS, please Login first!");
  }
  const userId = req.session["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlsForUser(userId), user: user };
  res.render("urls_index", templateVars);
});

// Shows you the page for a specific URL, must be logged in and have the correct userID to access

app.get("/urls/:id", (req, res) => {
  if (req.session.userId === undefined || req.session.userId === null) {
    res.status(403).send("You cannot shorten URLS, please Login first!");
  }
  const userId = req.session["userId"];
  if (userId !== urlDatabase[req.params.id].userID) {
    res.status(403).send("This URL doesn't belong to you!");
  }
  const user = users[userId] ? users[userId] : null;
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user };
  res.render("urls_show", templateVars);
});

// Sends you to the specified URL, must be an existing URL

app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(400).send("ID does not exist silly!");
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.status(200).redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect('/login');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Brings you to register page, if you already have a cookie it just sends you to /urls

app.get('/register', (req, res) => {
  if (req.session["userId"]) {
    res.redirect("/urls");
  }
  res.render("register");
});

// Brings you to the login page, if you already have a cookie somehow it brings you to the urls page

app.get('/login', (req, res) => {
  if (req.session["userId"]) {
    res.redirect("/urls");
  }
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars);
});

// Lets you create a new URL, must be logged in first

app.post("/urls", (req, res) => {
  if (req.session.userId === undefined || req.session.userId === null) {
    res.status(403).send("You cannot shorten URLS, please Login first!");
  }
  const id = helpers.generateRandomString();
  const userId = req.session["userId"];
  // Template object for new URLS in the database
  const newURL = {
    id: id,
    longURL: req.body.longURL,
    userID: userId
  };
  urlDatabase[id] = newURL;
  res.status(200).redirect(`/urls/${id}`);
});

// DELETE a URL

app.post('/urls/:id/delete', (req, res) => {
  if (req.session.userId !== urlDatabase[req.params.id].userID) {
    res.status(403).send("This URL doesn't belong to you, you can't delete it!");
  }
  const id = req.params.id;

  delete urlDatabase[id]; // delete urlDatabase.id

  res.redirect('/urls');
});

// EDIT a URL

app.post('/urls/:id/edit', (req, res) => {
  if (req.session.userId !== urlDatabase[req.params.id].userID) {
    res.status(403).send("This URL doesn't belong to you, you can't edit it!");
  }
  const id = req.params.id;

  urlDatabase[id].longURL = req.body.longURL; // edit urlDatabase.id

  res.redirect('/urls');
});

// Login Functionality

app.post('/login', (req, res) => {
  let foundUser = null;
  const email = req.body.email;
  // Searches for your user(email) in the users object
  foundUser = helpers.getUserByEmail(email, users);

  if (!foundUser) {
    return res.status(403).send('No user with that email found');
  }
  // Checks your plaintext password against the encrypted stored password
  if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
    return res.status(403).send('Wrong Password');
  }

  req.session.userId = foundUser.id;
  res.status(200).redirect('urls');
});

// Removes all cookies when you logout and sends you to login page

app.post('/logout', (req, res) => {
  req.session = null;

  res.status(200).redirect('/login');
});

// Register functionality

app.post("/register" , (req, res) => {

  // Create unique user ID
  const id = helpers.generateRandomString();
  // Makes sure all fields are valid
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("You left one of email or password blank, Silly!");
  }
  // Makes sure users email doesn't already exist
  const emailReg = req.body.email;
  const foundUser = helpers.getUserByEmail(emailReg, users);
  if (foundUser !== undefined) {
    res.status(400).send("A user with that email already exists, try to login instead");
  }
  // Creates new user with given information, stores password as encrypted value
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const newUser = {
    id: id,
    email: email,
    password: password
  };
  users[id] = newUser;
  res.status(200).redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


module.exports = app;