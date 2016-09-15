'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../model/user');
const BasicHttp = require('../lib/basic-http');
const jwtAuth = require('../lib/jwt-auth');
const authorization = require('../lib/authorization');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  console.log(req.body.username);
  if(!req.body.username || !req.body.password || req.body.username === undefined || req.body.password === undefined) {
    return next(createError(400, 'Both a username and password are required.'));
  }

  User.find({ 'username': req.body.username}, (err, user) => {
    if (err) {
      console.log('Signup error.');
      return next(createError(500, 'Internal server error.'));
    }
    if (user.length !== 0 && user[0].username) {
      console.log('Username already exists, username: ' + newUser.username);
      return next(createError(400, 'The requested username already exists.'));
    }
  });

  let newUser = new User();
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  console.log(newUser);

  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save((err, user) => {
        if (err) next(createError(400, 'Bad request.'));
        if (user) res.json(tokenData);
      });
    }).catch((err) => {
      console.log('error generating hash: ' + err);
      next(createError(401, 'Bad authentication.'));
    });
});


authRouter.get('/signin', BasicHttp, (req, res, next) => {
  console.log('signin route');
  User.findOne({'username': req.auth.username}, (err, user) => {
    console.log('signin user: ' + user);
    if (!user || err) return next(createError(401, 'Bad authentication.'));
    user.comparePassword(req.auth.password)
      .then(res.json.bind(res))
      .catch((err) => {
        next(err);
      });
  });
});


// Authorization/role edit route, currently not in our mvp I believe
authRouter.put('/editrole/:userid', jsonParser, jwtAuth, authorization(), (req, res, next) => {
  User.update({_id: req.params.userid}, {$set: {role: req.body.role}}).then(res.json.bind(res), createError(500, 'Server Error'));
});

// For admin to see all users
authRouter.get('/users', jsonParser, jwtAuth, authorization(), (req, res, next) => {
  User.find().then(res.json.bind(res), createError(500, 'Server Error'));
});
