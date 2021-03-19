exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments().primary(); // id
    table.integer("github_id").unique().notNullable(); // github unique id
    table.uuid("uuid"); // uuid
    table.string("name"); // login
    table.string("email"); // email
    table.string("access_token"); // token
    table.string("avatar_url"); // avatar_url
    table.string("github_url"); // html_url
    table.string("type"); // type
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
