
exports.seed = (knex, Promise) => {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'shopping',
        }, 'id')
          .then((folder) => {
            return knex('links').insert([
              {
                name: 'amazon', url: 'http://www.amazon.com', folder_id: folder[0], visits: 0,
              },
              {
                name: 'HM', url: 'http://www.hm.com', folder_id: folder[0], visits: 0,
              },
            ]);
          }),

        knex('folders').insert({
          title: 'fun',
        }, 'id')
          .then((folder) => {
            return knex('links').insert([
              {
                name: 'Games', url: 'http://www.boardgamegeek.com', folder_id: folder[0], visits: 0,
              },
              {
                name: 'Awesome', url: 'http://www.theawesomer.com', folder_id: folder[0], visits: 0,
              },
            ]);
          }),
      ]);
    });
};
