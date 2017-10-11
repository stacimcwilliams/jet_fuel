process.env.NODE_ENV = 'test';
const environment = 'test';

const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Jet Fuel server testing', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => {
        database.seed.run()
          .then(() => {
            done();
          });
      });
  });

  afterEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  describe('Client routes', () => {
    it('should return the homepage', (done) => {
      chai.request(server)
        .get('/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.html;
          done();
        });
    });

    it('should return a 404 for a non existent route', (done) => {
      chai.request(server)
        .get('/sad')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('API routes', () => {
    describe('GET /api/v1/folders', () => {
      it('should return all folders', (done) => {
        chai.request(server)
          .get('/api/v1/folders')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.should.have.length(2);
            response.body[0].should.have.property('title');
            response.body[0].should.have.property('id');
            done();
          });
      });
    });

    describe('GET /api/v1/links', () => {
      it('should return all links', (done) => {
        chai.request(server)
          .get('/api/v1/links')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body[0].should.have.property('name');
            response.body[0].should.have.property('url');
            done();
          });
      });
    });

    describe('GET /api/v1/folders/:folder_id', () => {
      it('should return one folder with an id', (done) => {
        chai.request(server)
          .get('/api/v1/folders/1')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.should.have.length(1);
            response.body[0].should.have.property('title');
            response.body[0].title.should.equal('shopping');
            done();
          });
      });

      it('should return a 404 for a sad route', (done) => {
        chai.request(server)
          .get('/api/v1/folders/sad')
          .end((err, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });


    describe('GET /short/:id', () => {
      it.skip('should redirect with id', (done) => {
        chai.request(server)
          .get('/short/5')
          .end((error, response) => {
            response.redirects.should.be.a('array');
            response.should.have.status(200);
            response.redirects[0].should.equal('http://www.boardgamegeek.com/');
            done();
          });
      });
    });

    describe('GET /api/v1/links/:link_id', () => {
      it('should return one link with an id', (done) => {
        chai.request(server)
          .get('/api/v1/links/3')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.should.have.length(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('amazon');
            done();
          });
      });

      it('should return a 404 for a sad route', (done) => {
        chai.request(server)
          .get('/api/v1/links/sad')
          .end((err, response) => {
            response.should.have.status(404);
            done();
          });
      });
    });

    describe('POST /api/v1/folders', () => {
      it('should create a new folder', (done) => {
        chai.request(server)
          .post('/api/v1/folders')
          .send({
            id: '7',
            title: 'New Folder',
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.be.a('object');
            response.body.should.have.property('title');
            chai.request(server)
              .get('/api/v1/folders')
              .end((err, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                done();
              });
          });
      });

      it('should not create a folder with missing data', (done) => {
        chai.request(server)
          .post('/api/v1/folders')
          .send({
            id: '7',
          })
          .end((err, response) => {
            response.should.have.status(422);
            done();
          });
      });
    });

    describe('POST /api/v1/links', () => {
      it('should create a new link', (done) => {
        chai.request(server)
          .post('/api/v1/links')
          .send({
            id: 1,
            folder_id: 1,
            name: 'Reddit',
            url: 'http://www.reddit.com',
            visits: '0',
          })
          .end((error, response) => {
            response.should.have.status(201);
            response.body.should.be.a('object');
            response.body.should.have.property('name');
            response.body.should.have.property('visits');
            response.body.should.have.property('url');
            chai.request(server)
              .get('/api/v1/links')
              .end((err, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('array');
                done();
              });
          });
      });

      it('should not create a link with missing data', (done) => {
        chai.request(server)
          .post('/api/v1/links')
          .send({
            folder_id: 1,
            name: 'Reddit',
            visits: '0',
          })
          .end((err, response) => {
            response.should.have.status(422);
            done();
          });
      });
    });
  });
});
