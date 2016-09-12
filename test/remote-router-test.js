'use strict';

process.env.MONGODB_URI = 'mongodb://localhost/remotetest';

const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const expect = require('chai').expect;

const Remote = require('../model/remote');
const User = require('../model/user');

request.use(superPromise);

describe('testing remote routes', function() {
  describe('testing POST: /api/remote', function() {
    before((done) => {
      new User({username: 'testUser', password: '123'}).save().then(user => {
        this.tempUser = user;
        done();
      }).catch(done);
    });

    after((done) => {
      Remote.remove({}).then(() => done()).catch(done);
    });

    it('should return a remote', (done) => {
      request.post('localhost:3000/api/remote')
        .send({
          name: 'remote one',
          userId: this.tempUser._id,
          controls: ['a', 'b', 'c']
        }).then(res => {
          expect(res.body.name).to.eql('remote one');
          expect(res.body.userId).to.eql(`${this.tempUser._id}`);
          expect(res.body.controls.length).to.eql(3);
          done();
        }).catch(done);
    });
  });

  describe('testing GET: /api/remote/:id', function(){
    before((done) => {
      new User({username: 'testUser', password: '123'}).save().then(user => {
        this.tempUser = user;
        return user.addRemote({
          name: 'test 1',
          controls: ['1', '2', '3', '4'],
          userId: this.tempUser._id,
        }).then((remote) => {
          this.tempRemote = remote;
          done();
        }).catch(done);
      }).catch(done);
    });

    after((done) => {
      Remote.remove({}).then(() => done()).catch(done);
    });

    it('should return a remote', (done) => {
      request.get(`localhost:3000/api/remote/${this.tempRemote._id}`)
        .then(res => {
          let data = res.body;
          expect(data.name).to.eql('test 1');
          expect(data.controls.length).to.eql(4);
          expect(data.userId).to.eql(`${this.tempUser._id}`);
          done();
        })
      .catch(done);
    });
  });
});
