const app = require('./../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const should = chai.should();
const agent = chai.request.agent(app);

chai.use(chaiHttp);

describe('API Tests', () => {
  describe('site', () => {
    it('Should have home page', (done) => {
      agent
        .get('/')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.should.have.status(200);
          return done();
        });
    });
  });
});