'use strict';

const createError = require('http-errors');

module.exports = function handleError(err, req, res, next){
  if (err.status && err.message){
    console.log('Error Handled by Error Handling');
    res.status(err.status).send(err.message);
    next();
    return;
  }
  err = createError(500,'is this the fucking error we keep getting?');
  res.status(err.status).send(err.name);
};
