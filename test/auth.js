const chai = require('chai');
const chaiHttp = require('chai-http');
const { 
    describe, it, after 
} = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/user');

after(() => {
    agent.close();
});

describe('User', function () {

    it('should not be able to login if they have not registered', function (done) {
        agent.post('/login', { email: 'wrong@example.com', password: 'nope' }).end(function (err, res) {
            res.should.have.status(401);
            done();
        });
    });

    it('should be able to signup', function (done) {
        User.findOneAndRemove({ username: 'testone' }, function () {
            agent
              .post('/sign-up')
              .send({ username: 'testone', password: 'password' })
              .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                agent.should.have.cookie('nToken');
                done();
              });
        });
    });

    it('should be able to login', function (done) {
        agent
          .post('/login')
          .send({ username: 'testone', password: 'password' })
          .end(function (err, res) {
            res.should.have.status(200);
            agent.should.have.cookie('nToken');
            done();
          });
    });
      
    it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
        res.should.have.status(200);
        agent.should.not.have.cookie('nToken');
        done();
        });
    });

    it('should be able to get a user', (done) => {
        const id = '6454829c4ff99e1b0e8ef529';
        agent.get(`/users/${id}`).end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
}); 