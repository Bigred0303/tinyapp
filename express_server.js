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

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
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
  if (req.body.username) {
    res.cookie('username', req.body.username);
  }


  res.status(200).redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');

  res.status(200).redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
