const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080


// VIEW ENGINE
app.set("view engine", "ejs");

//

// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//

// HELPER FUNCTIONS

const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};
//


const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

let userId = null;
const users = {

};

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.status(200).redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello! Please go to /urls to see TinyApp!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/register', (req, res) => {
  res.render("register");
});

app.get('/login', (req, res) => {
  const userId = req.cookies["userId"];
  const user = users[userId] ? users[userId] : null;
  const templateVars = { urls: urlDatabase, user: user };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {

  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;

  res.status(200).redirect(`/urls/${id}`);
});

// DELETE a URL

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id]; // delete urlDatabase.id

  res.redirect('/urls');
});

// EDIT a URL

app.post('/urls/:id/edit', (req, res) => {
  const id = req.params.id;

  urlDatabase[id] = req.body.longURL; // edit urlDatabase.id

  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  let foundUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user.email === req.body.email) {
      foundUser = user;
    }
  }
  if (!foundUser) {
    return res.status(403).send('No user with that email found');
  }
  if (foundUser.password !== req.body.password) {
    return res.status(403).send('Wrong Password');
  }

  res.cookie('userId', foundUser.id);
  res.status(200).redirect('urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('userId');

  res.status(200).redirect('/login');
});

app.post("/register" , (req, res) => {
  const id = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send("You left one of email or password blank, Silly!");;
  }
  for (const user in users) {
    if (users[user].email === req.body.email) {
      res.status(400).send("A user with that email already exists, try to login instead");
    }
  }
  const email = req.body.email;
  const password = req.body.password;
  const newUser = {
    id: id,
    email: email,
    password: password
  };
  users[id] = newUser;
  console.log(users);
  res.status(200).redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
