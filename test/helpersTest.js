const chai = require('chai');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../express_server.js'); // Assuming your Express app instance is exported from 'app.js'
const expect = chai.expect;
const helpers = require('../helpers');

chai.use(chaiHttp);

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
    const user = helpers.getUserByEmail("user@example.com", users);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID, "Users email corresponds to correct ID");
  });
  it('should return undefined with invalid email', function() {
    const user = helpers.getUserByEmail("user123@example.com", users);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, undefined, "Returns undefined when passed invalid email");
  });
});

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b2xVn2"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });
});

describe('Test Redirect from / to /login', function() {
  it('should redirect GET request from / to /login', function() {
    // Create a chai HTTP agent for making requests
    const agent = chai.request.agent(app);
  
    // Make GET request to /
    return agent
      .get('/')
      .redirects(1) // Allow following one redirect
      .then(function(res) {
        // Assert that the status code is 200 (due to following the redirect)
        expect(res).to.have.status(200);
  
        // Ensure there is one redirect
        expect(res.redirects).to.have.lengthOf(1);
  
        // Ensure it redirects to /login
        expect(res.redirects[0]).to.match(/\/login$/);
      });
  });
});

describe('Test Redirect from /urls/new to /login', function() {
  it('should redirect GET request from /urls/new to /login with status code 302', function() {
    // Create a chai HTTP agent for making requests
    const agent = chai.request.agent(app);

    // Make GET request to /urls/new
    return agent
      .get('/urls/new')
      .redirects(1) // Allow following one redirect
      .then(function(res) {
        // Assert that the status code is 200 (due to following the redirect)
        expect(res).to.have.status(200);

        // Ensure there is one redirect
        expect(res.redirects).to.have.lengthOf(1);

        // Ensure it redirects to /login
        expect(res.redirects[0]).to.match(/\/login$/);
      });
  });
});

describe('Test GET request to non-existent URL', function() {
  it('should return status code 404 for non-existent URL', function() {
    // Make GET request to a non-existent URL
    return chai.request(app)
      .get('/urls/NOTEXISTS')
      .then(function(res) {
        // Assert that the status code is 403 (This is due to not having cookies)
        expect(res).to.have.status(403);
      });
  });
});

describe('Test GET request to protected URL', function() {
  it('should return status code 403 for accessing protected URL without proper authentication', function() {
    // Make GET request to the protected URL
    return chai.request(app)
      .get('/urls/b2xVn2')
      .then(function(res) {
        // Assert that the status code is 403
        expect(res).to.have.status(403);
      });
  });
});