'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;
process.env.APP_SECRET = 'sillyMe';

let app = require('./test-server');
let server;

describe('testing routers: auth and remote', ()=>{
  before((done)=>{
    server = app.listen(3005, ()=>{
      console.log('server up on 3005');
      done();
    });
  });
  after((done)=>{
    mongoose.connection.db.dropDatabase(()=>{
      mongoose.disconnect(()=>{
        server.close();
        done();
      });
    });
  });

  it('should post a new user with auth', (done)=>{
    request('localhost:3005')
      .post('/api/signup')
      .send({username:'ahhh', password:'fuck'})
      .end((err, res)=>{
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('')
});


// describe('testing remote routes', function() {
//   describe('testing POST: /api/remote', function() {
//     before((done) => {
//       new User({username: 'testUser', password: '123'}).save().then(user => {
//         this.tempUser = user;
//         done();
//       }).catch(done);
//     });
//
//     after((done) => {
//       Remote.remove({}).then(() => done()).catch(done);
//     });
//
//     it('should return a remote', (done) => {
//       request.post('localhost:3000/api/remote')
//         .send({
//           name: 'remote one',
//           userId: this.tempUser._id,
//           controls: ['a', 'b', 'c']
//         }).then(res => {
//           expect(res.body.name).to.eql('remote one');
//           expect(res.body.userId).to.eql(`${this.tempUser._id}`);
//           expect(res.body.controls.length).to.eql(3);
//           done();
//         }).catch(done);
//     });
//   });
//
//   describe('testing GET: /api/remote/:id', function(){
//     before((done) => {
//       new User({username: 'testUser', password: '123'}).save().then(user => {
//         this.tempUser = user;
//         return user.addRemote({
//           name: 'test 1',
//           controls: ['1', '2', '3', '4'],
//           userId: this.tempUser._id,
//         }).then((remote) => {
//           this.tempRemote = remote;
//           done();
//         }).catch(done);
//       }).catch(done);
//     });
//
//     after((done) => {
//       Remote.remove({}).then(() => done()).catch(done);
//     });
//
//     it('should return a remote', (done) => {
//       request.get(`localhost:3000/api/remote/${this.tempRemote._id}`)
//         .then(res => {
//           let data = res.body;
//           expect(data.name).to.eql('test 1');
//           expect(data.controls.length).to.eql(4);
//           expect(data.userId).to.eql(`${this.tempUser._id}`);
//           done();
//         })
//       .catch(done);
//     });
//   });
// });
