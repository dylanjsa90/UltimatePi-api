'use strict';

const mongoose = require('mongoose');
const Promise = require('../lib/promise');
mongoose.promise = Promise;
const serverError = require ('debug')('ultPie_api:test_error');
mongoose.connect('mongodb://localhost/routes_tests');
const createError = require('http-errors');
let app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const lirc = require('lirc_node');
lirc.init();

const authRoute = require('../routes/auth-router.js');

app.use('/api', authRoute);

app.use('/api/remote/:button', (req, res, next) => {
  if (!req.params.button) {
    io.emit('error', 'error');
    return next(createError(400, 'Invalid Button'));
  }
  io.emit('post', [req.params.button]);
  res.status(200).send('sent ' + req.params.button + ' to remote.');
  next();
});

app.use((err, req, res, next) =>{
  serverError(err);
  res.status(err.statusCode || 500).json(err.message);
  next();
});

module.exports = exports = app;
