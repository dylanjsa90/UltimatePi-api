'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
// const ErrorHandler = require('../lib/error-handler');
const User = require('../model/user');
const BasicHttp = require('../lib/basic-http');
const jwtAuth = require('../lib/jwt-auth');
const authorization = require('../lib/authorization');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  console.log(req.body.username);
  if(!req.body.username || !req.body.password || req.body.username === undefined || req.body.password === undefined){
    return next(createError(400, 'Password and Username are both needed'));
  }

  User.find({ 'username': req.body.username}, function(err, user) {
    if (err) {
      console.log('Signup error');
      return err;
    }
  //if user found.
    if (user.length!==0) {
      if(user[0].username){
        console.log('Username already exists, username: ' + newUser.username);
        return next(createError(310, 'FUCM MEMEMME'));
      }
    }
  });

  let newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  console.log(newUser);

  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save()
        .then(() => {
          console.log(tokenData);
          res.json(tokenData);
        }, (err) => {
          next(createError(400, 'Bad Request'));
        });
    }, createError(500, 'Server Error'));
});


authRouter.get('/signin', BasicHttp, (req, res, next) => {
  console.log('signin route');
  User.findOne({'username': req.auth.username})
    .then((user) => {
      console.log('signin user: ' + user);
      if (!user || user === null || user === undefined)
        return next(createError(401, 'Bad authentication.'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res), createError(401, 'Invalid login info.'));
    }, createError(401, 'Invalid login info.'));
});

// Authorization/role edit route, currently not in our mvp I believe
authRouter.put('/editrole/:userid', jsonParser, jwtAuth, authorization(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), createError(500, 'Server Error'));
});

// For admin to see all users
authRouter.get('/users', jsonParser, jwtAuth, authorization(), (req, res, next) => {
  User.find().then(res.json.bind(res), createError(500, 'Server Error'));
});
