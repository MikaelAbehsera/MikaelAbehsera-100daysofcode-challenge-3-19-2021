exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("repo_status")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("repo_status").insert([
        {
          user_github_id: 1234,
          still_active: true,
          start_date: "2021-03-07T00:02:14.322Z",
          last_commit: "2021-03-07T00:02:14.322Z",
        },
        {
          user_github_id: 4321,
          still_active: true,
          start_date: "2021-03-07T03:32:54.938Z",
          last_commit: "2021-03-07T03:32:54.938Z",
        },
      ]);
    });
};
