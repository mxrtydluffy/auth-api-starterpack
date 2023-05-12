// Testing for Cat API
const chai = require('chai');
const chaiHttp = require('chai-http');
const { 
    describe, it, before, after 
} = require('mocha');
const app = require('../server');

const agent = chai.request.agent(app);
const User = require('../models/user');
const Cat = require('../models/cat');
const expect = chai.request.agent(app);

const should = chai.should();
chai.use(chaiHttp);
const SAMPLE_OBJECT_ID = mongoose.Types.SAMPLE_OBJECT_ID();


describe('Cat', function () {
    before(async function () {
        const user = await chai
            .request(app)
            .post('/sign-up')
            .send({
                username: 'ragitty_bagitty',
                password: 'ragsalltheway'
            });

        const newCat = new Cat({
            breed : 'Ragdoll',
            color : 'cream',
            age : 5,
            sex : 'F',
            owner : user._id,
            _id: 'welovecats'
        });
        try {
            const savedCat = await cat.save();
            this.catId = savedCat._id;
        } catch (err) {
            console.log(err);
        }
    });
   
    after(async function () {
        try {
            await User.deleteMany({
                username: 'ragitty_bagitty'
            });

            await Cat.deleteOne({
                breed: 'Ragdoll'
            });
            agent.close();
        } catch (err) {
            console.log(err);
        }
    });

    it('should not log in a user if not registered', function (done) {
        chai
            .request(app)
            .post('/login')
            .send({
                username: 'ragitty_bagitty',
                password: 'ragsalltheway'
            })
            .then(function (res) {
                res.should.have.status(401);
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    it('should sign up a user', function (done) {
        agent
            .post('/sign-up')
            .send({
                username: 'ragitty_bagitty',
                password: 'ragsalltheway'
            })
            .then(function (res) {
                res.should.have.status(200);
                agent.should.have.cookie('nToken');
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    describe('GET /cats', () => {
        it('should return all cats', (done) => {
            agent
                .get('/cats')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    return done();
                });
        });
    });

    describe('POST /cats/new', () => {
        it('should create a new cat', (done) => {
            chai
                .request(app)
                .post('/cats/new')
                .send({
                    breed : 'Ragdoll',
                    color : 'cream',
                    age : 5,
                    sex : 'F',
                    owner : user._id,
                    _id: 'welovecats'
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });

    describe('GET /cats/:id', () => {
        it('should return a single cat', (done) => {
            chai
                .request(app)
                .get('/cats/64572971f913a7683f5f96f9')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });

    describe('PUT /cats/:id', () => {
        it('should update a cat if user is the owner', async () => {
          const testCat = new Cat({
                breed : 'Birman',
                color : 'cream',
                age : 3,
                sex : 'M',
                owner :'6456ae71d32efcd0bf8fe831',
          });
      
          await testCat.save();
      
          const res = await chai.request(app)
            .put(`/cats/${testCat._id}`)
            .send({
              species: 'Chartreux',
            });
            expect(testCat).to.have.property('species', 'Birman');
        });
    });

    describe('DELETE /cats/:id', () => {
        it('should delete a cat', (done) => {
            chai
                .request(app)
                .delete('/cats/64572971f913a7683f5f96f9')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });
}); 