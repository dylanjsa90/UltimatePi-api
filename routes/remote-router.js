'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Remote = require('../model/remote');
const User = require('../model/user');

let findUser = function(req, res, next) {
  console.log(req.body);
  User.findOne({_id: req.body.userId}).then((user) => {
    if (!user) next(createError(404, 'User not found'));
    req.user = user;
    next();
  }, createError(404, 'User not found'));
};

let remoteRouter = module.exports = exports = Router();

remoteRouter.post('/remote', jsonParser, findUser, (req, res, next) => {
  // let inputData = req.body;
  console.log(req.user);
  req.user.addRemote(req.body).then(res.json.bind(res), createError(404, 'asa'));
  // User.findById(inputData.userId).then(user => {
  //   user.addRemote(req.body).then(remote => {
  //     res.json(remote);
  //     next();
      
  //   }).catch(err => next());
  // }).catch(err => next(createError(err.statusCode, 'invalid user to add remote to')));
  // req.user.addRemote(req.body).then(res.json.bind(res), createError(400, 'Bad Request'));
});

remoteRouter.get('/remote/:id', (req, res, next) => {
  Remote.findById(req.params.id).then(remote => res.send(remote))
  .catch(err => next(createError(404, err.message)));
});

remoteRouter.put('/remote/:id', jsonParser, (req, res, next) => {
  Remote.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(remote => res.send(remote))
  .catch(next);
});

remoteRouter.delete('/remote/:id', jsonParser, (req, res, next) => {
  Remote.findById(req.params.id).then(remote => {
    return User.findById(remote.userId);
  }).then(user => {
    return user.removeRemoteById(req.params.id);
  }).then(remote => res.json(remote)).catch(next);
});