exports.up = function (knex) {
  return knex.schema.createTable("repo_status", (table) => {
    table.increments().primary(); // id
    table.integer("user_github_id").unique().notNullable();
    table.boolean("still_active"); // Is the streak stil active
    table.date("start_date"); // start date
    table.date("last_commit"); // last commit

    table // reference from repo status to users
      .foreign("user_github_id")
      .references("github_id")
      .on("users")
      .onDelete("cascade");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("repo_status");
};
