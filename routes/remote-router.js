'use strict';

const app = require('express');
const Router = app.Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
  req.user.addRemote(req.body).then(res.json.bind(res), createError(404, 'User not found'));
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

remoteRouter.post('/remote/:name/:button', (req, res, next)=>{
  if(!req.params.name){
    return res.sendError(createError(400, 'Invalid Remote Name'));
  }
  if(!req.params.button){
    return res.sendError(createError(400, 'Invalid Button Name'));
  }
  Remote.find({'name': req.params.name}, (err, found)=>{
    if(!found || found === undefined){
      return res.sendError(createError(400, 'Remote not found'));
    }
    if(!found.indexOf(req.params.button) || found.indexOf(req.params.button === null)){
      return res.sendError(createError(400, 'Button Not Found'));
    }
    io.emit('post', [req.params.name, req.params.button]);
    next();
    return res.status(200).send('sent ' + req.params.button + ' to ' + req.params.name);
  });
});
