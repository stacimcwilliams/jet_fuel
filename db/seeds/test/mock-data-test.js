exports.seed = (knex, Promise) => {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'shopping',
          id: 1,
        }, 'id')
          .then((folder) => {
            return knex('links').insert([
              {
                name: 'amazon', url: 'http://www.amazon.com', folder_id: folder[0], id: 3,
              },
              {
                name: 'HM', url: 'http://www.hm.com', folder_id: folder[0], id: 4,
              },
            ]);
          }),

        knex('folders').insert({
          title: 'fun',
          id: 2,
        }, 'id')
          .then((folder) => {
            return knex('links').insert([
              {
                name: 'Games', url: 'http://www.boardgamegeek.com', folder_id: folder[0], id: 5,
              },
              {
                name: 'Awesome', url: 'http://www.theawesomer.com', folder_id: folder[0], id: 6,
              },
            ]);
          }),
      ]);
    });
};
