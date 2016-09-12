'use strict';

const createError = require('http-errors');

module.exports = exports = function(req, res, next) {
  if(!req.headers.authorization) return next(createError(401, 'requires authorization header'));
  let credentials = req.headers.authorization.split(' ')[1];
  let authBuff = new Buffer(credentials, 'base64');
  credentials = authBuff.toString('utf8').split(':');
  req.auth = {
    username: credentials[0],
    password: credentials[1]    
  };
  authBuff.fill(0);
  if(!req.auth.username || !req.auth.password) return next(createError(401, 'No username or password'));
  next();
  
  // try {
  //   let basicString= req.headers.authorization.split(' ')[1];
  //   let authBuffer = new Buffer(basicString, 'base64');
  //   let authArray = authBuffer.toString().split(':');
  //   req.auth = {
  //     username: authArray[0],
  //     password: authArray[1]
  //   };
  //   authBuffer.fill(0);
  //   next();
  // } catch (e) {
  //   e.statusCode = 400;
  //   e.message = 'invalid BasicHTTP authentication';
  //   next();
  // }
};