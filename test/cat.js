// Testing for Cat API
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/user');


describe('Cat', function () {
   const newCat = {
        breed : 'Ragdoll',
        color : 'cream',
        age : 5,
        sex : 'F',
        owner : 'Carissa Sanchez'
   }

    const user = {
        username: 'ragitty_bagitty',
        password: 'ragsalltheway'
    }
    after(function () {
        agent.close();
    });

    it('should be able to create a cat', function (done) {
        agent
            .post('/cat')
            .send(newCat)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should be able to get a cat', function (done) {
        agent
            .get('/cat')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should be able to update a cat', function (done) {
        agent
            .put('/cat')
            .send(newCat)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should be able to delete a cat', function (done) {
        agent
            .delete('/cat')
            .send(newCat)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

}); 