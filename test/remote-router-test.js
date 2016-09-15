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
      .send({username:'hello', password:'goodbye'})
      .end((err, res)=>{
        console.log(res.body);
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not post a new user', (done)=>{
    request('localhost:3005')
      .post('/api/signup')
      .send({username:'ahhh'})
      .end((err, res)=>{
        expect(err).to.not.eql(null);
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should not post a new user', (done)=>{
    request('localhost:3005')
      .post('/api/signup')
      .end((err, res)=>{
        expect(err).to.not.eql(null);
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should get an existing user', (done)=>{
    request('localhost:3005')
      .get('/api/signin')
      .auth('hello', 'goodbye')
      .end((err, res)=>{
        console.log(res.body);
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not get a user due to incorrect password', (done)=>{
    request('localhost:3005')
      .get('/api/signin')
      .auth('hello', 'no')
      .end((err, res)=>{
        console.log('res: ' + res.data);
        expect(err).to.not.eql(null);
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should not get a user due to incorrect password', (done)=>{
    request('localhost:3005')
      .get('/api/signin')
      .auth('he', 'goodbye')
      .end((err, res)=>{
        expect(err).to.not.eql(null);
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('testings remote commands', ()=>{
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

  it('POST should send the command to the pi', (done)=>{
    request('localhost:3005')
      .post('/api/remote/POWER')
      .end((err, res)=>{
        expect(err).to.eql(null);
        expect(res.text).to.have.string('POWER');
        done();
      });
  });

  it('should not send a command to the pi', (done)=>{
    request('localhost:3005')
      .post('/api/remote')
      .end((err, res)=>{
        expect(err).to.not.eql(null);
        expect(res).to.have.status(404);
        done();
      });
  });
});
