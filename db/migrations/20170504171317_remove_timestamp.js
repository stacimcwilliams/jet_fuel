
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('folders', (table) => {
      table.dropTimestamps()
    }),

    knex.schema.table('links', (table) => {
      table.dropTimestamps()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('folders', (table) => {
      table.timestamps();
    }),

    knex.schema.table('links', (table) => {
      table.timestamps();
    })
  ])
};
