const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'jetfuel'
app.locals.folders = [{name:'1', id:1},{name:2, id:2}]
app.locals.links = [{name: 'amazon', link: 'http://www.amazon.com', folder: 1, id: 1}]

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})


app.get('/api/v1/folders', (request, response) => {
  const folders = app.locals.folders

  response.json({ folders })
})


app.get('/api/v1/:folder/links', (request, response) => {
  //need to redo this!
  // const { id } = request.params
  // const message = app.locals.links[id]
  //
  // if (!message) { return response.sendStatus(404)  }
  //
  // response.json({ id, message })
})


app.post('/api/v1/folders', (request, response) => {
  const { name } = request.body
  const id = md5(`${name}${Date.now()}`)
  const folderObj = { name, id }

  if (!name) {
    return response.status(422).send({
      error: 'No name property provided'
    })
  }

  app.locals.folders.push(folderObj)

  response.status(201).send(folderObj)
})

app.post('/api/v1/links',(request,response) => {
  console.log("hello is it me your looking for");
  const { name, url, folderId } = request.body
  const id = md5(url)
  const linkObj = { name, url, folderId, id }

  if(!url || !name) {
    return response.status(422).send({
      error: 'Missing name or url'
    })
  }

  app.locals.links.push(linkObj)

  response.status(201).send(linkObj)
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
