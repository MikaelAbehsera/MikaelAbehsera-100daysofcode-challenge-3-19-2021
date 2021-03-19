exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          // id: 1,
          github_id: 1234,
          uuid: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
          name: "John Doe",
          email: "johndoe@gmail.com",
          access_token: "1234abcd",
          avatar_url: "google.com/images",
          github_url: "github.com/johndoe",
          type: "User",
        },
        {
          // id: 2,
          github_id: 4321,
          uuid: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
          name: "Jane Doe",
          email: "janedoe@gmail.com",
          access_token: "abcd1234",
          avatar_url: "google.com/images",
          github_url: "github.com/janedoe",
          type: "User",
        },
      ]);
    });
};

// table.increments().primary();
// table.uuid('uuid');           // uuid
// table.string('name');         // login
// table.string('email');        // email
// table.string('access_token'); // token
// table.string('avatar_url');   // avatar_url
// table.string('github_url');   // html_url
// table.string('type');         // type
