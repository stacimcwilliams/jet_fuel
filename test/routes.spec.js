process.env.NODE_ENV = 'test';

const environment = 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

console.log(configuration);
chai.use(chaiHttp)

describe('Jet Fuel server testing', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => {
      database.seed.run()
      .then(() => {
        done()
      })
    })
  })

  afterEach(() => {
    database.seed.run()
  })

  describe('Client routes', () => {
    it('should return all folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((error, response) => {
        console.log(response.body);
        response.should.have.status(200)
        response.body.should.have.length(2)
        done()
      })
    })
  })

//   describe('GET /api/v1/folder/:id', function() {
//   it('should return a single folder', function(done) {
//     chai.request(server)
//     .get('/api/v1/folders/')
//     .end(function(error, response) {
//       response.should.have.status(200);
//       console.log(response.body);
//       done();
//     })
//   })
// })

})
