const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'jetfuel';

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file);
  });
});

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then(folders => response.status(200).json(folders))
    .catch(() => response.sendStatus(500));
});

app.get('/api/v1/links', (request, response) => {
  database('links').select()
    .then(links => response.status(200).json(links))
    .catch(() => response.sendStatus(500));
});

app.get('/api/v1/folders/:folder_id', (request, response) => {
  database('folders').where('id', request.params.folder_id).select()
    .then(folders => response.status(200).json(folders))
    .catch(() => response.sendStatus(404));
});

app.get('/api/v1/links/:link_id', (request, response) => {
  database('links').where('id', request.params.link_id).select()
    .then(link => response.status(200).json(link))
    .catch(() => response.sendStatus(404));
});

app.get('/short/:id', (request, response) => {
  let linkVisits;
  let linkUrl;

  database('links').where('id', request.params.id).select()
    .then((data) => {
      const { visits, url } = data[0];
      linkVisits = visits + 1;
      linkUrl = url;
    })
    .then(() => {
      database('links').where('id', request.params.id).update('visits', linkVisits)
        .then(() => response.redirect(307, linkUrl))
        .catch(() => response.sendStatus(404));
    });
});

app.get('/api/v1/folders/:folder_id/links', (request, response) => {
  database('links').where('folder_id', request.params.folder_id).select()
    .then(links => response.status(200).json(links))
    .catch(() => response.sendStatus(404));
});

app.post('/api/v1/folders', (request, response) => {
  const validFolder = ['title'].every(prop => request.body.hasOwnProperty(prop));

  const folder = request.body;

  if (validFolder) {
    database('folders').insert(folder, ['id', 'title'])
      .then(folder => response.status(201).json(folder[0]))
      .catch(() => response.sendStatus(422));
  } else {
    response.sendStatus(422);
  }
});

app.post('/api/v1/links', (request, response) => {
  const validLink = ['name', 'url', 'folder_id', 'visits'].every(prop => request.body.hasOwnProperty(prop));

  const link = request.body;

  if (validLink) {
    database('links').insert(link, ['id', 'name', 'url', 'visits'])
      .then(link => response.status(201).json(link[0]))
      .catch(() => response.sendStatus(422));
  } else {
    response.sendStatus(422);
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
