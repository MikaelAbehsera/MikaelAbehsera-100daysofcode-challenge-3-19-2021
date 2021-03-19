require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var router = express.Router();
const FormData = require("form-data");
const fetch = require("node-fetch");
const { request } = require("@octokit/request");
const knex = require("./knex/knex.js");
const { v4: uuidv4 } = require("uuid");
const { client_id, redirect_uri, client_secret } = require("./oauth/config");
const { x } = require("joi");
const PORT = process.env.SERVER_PORT || 5000;

// remove?
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.json("/ Home route");
});

app.post("/authenticate", async (req, res) => {
  const { code } = req.body;
  const data = new FormData();
  var user;
  var passtoken;

  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);
  data.append("redirect_uri", redirect_uri);

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then(async (paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
      passtoken = access_token;
      console.log(access_token);
      // Request to return data of a user that has been authenticated
      return await fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) =>
      response.json().then((data) => {
        data["access_token"] = passtoken;
        user = data;
        return data;
      })
    )
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).json(error);
    });
});

app.post("/user", async (req, res) => {
  const {
    name,
    email,
    access_token,
    avatar_url,
    html_url,
    type,
    id,
  } = req.body;
  const user = {
    id,
    name,
    email,
    access_token,
    avatar_url,
    github_url: html_url,
    type,
  };

  await insertUser(user);
  console.log(
    `User ${name} object has succesfully given oauth authentication.`
  );
  res.json("/ user route");
});

/**
 * Function inserts a new user object into the database.
 *
 * @param {user} object user object.
 *
 * @return {Promise} Knex Promise.
 */
const insertUser = (user) => {
  knex
    .select("github_id")
    .from("users")
    .where("github_id", user.id)
    .then((results) => {
      if (results.length === 0) {
        return knex("users")
          .insert({
            uuid: uuidv4(),
            github_id: Number(user.id),
            name: user.name,
            email: user.email,
            access_token: user.access_token,
            avatar_url: user.avatar_url,
            github_url: user.github_url,
            type: user.type,
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.log(
          `${user.name} (id: ${user.id}) already exists in the database.`
        );
      }
    })
    .then(() => createNewRepo(user.name, user.access_token))
    .catch((error) => {
      console.error(error);
    });
};

const createNewRepo = async (name, access_token) => {
  console.log(`testing repo creation`);
  console.log(`token ${access_token}`);

  return await request({
    method: "POST",
    url: "/repos/{template_owner}/{template_repo}/generate",
    headers: {
      authorization: `token ${access_token}`,
    },
    template_owner: "silobusters",
    template_repo: "100daysofcode",
    owner: "MikaelAbehsera",
    name: "100daysofcode",
    description: "100 days of code test repository.",
    mediaType: {
      previews: ["baptiste"],
    },
  }).catch((error) => {
    console.error(error);
  });
};

const getFullUserDataFromGithubId = async (id) => {
  console.log(`USER ID GITHUB THING ${id}`);

  return await knex("users")
    .join("repo_status", "users.id", "repo_status.id")
    .select("*")
    .where({ github_id: Number(id) })
    .then((result) => {
      console.log(result);
      return result;
    });
};

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//remove console.logs
//look over server code for refractions

// when repo is created grab the date
// update db with repo creation date
// update db to say streak is active

// every day at x time:
// check all active dbs
// check if the repo has had any changes within 24 hours
// if yes: sign the db with a new and updated time on this confirmation
// if no: make user active status false

// make repo tempate name on creation have some relation to that moment, like a date, so it wont have a duplicate
