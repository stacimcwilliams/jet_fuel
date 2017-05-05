const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'jetfuel'

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then(folders => response.status(200).json(folders))
    .catch(error => {
      response.status(500)
      console.log('error: ', error)
    })
})

app.get('/api/v1/links', (request, response) => {
  database('links').select()
    .then(links => response.status(200).json(links))
    .catch(error => console.log('error: ', error))
})

app.get('/api/v1/folders/:folder_id', (request, response) => {
  database('folders').where('id', request.params.folder_id).select()
    .then(folders => response.status(200).json(folders))
    .catch(error => console.log('error: ', error))
})

app.get('/api/v1/links/:link_id', (request, response) => {
  database('links').where('id', request.params.link_id).select()
    .then(link => response.status(200).json(link))
    .catch(error => console.log('error: ', error))
})

app.get('/short/:id', (request, response) => {
  let visits
  let url

  database('links').where('id', request.params.id).select()
    .then(data => {
      let link = data[0]
      visits = link.visits + 1
      url = link.url
    })
    .then(() =>  {
      database('links').where('id', request.params.id).update('visits', visits)
      .then(()=> response.redirect(307, url))// add a status code
      .catch(error => console.log('error: ', error))
    })
})

app.get('/api/v1/folders/:folder_id/links', (request, response) => {
  database('links').where('folder_id', request.params.folder_id).select()
    .then(links => response.status(200).json(links))
    .catch(error => console.log('error: ', error))
})

app.post('/api/v1/folders', (request, response) => {
  const folder = request.body
  console.log(folder)
  database('folders').insert(folder, ['id', 'title'] )
    .then(folder => response.status(201).json(folder[0]))
    .catch(error => console.log('error: ', error))
})

app.post('/api/v1/links', (request, response) => {
  const link = request.body
  database('links').insert(link, ['id', 'name', 'url', 'visits'])
    .then(link => response.status(201).json(link[0]))
    .catch(error => console.log('error: ', error))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app







//
// app.patch('/api/v1/links/:link_id', (request, response) => {
//   const link = request.body
//   database('links').where('id', request.params.link_id).update(link, ['id', 'name', 'url', 'visits'])
//     .then(link => response.status(200).json(link[0]))
//     .catch(error => console.log('error: ', error))
// })
