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

const users = {

};

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[user_id] };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[user_id] };
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
  // if (!req.body.username) {
  //   res.cookie('user_id', req.body.id);
  // }


  res.status(200).redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');

  res.status(200).redirect('/urls');
});

app.post("/register" , (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const new_user = {
    id: id,
    email: email,
    password: password
  }
  users[id] = new_user;
  res.cookie("user_id", id);
  console.log(users);
  res.status(200).redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
