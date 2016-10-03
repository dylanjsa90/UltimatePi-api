'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const createError = require('http-errors');
const User = require('../model/user');
const Remote = require('../model/remote');

let userRouter = module.exports = exports = new Router();

userRouter.post('/user', jsonParser, (req, res, next) => {
  //it seems like you're doubling down with the username requirement
  //I see both here and in your model file, I would pick one to do error
  //handling, will make the codebase easier to maintain.
  if (!req.body.username) return next(createError(400, 'ERROR: username is required'));
  new User(req.body).save().then(user => {
    res.json(user);
  }).catch(next);
});

// For testing purposes
userRouter.get('/users', (req,res,next) => {
  User.find({}).populate('remotes').then(users => res.send(users)).catch(next);
});

userRouter.get('/user/:id', (req, res, next) => {
  console.log(req.params);
  User.findOne({_id: req.params.id}).populate('remotes').then(user => res.send(user))
    .catch(err => next(createError(404, err.message)));
});

userRouter.put('/user/:id', jsonParser, (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(user => res.send(user)).catch(next);
});

userRouter.delete('/user/:id', jsonParser, (req, res, next) => {
  let result;
  User.findByIdAndRemove(req.params.id).then(user => {
    result = user;
    return Remote.remove({userId: user._id});
  }).then(() => res.json(result)).catch(next);
  //are you actually doing anything with the result on the client side?
  //if not I would maybe send something else back that way there's no need
  //for a variable outside the promise scope. You should in general try to
  //avoid that but for uses this simple it's fine.
});
