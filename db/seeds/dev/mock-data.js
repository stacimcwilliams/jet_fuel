
exports.seed = (knex, Promise) => {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'shopping'
        },'id')
          .then(folder => {
            return knex('links').insert([
              { name: 'amazon', url: 'http://www.amazon.com', folder_id: folder[0] },
            ])
          })
      ]) // end Promise.all
    })
};
